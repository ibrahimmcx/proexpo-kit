import fs from 'fs';
import path from 'path';
import os from 'os';
import { log } from './utils.js';

const CONFIG_DIR = path.join(os.homedir(), '.proexpo-kit');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function getConfig(key) {
  if (!fs.existsSync(CONFIG_FILE)) {
    return null;
  }
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    return data[key] || null;
  } catch (error) {
    return null;
  }
}

export function setConfig(key, value) {
  ensureConfigDir();
  let data = {};
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {
      data = {};
    }
  }
  data[key] = value;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
  log.success(`Configuration updated: ${key} set successfully.`);
}

export function deleteConfig(key) {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      delete data[key];
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
      log.success(`Configuration deleted: ${key}`);
    } catch (e) {}
  }
}
