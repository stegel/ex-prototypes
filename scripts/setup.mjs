#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const CONFIG_PATH = path.join(process.cwd(), ".designer.json");

if (fs.existsSync(CONFIG_PATH)) {
  const existing = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  console.log(`\nAlready set up as: ${existing.designer} (${existing.email})`);
  console.log("Delete .designer.json to reconfigure.\n");
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

const email = await ask("Enter your ServiceNow email: ");
rl.close();

if (!email || !email.includes("@")) {
  console.error("Invalid email address.");
  process.exit(1);
}

// Derive designer name: strip domain, replace dots with hyphens
const designer = email.split("@")[0].replace(/\./g, "-").toLowerCase();

// Write config
const config = { email, designer };
fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");

// Create designer folder
const designerDir = path.join(process.cwd(), "src", "prototypes", designer);
if (!fs.existsSync(designerDir)) {
  fs.mkdirSync(designerDir, { recursive: true });
  console.log(`\nCreated folder: src/prototypes/${designer}/`);
}

console.log(`\nSetup complete! Your designer name is: ${designer}`);
console.log(`Create a prototype with: npm run new "My Prototype"\n`);
