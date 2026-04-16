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

  const name = featureName.toLowerCase();

  switch (name) {
    case "auth":
      await setupAuth();
      break;
    case "firebase":
      await setupFirebase();
      break;
    case "supabase":
      await setupSupabase();
      break;
    case "ui":
      await setupUI();
      break;
    default:
      log.error(`Feature '${featureName}' not recognized. Try: auth, firebase, supabase, ui`);
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
          const importLine = "\nimport { AuthProvider } from './src/contexts/AuthContext';\n";
          content = importLine + content;
          if (content.includes("export default function")) {
            content = content.replace(/(export default function .*\(.*\) {)/, "$1\n  return (\n    <AuthProvider>");
          }
          fs.writeFileSync(filePath, content);
          injected = true;
          break;
        }
      }
    }

    spinner.succeed(chalk.green("Authentication feature added successfully!"));
    if (injected) log.success("Auto-injected AuthProvider import.");

    console.log(chalk.bold("\nNext steps:"));
    console.log(chalk.cyan("  1. Ensure <AuthProvider> wraps your main component."));
    console.log(chalk.cyan("  2. Check src/screens/LoginScreen.tsx"));

  } catch (error) {
    spinner.fail("Failed to add authentication feature.");
    console.error(error);
  }
}

async function setupFirebase() {
  const spinner = ora("Installing Firebase...").start();
  const rootDir = process.cwd();
  try {
    await execa("npm", ["install", "firebase"], { stdio: "ignore" });
    
    const configDir = path.join(rootDir, "src/config");
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

    const content = `import { initializeApp } from 'firebase/app';
// Pro-Expo-Kit: Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT"
};
export const app = initializeApp(firebaseConfig);`;

    fs.writeFileSync(path.join(configDir, "firebase.ts"), content);
    spinner.succeed(chalk.green("Firebase added! Check src/config/firebase.ts"));
  } catch (e) {
    spinner.fail("Firebase setup failed.");
  }
}

async function setupSupabase() {
  const spinner = ora("Installing Supabase...").start();
  const rootDir = process.cwd();
  try {
    await execa("npm", ["install", "@supabase/supabase-js"], { stdio: "ignore" });
    
    const configDir = path.join(rootDir, "src/config");
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

    const content = `import { createClient } from '@supabase/supabase-js';
// Pro-Expo-Kit: Supabase Config
const supabaseUrl = 'YOUR_URL';
const supabaseKey = 'YOUR_KEY';
export const supabase = createClient(supabaseUrl, supabaseKey);`;

    fs.writeFileSync(path.join(configDir, "supabase.ts"), content);
    spinner.succeed(chalk.green("Supabase added! Check src/config/supabase.ts"));
  } catch (e) {
    spinner.fail("Supabase setup failed.");
  }
}

async function setupUI() {
  const spinner = ora("Generating High-Performance UI Components...").start();
  const rootDir = process.cwd();
  try {
    const compDir = path.join(rootDir, "src/components");
    if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });

    // 1. Button component
    const btn = `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button = ({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity 
    style={[styles.btn, variant === 'secondary' ? styles.secondary : styles.primary]} 
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: { padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  primary: { backgroundColor: '#6366f1' },
  secondary: { backgroundColor: '#1e293b' },
  text: { color: '#fff', fontWeight: 'bold' }
});`;

    // 2. Card component
    const card = `import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Card = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12, marginVertical: 10 }
});`;

    fs.writeFileSync(path.join(compDir, "Button.tsx"), btn);
    fs.writeFileSync(path.join(compDir, "Card.tsx"), card);

    spinner.succeed(chalk.green("Premium UI components generated in src/components/"));
  } catch (e) {
    spinner.fail("UI setup failed.");
  }
}

