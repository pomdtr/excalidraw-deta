#!/usr/bin/env node

import minimist from "minimist";
import fs from "fs/promises";
import path from "path";
import fse from "fs-extra";
import tildify from "tildify";

const argv = minimist(process.argv.slice(2));
if (!argv.env) {
  console.error("Missing --env argument");
  process.exit(1);
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.join(__dirname, "..");
const assetFolder =
  argv.env == "prod" ? "excalidraw-assets" : "excalidraw-assets-dev";
const src = path.join(
  root,
  "node_modules",
  "@excalidraw",
  "excalidraw",
  "dist",
  assetFolder
);
const dest = path.join(root, "public", assetFolder);
console.log(`Copying assets from ${tildify(src)} to ${tildify(dest)}`);

await fs.rm(dest, { recursive: true, force: true });
await fse.copy(src, dest);
