import fs from "fs";
import { log } from "./utils.js";

export function scaffold() {
  /** Creates the standard Pro-Expo-Kit folder structure. */
  const dirs = [
    "src/components",
    "src/screens",
    "src/theme",
    "src/utils",
    "src/hooks",
    "assets/images",
    "assets/fonts"
  ];
  
  log.info("Scaffolding project structure...");
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log("  + Created " + dir);
    } else {
      console.log("  ~ Skipped " + dir + " (exists)");
    }
  });
  
  log.success("Scaffolding complete.");
}
