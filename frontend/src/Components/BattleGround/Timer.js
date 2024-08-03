import React, { useState, useEffect } from "react";
import axios from "axios";

const Timer = ({ currentPath }) => {
  const [time, setTime] = useState(0); // Time in seconds
  const api = "http://localhost:8000";

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.post(`${api}/getTime`, {
          url: currentPath,
        });
        const { minutes, seconds } = response.data;
        const totalSeconds = minutes * 60 + seconds;
        setTime(totalSeconds);
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime(); // Fetch initial time on mount

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1); // Increment time every second
    }, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [currentPath]); // Dependency array includes currentPath

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <div className="flex items-center justify-center">
      <div className="p-4 bg-Color05 rounded-lg shadow-lg text-center animate-fadeIn w-full m-8 border-4 border-Color07">
        <div className="text-5xl font-mono font-bold text-Color07 flex flex-col items-center justify-center">
          <span className="inline-block align-middle m-2">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
