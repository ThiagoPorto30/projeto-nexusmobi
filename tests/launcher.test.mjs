import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const launcher = path.join(root, "scripts", "open-presentation.ps1");
async function freePort() {
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}
async function launch(port) {
  const logDir = fs.mkdtempSync(path.join(root, "artifacts", "launcher-test-"));
  const stdoutPath = path.join(logDir, "out.log");
  const stderrPath = path.join(logDir, "error.log");
  const output = fs.openSync(stdoutPath, "w");
  const errors = fs.openSync(stderrPath, "w");
  const child = spawn(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      launcher,
      "-Port",
      String(port),
      "-NoBrowser",
    ],
    { cwd: root, windowsHide: true, stdio: ["ignore", output, errors] },
  );
  fs.closeSync(output);
  fs.closeSync(errors);
  const code = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error("Launcher did not exit within 60 seconds"));
    }, 60000);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timeout);
      resolve(code);
    });
  });
  const result = {
    stdout: fs.readFileSync(stdoutPath, "utf8"),
    stderr: fs.readFileSync(stderrPath, "utf8"),
  };
  if (code !== 0)
    throw Object.assign(new Error(`Launcher exited with ${code}`), result);
  return result;
}
test("starts the production app and reuses the same owned process", async () => {
  const port = await freePort();
  const statePath = path.join(root, "artifacts", `presentation-${port}.json`);
  let pid;
  try {
    const first = await launch(port);
    assert.match(first.stdout, /PRONTO/);
    const state = JSON.parse(
      fs.readFileSync(statePath, "utf8").replace(/^\uFEFF/, ""),
    );
    pid = state.pid;
    const response = await fetch(`http://127.0.0.1:${port}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /nexus\.mobi/);
    const second = await launch(port);
    assert.match(second.stdout, /REUTILIZADO/);
    assert.equal(
      JSON.parse(fs.readFileSync(statePath, "utf8").replace(/^\uFEFF/, "")).pid,
      pid,
    );
  } finally {
    if (pid) process.kill(pid);
  }
});
test("rejects an unrelated listener even if it returns a Nexus title, without stopping it", async () => {
  const port = await freePort();
  const foreign = spawn(
    process.execPath,
    [
      "-e",
      `require('http').createServer((q,s)=>s.end('<title>nexus.mobi</title>')).listen(${port},'127.0.0.1',()=>console.log('ready'))`,
    ],
    { windowsHide: true },
  );
  try {
    await new Promise((resolve, reject) => {
      foreign.stdout.once("data", resolve);
      foreign.once("error", reject);
    });
    await assert.rejects(launch(port), (error) => {
      assert.match(error.stdout + error.stderr, /PORTA OCUPADA/);
      return true;
    });
    assert.equal((await fetch(`http://127.0.0.1:${port}`)).status, 200);
  } finally {
    foreign.kill();
  }
});
