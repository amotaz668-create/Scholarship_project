const { spawn } = require("node:child_process");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const processes = [
  spawn(npmCommand, ["--prefix", "BackEnd", "run", "dev"], { stdio: "inherit" }),
  spawn(npmCommand, ["--prefix", "FrontEnd", "start"], { stdio: "inherit" }),
];

let stopping = false;

const stopAll = () => {
  if (stopping) return;
  stopping = true;
  processes.forEach((child) => {
    if (!child.killed) child.kill();
  });
};

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);

processes.forEach((child) => {
  child.on("exit", (code) => {
    if (!stopping && code && code !== 0) {
      process.exitCode = code;
      stopAll();
    }
  });
});
