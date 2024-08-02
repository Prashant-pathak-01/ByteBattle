import React, { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(0); // Time in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

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
