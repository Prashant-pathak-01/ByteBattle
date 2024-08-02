// websocket.js
import { WebSocketServer } from "ws";
import axios from "axios";
import { JSDOM } from "jsdom";

const games = [];
const page = {};
let pendingUser = null;

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", async (data) => {
      data = JSON.parse(data.toString());

      if (data.type === "add") {
        if (!page[data.url]) page[data.url] = [];
        page[data.url].push(ws);
      } else if (data.type === "join") {
        const currentEmail = data.email;
        const currentCfHandle = data.cfHandle;

        if (pendingUser && currentEmail !== pendingUser.email) {
          const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let url = "";
          for (let i = 0; i < 4; i++) {
            url += all[Math.floor(Math.random() * 26)];
          }

          const apiCodeforces = await axios.get(
            "https://codeforces.com/api/problemset.problems"
          );
          const problemsList = apiCodeforces.data.result.problems;
          const filteredProblems = problemsList.filter(
            (problem) => problem.rating <= 1700
          );
          const randomIndex = Math.floor(
            Math.random() * filteredProblems.length
          );
          const finalProblem = filteredProblems[randomIndex];

          games.push({
            ws1: ws,
            email1: currentEmail,
            cfHandle1: currentCfHandle,
            ws2: pendingUser.ws,
            email2: pendingUser.email,
            cfHandle2: pendingUser.cfHandle,
            finalProblem,
            url: url,
          });

          ws.send(url);
          pendingUser.ws.send(url);
          pendingUser = null;
        } else {
          pendingUser = { ws, email: currentEmail, cfHandle: currentCfHandle };
        }
      } else if (data.type === "refresh") {
        console.log("refreshing");
        [...Array(20)].forEach((_, i) =>
          setTimeout(() => sendMessageToAll(), i * 4000)
        );
      }
    });

    const checkLatestSubmission = async (cfHandle, finalProblem) => {
      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=1`
        );
        const latestSubmission = response.data.result[0];

        if (
          latestSubmission &&
          latestSubmission.problem.contestId === finalProblem.contestId &&
          latestSubmission.problem.index === finalProblem.index
        ) {
          return true;
        }
      } catch (error) {
        console.error("Error fetching latest submission:", error);
      }
      return false;
    };

    const sendMessageToAll = async () => {
      for (let i = games.length - 1; i >= 0; i--) {
        const game = games[i];
        try {
          const cf1Matches = await checkLatestSubmission(
            game.cfHandle1,
            game.finalProblem
          );
          const cf2Matches = await checkLatestSubmission(
            game.cfHandle2,
            game.finalProblem
          );
          if (cf1Matches || cf2Matches) {
            for (let j = 0; j < page[game.url]?.length; ++j) {
              if (cf1Matches) {
                page[game.url][j].send(`${game.cfHandle1}`);
              } else if (cf2Matches) {
                page[game.url][j].send(`${game.cfHandle2}`);
              }
            }
          }
        } catch (error) {
          console.error("Error checking latest submission:", error);
        }
      }
    };

    ws.on("close", () => {
      if (pendingUser === ws) pendingUser = null;
    });
  });
};

export const getQuestionDetails = async (req, res) => {
  try {
    const response = await axios.get(req.body.url);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const problemStatement =
      document.querySelector(".header")?.nextElementSibling?.innerHTML.trim() ||
      "";
    const inputSpecification =
      document.querySelector(".input-specification")?.innerHTML.trim() || "";
    const outputSpecification =
      document.querySelector(".output-specification")?.innerHTML.trim() || "";

    const sampleInputs = [];
    const sampleOutputs = [];

    document.querySelectorAll(".sample-test").forEach((test) => {
      const input = test.querySelector(".input pre")?.innerHTML.trim() || "";
      const output = test.querySelector(".output pre")?.innerHTML.trim() || "";
      sampleInputs.push(input);
      sampleOutputs.push(output);
    });
    return res.status(200).json({
      problemStatement,
      inputSpecification,
      outputSpecification,
      sampleInputs,
      sampleOutputs,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getCFurl = async (req, res) => {
  let { email, location } = req.body;
  location = location.substring(1);
  games.forEach((game) => {
    if (game.url === location) {
      const msg = `https://codeforces.com/contest/${game.finalProblem.contestId}/problem/${game.finalProblem.index}`;
      return res.json({
        success: true,
        message: msg,
        p1: game.cfHandle1,
        p2: game.cfHandle2,
      });
    }
  });
};

export const updateGameResult = async (req, res) => {
  console.log(req);
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ Email: email });
    if (!user) {
      let newUser = new User({ Email: email });
      await newUser.save();
      user = newUser;
    }

    if (req.body.result == 1) user.Win = user.Win + 1;
    else user.Loose = user.Loose + 1;

    await user.save();
    return res.status(200).json({ message: "Updated" });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Some error occurred" });
  }
};
