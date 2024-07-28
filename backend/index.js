import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import database from "./Database/db.js";
import Routes from "./Routes/Route.js";
import WebSocket, { WebSocketServer } from "ws";
import axios from "axios";

import { JSDOM } from "jsdom";
const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const games = [];
const page = {};
var pendingUser = null;

app.post("/getCFurl", (req, res) => {
  let { email, location } = req.body;

  console.log("Received email:", email);
  console.log("Received location:", location);
  location = location.substr(1);
  games.forEach((game) => {
    if (game.url === location) {
      const msg = `https://codeforces.com/contest/${game.randomProblem.contestId}/problem/${game.randomProblem.index}`;
      res.json({ success: true, message: msg });
      // return;
    }
  });
});

app.post("/getHTML", (req, res) => {
  let { url } = req.body;
  console.log(url);

  axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Extract problem statement using class name
      // const problemStatement = document.querySelector('.problem-statement')?.innerHTML || '';
      // Extract problem statement
      const problemStatement =
        document
          .querySelector(".header")
          ?.nextElementSibling?.innerHTML.trim() || "";

      // Extract input specification
      const inputSpecification =
        document.querySelector(".input-specification")?.innerHTML.trim() || "";

      // Extract output specification
      const outputSpecification =
        document.querySelector(".output-specification")?.innerHTML.trim() || "";

      // Extract sample input and output
      const sampleInputs = [];
      const sampleOutputs = [];

      document.querySelectorAll(".sample-test").forEach((test) => {
        const input = test.querySelector(".input pre")?.innerHTML.trim() || "";
        const output =
          test.querySelector(".output pre")?.innerHTML.trim() || "";
        sampleInputs.push(input);
        sampleOutputs.push(output);

        // console.log(input+" aa ")
      });

      // console.log(problemStatement);
      // console.log(sampleInputs);
      // console.log(sampleOutputs);

      res.json({
        problemStatement,
        inputSpecification,
        outputSpecification,
        sampleInputs,
        sampleOutputs,
      });
      // return;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    });
});

app.use("/", Routes);

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", async (data) => {
    // console.log(data.toString())
    var dupData = data;
    data = JSON.parse(data.toString());
    console.log(data);

    if (data.type === "add") {
      console.log(data.type);
      console.log(data.url);
      if (!page[data.url]) page[data.url] = [];
      page[data.url].push(ws);
      console.log(page[data.url].length);
      console.log(data.url.toString());
    }

    if (data.type === "join") {
      const currentEmail = data.email;
      const currentCfHandle = data.cfHandle;
      if (pendingUser) {
        const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var url = all[Math.floor(Math.random() * 26)];
        url += all[Math.floor(Math.random() * 26)];
        url += all[Math.floor(Math.random() * 26)];
        url += all[Math.floor(Math.random() * 26)];

        const response = await axios.get(
          "https://codeforces.com/api/problemset.problems"
        );
        const problems = response.data.result.problems;

        const filteredProblems = problems.filter(
          (problem) => problem.rating <= 1700
        );
        const randomIndex = Math.floor(Math.random() * filteredProblems.length);
        const randomProblem = filteredProblems[randomIndex];
        // console.log(randomProblem)
        games.push({
          ws1: ws,
          email1: currentEmail,
          cfHandle1: currentCfHandle,
          ws2: pendingUser.ws,
          email2: pendingUser.email,
          cfHandle2: pendingUser.cfHandle,
          randomProblem,
          url: url,
        }); // a random problem
        ws.send(url);
        pendingUser.ws.send(url);
        pendingUser = null;
      } else {
        pendingUser = { ws, email: currentEmail, cfHandle: currentCfHandle };
      }
    } else if (data.type === "refresh") {
      [...Array(5)].forEach((_, i) =>
        setTimeout(() => sendMessageToAll(), i * 10000)
      );
    }
  });
  // Function to check if the latest submission matches the random problem
  const checkLatestSubmission = async (cfHandle, randomProblem) => {
    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=1`
      );
      const latestSubmission = response.data.result[0];
      // console.log(latestSubmission)
      // console.log(randomProblem)
      // Check if latest submission problem matches the random problem
      if (
        latestSubmission &&
        latestSubmission.problem.contestId === randomProblem.contestId &&
        latestSubmission.problem.index === randomProblem.index
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
      // console.log(game.randomProblem);
      try {
        const cf1Matches = await checkLatestSubmission(
          game.cfHandle1,
          game.randomProblem
        );
        const cf2Matches = await checkLatestSubmission(
          game.cfHandle2,
          game.randomProblem
        );
        console.log(cf1Matches + " " + cf2Matches);
        // to all people currently on game.url send alert of who won
        console.log(game.url);
        for (let j = 0; j < page[game.url].length; ++j) {
          if (cf1Matches) page[game.url][j].send(`${game.cfHandle1} won`);
          else if (cf2Matches) page[game.url][j].send(`${game.cfHandle2} won`);
        }
      } catch (error) {
        console.error("Error checking latest submission:", error);
      }
    }
  };

  // setInterval(sendMessageToAll,5000);

  // ws.on('close',() => {
  //   if(pendingUser==ws){
  //     pendingUser=null;
  //   }else{
  //     games.forEach((game, index) => {
  //       if(game.ws === ws || game.pendingUser === ws){
  //         if (game.ws.readyState === WebSocket.OPEN) {
  //           game.ws.send('done');
  //       }
  //       if (game.pendingUser && game.pendingUser.readyState === WebSocket.OPEN) {
  //           game.pendingUser.send('done');
  //       }
  //       games.splice(index, 1);
  //       return;
  //       }
  //     })
  //   }
  // });
  ws.on("close", () => {
    if (pendingUser == ws) pendingUser = null;
  });
});

database();
app.listen(8000, () => {
  console.log("Running on port 8000");
});
