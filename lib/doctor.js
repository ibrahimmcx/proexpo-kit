import inquirer from "inquirer";
import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";
import { check } from "./checker.js";
import { scaffold } from "./scaffold.js";
import { log } from "./utils.js";

export async function doctor() {
  console.log(chalk.bold.cyan("\n👨‍⚕️ Pro-Expo Doctor: Diagnosing your project...\n"));
  
  const issues = check();
  
  if (issues.length === 0) {
    return;
  }

  const { confirmFix } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmFix",
      message: "Would you like me to attempt to fix these issues automatically?",
      default: true,
    },
  ]);

  if (!confirmFix) {
    log.info("Doctor's visit concluded. No changes made.");
    return;
  }

  for (const issue of issues) {
    if (issue.includes("react-native-reanimated")) {
      await fixReanimated();
    } else if (issue.includes("scaffold") || issue.includes("Missing folders")) {
      await fixStructure();
    } else if (issue.includes("Expo SDK 54")) {
      await fixSDK54();
    } else if (issue.includes("ESLint")) {
      await fixLinting();
    }
  }

  log.success("\nTreatment complete! Running one final check...");
  check();
}

async function fixReanimated() {
  const spinner = ora("Removing react-native-reanimated (Pro-Expo Rule #2)...").start();
  try {
    await execa("npm", ["uninstall", "react-native-reanimated"], { stdio: "ignore" });
    spinner.succeed("Removed react-native-reanimated successfully.");
  } catch (e) {
    spinner.fail("Failed to remove react-native-reanimated.");
  }
}

async function fixStructure() {
  const spinner = ora("Repairing project structure...").start();
  try {
    scaffold();
    spinner.succeed("Project structure repaired.");
  } catch (e) {
    spinner.fail("Failed to repair structure.");
  }
}

async function fixSDK54() {
  const spinner = ora("Updating Expo SDK to 54...").start();
  try {
    await execa("npx", ["expo", "install", "expo@~54.0.0"], { stdio: "ignore" });
    spinner.succeed("Updated to Expo SDK 54.");
  } catch (e) {
    spinner.fail("Failed to update Expo SDK.");
  }
}

async function fixLinting() {
  const spinner = ora("Setting up ESLint & Prettier...").start();
  try {
    await execa("npm", ["install", "-D", "eslint", "prettier", "eslint-config-prettier"], { stdio: "ignore" });
    // Note: In a real scenario, we'd also write the .eslintrc file.
    spinner.succeed("ESLint & Prettier installed.");
  } catch (e) {
    spinner.fail("Failed to setup linting.");
  }
}
