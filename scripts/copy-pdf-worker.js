const fs = require("fs");
const path = require("path");

const src = path.join(
  __dirname,
  "..",
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs",
);
const dest = path.join(__dirname, "..", "public", "pdf.worker.min.mjs");

try {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("Copied pdf.worker.min.mjs to public/");
} catch (err) {
  console.warn("Could not copy PDF.js worker:", err.message);
}
