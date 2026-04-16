#!/usr/bin/env node

import chalk from "chalk";
import { archive, search, openKnowledge, reindex } from "../lib/knowledge.js";
import { check } from "../lib/checker.js";
import { scaffold } from "../lib/scaffold.js";
import { status } from "../lib/status.js";
import { createProject } from "../lib/creator.js";
import { addFeature } from "../lib/feature.js";
import { doctor } from "../lib/doctor.js";
import { askAI } from "../lib/ai.js";
import { setConfig } from "../lib/config.js";
import { optimize } from "../lib/optimizer.js";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "init":
  case "create":
    const projectName = args[1];
    await createProject(projectName);
    break;

  case "firebase":
    if (args[1] === "url") {
      setConfig("firebase-url", args[2]);
      console.log(chalk.green(`✔ Firebase URL set to: ${args[2]}`));
    } else {
      console.log(chalk.yellow("Usage: kit firebase url <url>"));
    }
    break;

  case "add":
    const featureName = args[1];
    addFeature(featureName);
    break;

  case "doctor":
    doctor();
    break;

  case "optimize":
    optimize();
    break;

  case "ai":
    const prompt = args.slice(1).join(" ");
    askAI(prompt);
    break;

  case "set-key":
    const key = args[1];
    setConfig("gemini-api-key", key);
    break;

  case "archive":
    const title = args[1];
    const content = args.slice(2).join(" ");
    archive(title, content);
    break;

  case "check":
    check();
    break;

  case "search":
    search(args[1]);
    break;

  case "open":
    openKnowledge(args[1]);
    break;

  case "scaffold":
    scaffold();
    break;

  case "status":
    status();
    break;

  case "reindex":
    reindex();
    break;

  default:
    console.log(`
${chalk.bold.cyan("🚀 PRO-EXPO-KIT CLI")}
${chalk.gray("Developer accelerator for Expo SDK 54")}

${chalk.bold("Usage:")}
  ${chalk.cyan("kit init <name>")}            ${chalk.gray("Create a new premium Expo project")}
  ${chalk.cyan("kit add <feature>")}           ${chalk.gray("Add features (auth, firebase, ui)")}
  ${chalk.cyan("kit firebase url <url>")}      ${chalk.gray("Configure Firebase URL")}
  ${chalk.cyan("kit doctor")}                  ${chalk.gray("Auto-fix project & SDK issues")}
  ${chalk.cyan("kit optimize")}                ${chalk.gray("Audit performance (assets, deps)")}
  ${chalk.cyan("kit ai <prompt>")}             ${chalk.gray("Generate code with Gemini AI")}
  ${chalk.cyan("kit set-key <key>")}           ${chalk.gray("Set Gemini API Key")}
  ${chalk.cyan("kit check")}                   ${chalk.gray("Run health report")}
  ${chalk.cyan("kit scaffold")}                ${chalk.gray("Create standard folder structure")}
  ${chalk.cyan("kit status")}                  ${chalk.gray("Show CLI & Agent status")}
`);
}
