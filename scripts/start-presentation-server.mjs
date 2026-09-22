import { spawn } from "node:child_process";
import { openSync, closeSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error("Invalid presentation port");
}
const output = openSync(
  path.join(root, "artifacts", `presentation-${port}.log`),
  "a",
);
const errors = openSync(
  path.join(root, "artifacts", `presentation-${port}-error.log`),
  "a",
);
const server = spawn(
  process.execPath,
  [
    path.join(root, "node_modules", "next", "dist", "bin", "next"),
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    cwd: root,
    detached: true,
    windowsHide: true,
    stdio: ["ignore", output, errors],
  },
);
server.once("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.once("spawn", () => {
  console.log(server.pid);
  server.unref();
});
closeSync(output);
closeSync(errors);
