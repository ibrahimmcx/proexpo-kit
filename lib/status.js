import fs from "fs";
import { log } from "./utils.js";

export function status() {
  log.bold("--- Pro-Expo-Kit Status (Node.js) ---");
  const knowledgeDir = ".agent/knowledge";
  
  if (fs.existsSync(knowledgeDir)) {
    const items = fs.readdirSync(knowledgeDir).filter(f => f.endsWith(".md"));
    console.log(`[Memory] ${items.length} knowledge items stored.`);
  } else {
    console.log("[Memory] Empty.");
  }
  
  const agentsDir = ".agent/agents";
  if (fs.existsSync(agentsDir)) {
    const agents = fs.readdirSync(agentsDir);
    console.log(`[Agents] ${agents.length} specialist personas active.`);
  }
  
  console.log("------------------------------------");
}
