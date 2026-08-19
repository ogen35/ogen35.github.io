import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const outputDir = resolve(projectRoot, "pages-dist");
const port = 4173;
const localOrigin = `http://127.0.0.1:${port}`;
const publicOrigin = "https://ogen35.github.io";

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
cpSync(resolve(projectRoot, "dist/client"), outputDir, { recursive: true });

const server = spawn("npm", ["run", "start", "--", "--port", String(port)], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(localOrigin);
      if (response.ok) return response.text();
    } catch {
      // The server is still starting.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  throw new Error("Timed out while preparing the GitHub Pages export.");
}

try {
  const html = (await waitForServer())
    .replaceAll(localOrigin, publicOrigin)
    .replaceAll('"initialCacheKind":"dynamic"', '"initialCacheKind":"static"');
  writeFileSync(resolve(outputDir, "index.html"), html);
  writeFileSync(resolve(outputDir, "404.html"), html);
  writeFileSync(resolve(outputDir, ".nojekyll"), "");
  console.log(`GitHub Pages export ready at ${outputDir}`);
} finally {
  server.kill("SIGTERM");
}
