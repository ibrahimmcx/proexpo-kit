import chalk from "chalk";
import { execSync, spawn } from "child_process";
import platform from "os";

export const log = {
  success: (msg) => console.log(chalk.green("[OK] " + msg)),
  warn: (msg) => console.log(chalk.yellow("[!!] " + msg)),
  error: (msg) => console.log(chalk.red("[XX] " + msg)),
  info: (msg) => console.log(chalk.cyan("[??] " + msg)),
  bold: (msg) => console.log(chalk.bold(msg)),
};

export function slugify(text) {
  /** Safely converts text to a filename-safe slug. */
  const trMap = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C'
  };
  
  let result = text;
  Object.keys(trMap).forEach(key => {
    result = result.replace(new RegExp(key, 'g'), trMap[key]);
  });
  
  return result
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-')        // Spaces to dashes
    .replace(/-+/g, '-');        // Multiple dashes to one
}

export function openFile(filePath) {
  /** Opens a file using the system's default application. */
  const currentOs = platform.platform();
  
  try {
    if (currentOs === "win32") {
      spawn("cmd", ["/c", "start", "", filePath], { detached: true, stdio: "ignore" }).unref();
    } else if (currentOs === "darwin") {
      spawn("open", [filePath], { detached: true, stdio: "ignore" }).unref();
    } else {
      spawn("xdg-open", [filePath], { detached: true, stdio: "ignore" }).unref();
    }
    return true;
  } catch (e) {
    log.error("Could not open file: " + e.message);
    return false;
  }
}
