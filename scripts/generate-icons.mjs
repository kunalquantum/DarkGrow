import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "icons");
mkdirSync(outDir, { recursive: true });

// Minimal mark: a dark rounded square with a single ring + center dot,
// representing a life "moment" within the system. Calm, elegant, abstract.
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#111113"/>
  <circle cx="256" cy="256" r="128" fill="none" stroke="#f5f5f5" stroke-width="22"/>
  <circle cx="256" cy="256" r="34" fill="#f5f5f5"/>
</svg>
`;

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

// Maskable version with extra padding so the safe zone isn't clipped.
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#111113"/>
  <circle cx="256" cy="256" r="104" fill="none" stroke="#f5f5f5" stroke-width="20"/>
  <circle cx="256" cy="256" r="28" fill="#f5f5f5"/>
</svg>
`;

for (const { name, size } of sizes) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(outDir, name));
}

await sharp(Buffer.from(maskableSvg))
  .resize(512, 512)
  .png()
  .toFile(path.join(outDir, "icon-maskable-512.png"));

writeFileSync(path.join(outDir, "icon.svg"), svg.trim());

console.log("Icons generated in", outDir);
