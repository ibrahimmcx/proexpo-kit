import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { log } from "./utils.js";

export function optimize() {
  console.log(chalk.bold.cyan("\n⚡ Pro-Expo Optimizer: Performance Audit Running...\n"));

  auditAssets();
  auditDependencies();
  auditCode();

  console.log(chalk.bold("\n--- Optimization Summary ---"));
  console.log(chalk.green("✔ Use 'npx expo-optimize' for automated image compression."));
  console.log(chalk.green("✔ Ensure 'useNativeDriver' is true for all animations."));
  console.log(chalk.yellow("\nPro-Expo-Kit: Speed is a feature. 🏃‍♂️\n"));
}

function auditAssets() {
  const assetsPath = path.join(process.cwd(), "assets");
  if (!fs.existsSync(assetsPath)) return;

  log.bold("[Assets Audit]");
  const files = fs.readdirSync(assetsPath, { recursive: true });
  let largeFiles = 0;

  files.forEach(file => {
    const fullPath = path.join(assetsPath, file);
    if (fs.lstatSync(fullPath).isFile()) {
      const stats = fs.statSync(fullPath);
      const sizeMb = stats.size / (1024 * 1024);
      if (sizeMb > 1) {
        console.log(chalk.yellow(`  ⚠️  Large Asset: ${file} (${sizeMb.toFixed(2)} MB)`));
        largeFiles++;
      }
    }
  });

  if (largeFiles === 0) log.success("No oversized assets found.");
  console.log("");
}

function auditDependencies() {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) return;

  log.bold("[Dependency Audit]");
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const deps = Object.keys(pkg.dependencies || {});
    const srcPath = path.join(process.cwd(), "src");

    if (!fs.existsSync(srcPath)) {
      log.info("Src directory not found. Skipping dependency usage scan.");
      return;
    }

    // Naive import scan
    const allSrcFiles = getAllFiles(srcPath);
    const srcContent = allSrcFiles.map(f => fs.readFileSync(f, "utf-8")).join("\n");

    const unused = deps.filter(dep => {
       // Filter out standard expo/react native core
       if (["react", "react-native", "expo"].includes(dep)) return false;
       return !srcContent.includes(`from '${dep}'`) && !srcContent.includes(`from "${dep}"`);
    });

    if (unused.length > 0) {
      console.log(chalk.yellow(`  ⚠️  Potentially Unused: ${unused.join(", ")}`));
    } else {
      log.success("All dependencies appear to be in use.");
    }
  } catch (e) {
    log.error("Failed to audit dependencies.");
  }
  console.log("");
}

function auditCode() {
  log.bold("[Code Performance Audit]");
  const srcPath = path.join(process.cwd(), "src");
  if (!fs.existsSync(srcPath)) return;

  const files = getAllFiles(srcPath);
  let issues = 0;

  files.forEach(file => {
    const content = fs.readFileSync(file, "utf-8");
    
    // Check for Animated without useNativeDriver: true
    if (content.includes("Animated.") && !content.includes("useNativeDriver: true")) {
        console.log(chalk.yellow(`  ⚠️  Performance: ${path.basename(file)} uses Animated but maybe MISSING 'useNativeDriver: true'.`));
        issues++;
    }

    // Check for Inline functions in render (heuristic)
    if (content.includes("onPress={() =>")) {
        console.log(chalk.yellow(`  ⚠️  Performance: ${path.basename(file)} has inline arrow functions in render. Consider 'useCallback'.`));
        issues++;
    }
  });

  if (issues === 0) log.success("No common performance anti-patterns found.");
  console.log("");
}

function getAllFiles(dir, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
       getAllFiles(filePath, fileList);
    } else if (file.match(/\.(tsx|ts|js|jsx)$/)) {
       fileList.push(filePath);
    }
  });
  return fileList;
}
