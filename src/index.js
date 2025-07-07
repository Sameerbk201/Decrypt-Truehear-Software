/**
 * @fileoverview
 * Entry point for the TrueHear Decryption CLI.
 * Allows AES-256-CBC decryption through manual entry or JSON import.
 * Designed for terminal use with graceful error handling and export options.
 */

import chalk from "chalk";
import { askForCredentials, mainMenu, promptCsvFile, promptJsonFile } from "./cli/prompt.js";
import { EncDec } from "./utils/EncDec.js";
import { handleDecryptionFlow } from "./core/decrypt.js";
import { handleJsonImportFlow } from "./core/importJson.js";
import { handleUnexpectedError } from "./core/error.js";
import { handleCsvImportFlow } from "./core/importCsv.js";

/**
 * Global encryption/decryption handler instance.
 * @type {EncDec}
 */
let encdec;

/**
 * Handle graceful shutdown on Ctrl+C.
 * Prevents raw exit and gives user-friendly message.
 * @event SIGINT
 */
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n❌ Process interrupted by user. Exiting...\n"));
  process.exit(0);
});

/**
 * Starts the interactive CLI flow.
 * Handles user authentication and menu loop.
 * Wraps entire lifecycle in error handling.
 *
 * @async
 * @function start
 * @returns {Promise<void>}
 */
async function start() {
  try {
    // Clear terminal and show app banner
    console.clear();
    showBanner();
    // Prompt user to input AES credentials
    const { key, iv } = await askForCredentials();
    // Initialize encryption instance with the provided key/iv
    encdec = new EncDec(key, iv);

    let running = true;

    // Main menu loop
    while (running) {
      const action = await mainMenu();

      switch (action) {
        // Manual entry + decryption
        case "add":
          await handleDecryptionFlow(encdec);
          break;

        case "import": {
          // Prompt for .json path and run import/decrypt
          const path = await promptJsonFile();
          await handleJsonImportFlow(encdec, path);
          break;
        }
        case "importCsv":
          const csvPath = await promptCsvFile();
          await handleCsvImportFlow(encdec, csvPath);
          break;

        case "exit":
          // User chooses to exit
          running = false;
          break;
      }
    }

    console.log(chalk.green("\n👋 Exiting. Stay safe!\n"));
  } catch (err) {
    // Catch and handle any unexpected runtime errors
    handleUnexpectedError(err);
  }
}

/**
 * Displays the application banner and usage instructions.
 * Helps orient users with available functionality.
 *
 * @function showBanner
 */
function showBanner() {
  console.log(chalk.cyan.bold("\n🔐 TrueHear Decryption CLI"));
  console.log(chalk.whiteBright("----------------------------------------"));
  console.log(
    chalk.gray("💡 A secure CLI tool to decrypt AES-encrypted data.")
  );
  console.log(chalk.gray("📂 Supports manual entry and JSON file imports."));
  console.log(
    chalk.gray("🛑 Exit at any time using ") +
      chalk.yellow("Ctrl+C") +
      chalk.gray(".")
  );
  console.log(chalk.whiteBright("----------------------------------------\n"));
}

// Run the application
start();
