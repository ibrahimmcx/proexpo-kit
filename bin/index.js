#!/usr/bin/env node

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
  case "create":
    const projectName = args[1];
    createProject(projectName);
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
Pro-Expo-Kit CLI (Node.js)

Usage:
  kit create <name>            Create a new smart Expo project
  kit add <feature>            Add a feature (e.g., auth, firebase, ui)
  kit doctor                   Automatically fix project & SDK issues
  kit optimize                 Audit project performance (assets, deps, code)
  kit ai <prompt>              Generate code using Pro-Expo AI (Gemini)
  kit set-key <key>            Set your Gemini API Key
  kit archive "title" "content"   Archive a new knowledge item
  kit check                   Run environment health report
  kit search "query"              Search knowledge base index
  kit open "query"                Open a döküman in default editor
  kit scaffold                Create standard project structure
  kit status                  Show kit memory and agent status
  kit reindex                 Rebuild the knowledge index
`);
}
