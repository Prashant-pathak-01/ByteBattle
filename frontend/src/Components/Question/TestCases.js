import React from "react";
import { useState } from "react";
export const TestCases = ({ testcases, setTestcases, output }) => {
  return (
    <div className="rounded-lg bg-Color02 h-2/5  flex flex-col p-4 ">
      <h1 className="text-2xl font-semibold text-Color07">TestCases</h1>
      <div className="flex md:flex-row flex-col justify-center items-center">
        <div className="md:mr-10">
          <h2 className="text-Color07 font-mono ml-4 mt-4">Input</h2>
          <textarea
            className="w-60 h-40 mt-2 rounded-lg p-4 text-white font-semibold resize-none bg-slate-800 border-2 border-black"
            value={testcases}
            onChange={(e) => setTestcases(e.target.value)}
          ></textarea>
        </div>
        <div className="md:ml-10">
          <h2 className="text-Color07 font-mono ml-4 mt-4">Output</h2>
          <textarea
            className="w-60 h-40 mt-2 rounded-lg p-4 text-white resize-none font-semibold bg-slate-800 border-2 border-black"
            value={output}
          ></textarea>
        </div>
      </div>
    </div>
  );
};
export default TestCases;
