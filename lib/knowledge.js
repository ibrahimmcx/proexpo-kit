import fs from "fs";
import path from "path";
import { log, slugify, openFile } from "./utils.js";

const KNOWLEDGE_DIR = ".agent/knowledge";
const INDEX_FILE = path.join(KNOWLEDGE_DIR, "index.json");

function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveIndex(index) {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
  }
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

function updateIndex(title, filename, tags = []) {
  const index = loadIndex();
  index[title] = {
    filename,
    tags,
    lastUpdated: new Date().toISOString()
  };
  saveIndex(index);
}

function detectTags(title, content) {
  const mappings = {
    "#bug": ["error", "fix", "issue", "problem", "solve", "hata", "cozum"],
    "#ui": ["css", "style", "animation", "premium", "font", "color", "tasarim"],
    "#config": ["package.json", "setup", "install", "environment", "kurulum"],
    "#expo": ["sdk", "eas", "native", "ios", "android"],
    "#agent": ["protocol", "instruction", "behavior", "ajan"]
  };
  
  const tags = ["#learned", "#auto-archived"];
  const combined = (title + " " + content).toLowerCase();
  
  Object.keys(mappings).forEach(tag => {
    if (mappings[tag].some(kw => combined.includes(kw))) {
      tags.push(tag);
    }
  });
  
  return [...new Set(tags)];
}

export function archive(title, content = "Manual entry") {
  if (!title) return log.error("Title required");

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
  }

  const token = slugify(title);
  const filename = `solution-${token}.md`;
  const filepath = path.join(KNOWLEDGE_DIR, filename);

  const tags = detectTags(title, content);
  
  const template = `# ${title}

> Created: ${new Date().toISOString()}
> Tags: ${tags.join(", ")}

## Problem
...

## Solution
${content}
`;

  fs.writeFileSync(filepath, template);
  updateIndex(title, filename, tags);
  log.success(`Archived: ${filepath}`);
}

export function search(query) {
  if (!query) return log.error("Search query required");
  const index = loadIndex();
  
  log.info(`Searching for '${query}'...`);
  let found = false;
  
  Object.keys(index).forEach(title => {
    const info = index[title];
    if (title.toLowerCase().includes(query.toLowerCase()) || 
        info.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) {
      log.bold(`  - ${title}`);
      console.log(`    File: ${info.filename}`);
      found = true;
    }
  });
  
  if (!found) log.warn("No matches found in index.");
}

export function openKnowledge(query) {
  if (!query) return log.error("Search query for opening required");
  const index = loadIndex();
  
  const bestMatch = Object.keys(index).find(title => 
    title.toLowerCase().includes(query.toLowerCase()) || 
    index[title].filename.toLowerCase().includes(query.toLowerCase())
  );
  
  if (bestMatch) {
    const filepath = path.join(KNOWLEDGE_DIR, index[bestMatch].filename);
    log.info(`Opening ${index[bestMatch].filename}...`);
    openFile(filepath);
  } else {
    log.warn(`No match found for '${query}'.`);
  }
}

export function reindex() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return log.error("Knowledge base empty");
  
  log.info("Re-indexing knowledge base...");
  const index = {};
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith(".md"));
  
  files.forEach(filename => {
    try {
      const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, filename), "utf-8");
      const titleMatch = content.split("\n")[0].replace("# ", "").trim();
      const tagsMatch = content.match(/> Tags: (.*)/);
      const tags = tagsMatch ? tagsMatch[1].split(", ").map(t => t.trim()) : [];
      
      index[titleMatch] = {
        filename,
        tags,
        lastUpdated: new Date().toISOString()
      };
    } catch (e) {}
  });
  
  saveIndex(index);
  log.success("Re-indexing complete.");
}
