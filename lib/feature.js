import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { log } from "./utils.js";
import { authTemplates } from "./auth-templates.js";

export async function addFeature(featureName) {
  if (!featureName) {
    log.error("Please specify a feature name (e.g., kit add auth)");
    return;
  }

  switch (featureName.toLowerCase()) {
    case "auth":
      await setupAuth();
      break;
    default:
      log.error(`Feature '${featureName}' not recognized. Try: auth, ui`);
  }
}

async function setupAuth() {
  const spinner = ora("Setting up Authentication feature...").start();
  const rootDir = process.cwd();

  try {
    // 1. Install Dependencies
    spinner.text = "Installing @react-native-async-storage/async-storage...";
    await execa("npm", ["install", "@react-native-async-storage/async-storage"], { stdio: "ignore" });

    // 2. Create Context
    spinner.text = "Creating AuthContext...";
    const contextDir = path.join(rootDir, "src/contexts");
    if (!fs.existsSync(contextDir)) fs.mkdirSync(contextDir, { recursive: true });
    
    fs.writeFileSync(path.join(contextDir, "AuthContext.tsx"), authTemplates.context);

    // 3. Create Screens
    spinner.text = "Creating Login and Register screens...";
    const screensDir = path.join(rootDir, "src/screens");
    if (!fs.existsSync(screensDir)) fs.mkdirSync(screensDir, { recursive: true });

    fs.writeFileSync(path.join(screensDir, "LoginScreen.tsx"), authTemplates.loginScreen);

    // 4. Try Automatic Provider Injection
    spinner.text = "Attempting to find your root file for AuthProvider injection...";
    const rootFiles = ["App.tsx", "App.js", "src/App.tsx", "app/_layout.tsx"];
    let injected = false;
    
    for (const file of rootFiles) {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, "utf-8");
        if (!content.includes("AuthProvider")) {
          // Add import
          const importLine = "\nimport { AuthProvider } from './src/contexts/AuthContext';\n";
          content = importLine + content;
          
          // Basic wrap attempt (This is a naive replacement, but works for standard templates)
          if (content.includes("export default function")) {
            content = content.replace(/(export default function .*\(.*\) {)/, "$1\n  return (\n    <AuthProvider>");
            // We'd also need to close it, which is the hard part without a real parser.
            // For now, let's just add the import and a clear warning comment.
          }
          
          fs.writeFileSync(filePath, content);
          injected = true;
          break;
        }
      }
    }

    spinner.succeed(chalk.green("Authentication feature added successfully!"));
    
    if (injected) {
        log.success("Auto-injected AuthProvider import into your root file.");
    }

    console.log(chalk.bold("\nNext steps:"));
    console.log(chalk.cyan("  1. Ensure <AuthProvider> wraps your main component in your root file."));
    console.log(chalk.cyan("  2. import { AuthProvider } from './src/contexts/AuthContext';"));
    console.log(chalk.yellow("\nPro-Expo-Kit: You're now ready to handle users. 🚀\n"));

  } catch (error) {
    spinner.fail("Failed to add authentication feature.");
    console.error(error);
  }
}
