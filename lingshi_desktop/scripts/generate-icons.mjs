#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const assetsDir = join(projectRoot, "assets");
const workspaceRoot = resolve(projectRoot, "..", "..", "..");
const preferredAbsoluteSource = "/Users/fanyuhang/Documents/lingshi_project/assets/logo.png";
const localFallbackSource = join(assetsDir, "logo.png");

const sourceArg = process.argv[2]?.trim();
const sourceCandidates = [
  sourceArg,
  process.env.LINGSHI_LOGO_SOURCE,
  preferredAbsoluteSource,
  localFallbackSource,
].filter(Boolean);
const sourcePath =
  sourceCandidates.find((candidate) => existsSync(candidate)) || sourceCandidates[0];
const trayPath = join(assetsDir, "trayTemplate.png");
const icoPath = join(assetsDir, "icon.ico");
const icnsPath = join(assetsDir, "icon.icns");
const forceRegenerate = process.env.FORCE_ICON_GENERATE === "1";

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: opts.cwd ?? projectRoot,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(`command_failed: ${cmd} ${args.join(" ")}\n${detail}`);
  }
  return result;
}

function main() {
  console.log(`[icons] source: ${sourcePath}`);
  mkdirSync(assetsDir, { recursive: true });
  const outputsExist = [trayPath, icoPath, icnsPath].every((file) => existsSync(file));
  if (outputsExist && !forceRegenerate) {
    console.log("[icons] existing generated assets found, reuse without regeneration");
    console.log(`[icons] keep: ${icoPath}`);
    console.log(`[icons] keep: ${icnsPath}`);
    console.log(`[icons] keep: ${trayPath}`);
    return;
  }

  const py = `
from PIL import Image
from pathlib import Path
import sys

source = Path(sys.argv[1]).expanduser()
tray_path = Path(sys.argv[2])
ico_path = Path(sys.argv[3])
icns_path = Path(sys.argv[4])

if not source.exists():
    raise SystemExit(f"source_not_found: {source}")

img = Image.open(source).convert("RGBA")
w, h = img.size
side = max(w, h)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(img, ((side - w) // 2, (side - h) // 2))
base = square.resize((1024, 1024), Image.Resampling.LANCZOS)

base.resize((32, 32), Image.Resampling.LANCZOS).save(tray_path, format="PNG")
base.save(
    ico_path,
    format="ICO",
    sizes=[(16,16), (24,24), (32,32), (48,48), (64,64), (128,128), (256,256)]
)
base.save(
    icns_path,
    format="ICNS",
    sizes=[(16,16), (32,32), (64,64), (128,128), (256,256), (512,512), (1024,1024)]
)
`;

  try {
    run("python3", ["-c", py, sourcePath, trayPath, icoPath, icnsPath], {
      cwd: workspaceRoot,
    });
  } catch (error) {
    if (outputsExist) {
      console.warn(`[icons] generation failed, fallback to existing assets: ${error.message}`);
      return;
    }
    throw error;
  }

  console.log(`[icons] wrote: ${icoPath}`);
  console.log(`[icons] wrote: ${icnsPath}`);
  console.log(`[icons] wrote: ${trayPath}`);
}

main();
