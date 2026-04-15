import fs from "fs";
import { execSync } from "child_process";
import { log } from "./utils.js";

function getNodeVersion() {
  try {
    return execSync("node -v").toString().trim();
  } catch {
    return "Not found";
  }
}

export function check() {
  /** Performs a comprehensive environment health check. */
  log.bold("\n--- [HEALTH REPORT] Pro-Expo Environment (Node.js) ---");
  
  const issues = [];
  
  // 1. Node.js Version
  const nodeV = getNodeVersion();
  if (nodeV === "Not found") {
    log.error("Node.js: " + nodeV);
    issues.push("Install Node.js (>= 18.x recommended)");
  } else {
    const major = parseInt(nodeV.replace("v", "").split(".")[0]);
    if (major < 18) {
      log.warn(`Node.js: ${nodeV} (Recommended: >= 18.x)`);
      issues.push("Upgrade Node.js to version 18 or higher");
    } else {
      log.success(`Node.js: ${nodeV}`);
    }
  }

  // 2. SDK 54 & dependencies
  if (fs.existsSync("package.json")) {
    try {
      const data = JSON.parse(fs.readFileSync("package.json", "utf-8"));
      const allDeps = { ...data.dependencies, ...data.devDependencies };
      
      // Reanimated
      if (allDeps["react-native-reanimated"]) {
        log.error("Animation: 'react-native-reanimated' detected!");
        issues.push("Remove 'react-native-reanimated' (Use Animated API)");
      } else {
        log.success("Animation: Standard 'Animated' API compliant");
      }
      
      // Expo 54
      const expoV = allDeps["expo"] || "";
      if (expoV && !expoV.includes("54")) {
        log.warn(`Expo Version: ${expoV} (Recommended: SDK 54)`);
        issues.push("Target Expo SDK 54 for best compatibility");
      } else {
        log.success(`Expo Version: ${expoV || "SDK 54 (Targeted)"}`);
      }

      // TS / ESLint
      const hasTS = allDeps["typescript"] || fs.existsSync("tsconfig.json");
      if (hasTS) log.success("TypeScript: Detected");
      else log.info("TypeScript: Not detected (Optional)");

      const hasESLint = allDeps["eslint"] || fs.readdirSync(".").some(f => f.startsWith(".eslintrc"));
      if (hasESLint) log.success("Linter: ESLint detected");
      else log.warn("Linter: ESLint not found");

    } catch (e) {
      log.error("Package.json: Invalid format!");
      issues.push("Fix package.json syntax errors");
    }
  } else {
    log.info("Package.json: Not found (Kit Logic only mode)");
  }

  // 3. Structure
  const requiredDirs = ["src/components", "src/screens", "assets/images"];
  const missing = requiredDirs.filter(d => !fs.existsSync(d));
  if (missing.length === 0) {
    log.success("Structure: Standard Pro-Expo folders exist");
  } else {
    log.warn(`Structure: Missing folders (${missing.join(", ")})`);
    issues.push("Run 'kit scaffold' to fix project structure");
  }

  log.bold("----------------------------------------------------\n");
  
  if (issues.length === 0) {
    log.success("All systems go! Ready for professional development.");
  } else {
    log.info(`Found ${issues.length} improvement areas:`);
    issues.forEach(issue => console.log(`  - ${issue}`));
  }

  return issues;
}
