import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pngPath = path.join(root, "public", "dndLogo.png");
const outPath = path.join(root, "public", "favicon.svg");

const b64 = fs.readFileSync(pngPath).toString("base64");
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#000"/>
  <image href="data:image/png;base64,${b64}" width="32" height="32" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
fs.writeFileSync(outPath, svg);
console.log("Wrote", outPath, "size", Buffer.byteLength(svg));
