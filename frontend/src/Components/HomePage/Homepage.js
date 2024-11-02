import { useUser } from "@clerk/clerk-react";
import RollingButton from "./RollingButton.js";
import GitHubIcon from "@mui/icons-material/GitHub";
import SWORD from "./../../Media/Homepage/swords.png";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import CFID_Modal from "./CFID_Modal.js";
import { userData } from "../../APIs/User.js";

function Home() {
  const [Matching, setMatching] = useState(false);
  const [socket, setSocket] = useState(null);
  const [openCFIDModal, setOpenCFIDModal] = useState(false);
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [User, setUser] = useState();

  useEffect(() => {
    const getData = async () => {
      if (isSignedIn) {
        let res = await userData({
          email: user?.primaryEmailAddress.emailAddress,
          name: user?.fullName,
          profile: user?.imageUrl,
        });
        setUser(res?.data);
      }
    };
    getData();
    const ws = new WebSocket("https://bytebattle.onrender.com/");
    setSocket(ws);
    ws.onmessage = (event) => {
      var dup = "/" + event.data;
      navigate(dup);
    };
    return () => {
      ws.close();
    };
  }, [isSignedIn, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col justify-between  bg-Color01">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mt-8">
          <div className="text-center">
            <div className="flex md:flex-row flex-col items-center w-full justify-center">
              <h2 className="font-bold mb-4 text-4xl text-blue-400">
                Welcome to{" "}
                <span className="text-blue-700 text-6xl">ByteBattle</span>
              </h2>
              <img
                src={SWORD}
                className="w-10 md:mt-0 mt-6 h-10 ml-4 mb-2"
                alt="SWORD"
              />
            </div>
            <p className="text-lg mb-4 text-Color07 p-16 font-medium leading-relaxed tracking-wide">
              Welcome to ByteBattle! Our website is designed to help beginners
              master the basics of programming through a curated collection of
              beginner-friendly questions. With detailed explanations and hints,
              you can easily grasp fundamental concepts and solve problems
              step-by-step. Track your progress, practice coding in various
              languages like Python, Java, and C++, and join a vibrant community
              of fellow learners. ByteBattle makes learning programming
              accessible, engaging, and fun. Start your coding journey with us
              today and build a solid foundation for your future in tech. Turn
              your coding aspirations into reality with ByteBattle!
            </p>
            <Link to="/sheet">
              <button className="relative inline-flex w-54 items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative text-lg w-54 px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  ByteBattle Sheet
                </span>
              </button>
            </Link>

            <button
              className="relative inline-flex w-54 items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              onClick={() => {
                if (!User) {
                  navigate("/signup");
                } else {
                  if (User.CFID == null) {
                    setOpenCFIDModal(true);
                  } else {
                    const message = JSON.stringify({
                      type: "join",
                      email: User.Email,
                      cfHandle: User.CFID,
                    });
                    socket.send(message);
                    setMatching(true);
                  }
                }
              }}
              // disabled={!User}
            >
              <span className="relative text-lg w-54 px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                ByteBattle Arena
              </span>
            </button>

            <p className="text-yellow-300 font-light text-sm mt-4">
              ⚠️ Sometimes Codeforces servers are down, so you might experience
              issues in the ByteBattle Arena. Please be patient!
            </p>

            {openCFIDModal && (
              <CFID_Modal
                open={openCFIDModal}
                close={() => setOpenCFIDModal(false)}
              />
            )}
          </div>
        </section>
        <section className="p-6 pt-0 bg-zinc-800 rounded-xl mt-10">
          <h1 className="text-center text-3xl font-bold text-white p-8 border-b-2 m-8">
            Platform Tour
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-between md:p-4">
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <iframe
                className="rounded-lg shadow-md border-8 border-zinc-900 w-full md:h-96"
                src="https://www.youtube.com/embed/ho8Si9Z67Cs"
                title="Website Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="w-full md:w-1/2 md:pl-20 text-white mt-4 md:mt-0 md:p-14">
              <p className="text-center font-light">
                Is the server down? No worries! Check out this quick tour video
                to get an insider's view of our platform. It's a fantastic
                resource to help you navigate our features while we resolve any
                issues.
              </p>
              <p className="mt-10 font-light text-center">
                ByteBattle is a competitive coding platform designed for
                beginners and experienced coders alike. It offers a variety of
                Data Structures and Algorithms (DSA) problems to practice,
                participate in real-time coding battles, and track your
                progress. Join our community, improve your coding skills, and
                challenge yourself against others in exciting contests!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-Color02 flex md:flex-row justify-center items-center flex-col shadow-b-lg shadow-black text-white py-4 px-8 text-center md:justify-between">
        <h1>&copy; 2024 ByteBattle. All rights reserved.</h1>
        <a
          href="https://github.com/Prashant-pathak-01/ByteBattle"
          target="_blank"
          className="scale-125 cursor-pointer md:m-0 m-4 hover:scale-150 transition-all hover:bg-white hover:text-Color01 rounded-full flex items-center"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
        <h1>
          <p className="font-semibold ml-4">Contributors</p>
          <a
            className=" text-blue-400 cursor-pointer hover:text-blue-700 pr-4"
            href="https://github.com/Prashant-pathak-01"
          >
            Prashant Pathak
          </a>
          &
          <a
            className=" text-blue-400 cursor-pointer hover:text-blue-700 pl-4 "
            href="https://github.com/BreakTos"
          >
            Parth Seth
          </a>
        </h1>
      </footer>

      {Matching && <RollingButton onClose={() => setMatching(!Matching)} />}
    </div>
  );
}

export default Home;
