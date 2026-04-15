import inquirer from "inquirer";
import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { log } from "./utils.js";
import { templates } from "./templates.js";

export async function createProject(projectName) {
  if (!projectName) {
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
        default: "my-pro-expo-app",
      },
    ]);
    projectName = response.name;
  }

  console.log(chalk.bold.cyan(`\n✨ Pro-Expo-Kit: High-Performance Setup ✨\n`));

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "What are you building?",
      choices: [
        { name: "🚀 SaaS App (Dashboard + Subscriptions)", value: "saas" },
        { name: "🤖 AI App (Chat + Service Layer)", value: "ai" },
        { name: "📱 Social App (Feed + User Activity)", value: "social" },
        { name: "🛒 Shop App (Store + Cart View)", value: "shop" },
      ],
    },
    {
      type: "confirm",
      name: "installMoti",
      message: "Install Moti for premium animations?",
      default: true,
    },
  ]);

  const targetDir = path.join(process.cwd(), projectName);
  const spinner = ora("Setting up your dream app...").start();

  try {
    // 1. Create Expo App
    spinner.text = `Spinning up SDK 54 project: ${projectName}...`;
    await execa("npx", ["create-expo-app", projectName, "--template", "blank-typescript"], {
      stdio: "ignore",
    });

    spinner.text = "Architecting folder structure (The Pro Way)...";
    
    // 2. Create Directory Structure
    const dirs = [
      "src/components",
      "src/screens",
      "src/theme",
      "src/utils",
      "src/hooks",
      "src/api",
      "assets/images",
      "assets/fonts"
    ];

    dirs.forEach(dir => {
      fs.mkdirSync(path.join(targetDir, dir), { recursive: true });
    });

    // 3. Inject Template Files
    spinner.text = `Injecting ${answers.template.toUpperCase()} specialized code...`;
    const selectedTemplate = templates[answers.template];

    if (!selectedTemplate) {
      spinner.fail(`Template '${answers.template}' not found in library.`);
      console.log(chalk.yellow(`Available templates: ${Object.keys(templates).join(", ")}`));
      return;
    }

    selectedTemplate.screens.forEach(screen => {
      fs.writeFileSync(path.join(targetDir, "src/screens", screen.name), screen.content);
    });

    // 4. Update package.json & Install dependencies
    spinner.text = "Installing performance-first dependencies...";
    
    const dependencies = ["lucide-react-native", "expo-font", "@expo/vector-icons"];
    if (answers.installMoti) {
      dependencies.push("moti", "react-native-reanimated");
    }

    await execa("npm", ["install", ...dependencies], { cwd: targetDir, stdio: "ignore" });

    // 5. Final Polish (Theme, Config, Agent Memory)
    spinner.text = "Final polish & Agentic Memory initialization...";
    generateConfigs(targetDir, projectName, answers.template);

    spinner.succeed(chalk.green(`\n✅ ${projectName.toUpperCase()} is READY for development.`));
    
    console.log(chalk.bold("\n🚀 Your next steps:"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npx expo start`));
    
    console.log(chalk.gray(`\n💡 Tip: Check .agent/ARCHITECTURE.md for your project's soul.`));

  } catch (error) {
    spinner.fail("Creation failed. Please check your internet connection and trial again.");
    console.error(error);
  }
}

function generateConfigs(targetDir, projectName, template) {
  const agentPath = path.join(targetDir, ".agent");
  if (!fs.existsSync(agentPath)) fs.mkdirSync(agentPath);
  
  const archPath = path.join(agentPath, "ARCHITECTURE.md");
  fs.writeFileSync(archPath, `# ${projectName} - ARCHITECTURE\n\n- Template: ${template.toUpperCase()}\n- Animation: Standard Animated/Moti\n- SDK: 54 Optimized\n\n## Standards\n1. No heavy reanimated logic in UI thread.\n2. Functional Components.\n3. Lucide for Icons.`);

  // Create a base theme file
  const themePath = path.join(targetDir, "src/theme/colors.ts");
  fs.writeFileSync(themePath, `export const colors = {\n  primary: '#6366f1',\n  background: '#0f172a',\n  surface: '#1e293b',\n  text: '#f8fafc',\n  subtext: '#94a3b8',\n};`);
}
