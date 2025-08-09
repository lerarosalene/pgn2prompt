const p = require("node:path");
const fs = require("node:fs");
const esbuild = require("esbuild");
const sass = require("sass");

const fsp = fs.promises;

async function main() {
  await esbuild.build({
    entryPoints: [p.join("src", "index.ts")],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: p.join("dist", "index.bundle.js"),
  });

  await fsp.copyFile(p.join("src", "index.html"), p.join("dist", "index.html"));

  const { css } = sass.compile(p.join("src", "index.scss"), {
    style: "compressed",
  });
  await fsp.writeFile(p.join("dist", "index.bundle.css"), css);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
