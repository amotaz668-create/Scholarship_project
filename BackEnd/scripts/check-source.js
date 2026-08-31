const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const backendRoot = path.resolve(__dirname, "..");
const sourceFolders = [
  "controller",
  "middlewares",
  "models",
  "routes",
  "services",
  "validators",
  "seed",
  "scripts",
];
const files = [path.join(backendRoot, "app.js"), path.join(backendRoot, "server.js")];

const collectJavaScript = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectJavaScript(fullPath);
    if (entry.isFile() && entry.name.endsWith(".js")) files.push(fullPath);
  }
};

sourceFolders.forEach((folder) => collectJavaScript(path.join(backendRoot, folder)));

for (const file of [...new Set(files)]) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`Backend syntax check passed (${new Set(files).size} files).`);
