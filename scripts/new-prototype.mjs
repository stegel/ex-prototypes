#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const CONFIG_PATH = path.join(process.cwd(), ".designer.json");

// Parse args: either (name) or (designer, name)
const args = process.argv.slice(2);
let designer, name;

if (args.length === 2) {
  [designer, name] = args;
} else if (args.length === 1) {
  name = args[0];
  // Read designer from .designer.json
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(
      "No .designer.json found. Run `npm run setup` first, or provide a designer name:\n" +
        '  npm run new <designer-name> "Prototype Name"'
    );
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  designer = config.designer;
} else {
  console.error(
    'Usage: npm run new "Prototype Name"\n' +
      '       npm run new <designer-name> "Prototype Name"\n\n' +
      "If you haven't run setup yet: npm run setup"
  );
  process.exit(1);
}

const slug = name.toLowerCase().replace(/\s+/g, "-");
const targetDir = path.join(process.cwd(), "src", "prototypes", designer, slug);
const templateDir = path.join(process.cwd(), "src", "prototypes", "_template");

if (fs.existsSync(targetDir)) {
  console.error(`Prototype already exists at ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

// Copy and customize meta.json
const meta = JSON.parse(
  fs.readFileSync(path.join(templateDir, "meta.json"), "utf-8")
);
meta.title = name;
meta.author = designer;
meta.date = new Date().toISOString().split("T")[0];
fs.writeFileSync(
  path.join(targetDir, "meta.json"),
  JSON.stringify(meta, null, 2) + "\n"
);

// Copy page.tsx
fs.copyFileSync(
  path.join(templateDir, "page.tsx"),
  path.join(targetDir, "page.tsx")
);

// Copy CLAUDE.md if it exists
const claudeMdPath = path.join(templateDir, "CLAUDE.md");
if (fs.existsSync(claudeMdPath)) {
  fs.copyFileSync(claudeMdPath, path.join(targetDir, "CLAUDE.md"));
}

console.log(`\nCreated prototype at: src/prototypes/${designer}/${slug}/`);
console.log(
  `View at: http://localhost:3000/prototypes/${designer}/${slug}\n`
);
