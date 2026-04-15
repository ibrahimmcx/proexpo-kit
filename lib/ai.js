import { GoogleGenerativeAI } from "@google/generative-ai";
import ora from "ora";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { getConfig } from "./config.js";
import { log } from "./utils.js";

const SYSTEM_PROMPT = `
You are Pro-Expo AI, a senior React Native developer specializing in Expo SDK 54.
Your mission is to generate high-performance, clean, and "The Pro-Expo Way" compliant code.

STRICT RULES:
1. SDK: Use Expo SDK 54 standards.
2. ANIMATION: NEVER use react-native-reanimated. Use the built-in 'Animated' API or 'Moti'.
3. ICONS: Use 'lucide-react-native' for all icons.
4. STYLING: Use StyleSheet.create with a clean, modern, dark-themed aesthetic (slate/indigo colors).
5. STRUCTURE: Assume the project uses src/components, src/screens, src/hooks, etc.
6. OUTPUT: Return ONLY the code block. No conversational text unless necessary for explanation inside comments.
`;

export async function askAI(prompt) {
  const apiKey = getConfig("gemini-api-key");
  
  if (!apiKey) {
    log.error("Gemini API Key not found.");
    console.log(chalk.yellow("\nRun: kit set-key YOUR_API_KEY\n"));
    return;
  }

  const spinner = ora("Pro-Expo AI is thinking...").start();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const response = await result.response;
    const text = response.text();
    
    spinner.succeed("AI Generation complete.");

    // Extract code blocks
    const codeMatch = text.match(/```(?:javascript|typescript|jsx|tsx)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1] : text;

    console.log(chalk.gray("\n--- GENERATED CODE ---\n"));
    console.log(chalk.cyan(code));
    console.log(chalk.gray("\n-----------------------\n"));

    const { shouldSave } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldSave",
        message: "Would you like to save this code to a file?",
        default: true,
      },
    ]);

    if (shouldSave) {
      const { fileName } = await inquirer.prompt([
        {
          type: "input",
          name: "fileName",
          message: "Enter filename (relative to project root, e.g., src/screens/NewScreen.tsx):",
          default: "src/screens/GeneratedScreen.tsx",
        },
      ]);

      const filePath = path.join(process.cwd(), fileName);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, code);
      
      log.success(`File saved to: ${filePath}`);
    }

  } catch (error) {
    spinner.fail("AI Generation failed.");
    console.error(chalk.red(error.message));
  }
}
