import chalk from "chalk";
import ora from "ora";
import { exportResultsToFile } from "../cli/exporter.js";
import {
  postAddActionMenu,
  postDecryptActionMenu,
  promptEncryptedKey,
} from "../cli/prompt.js";
/**
 * Handles the complete decryption workflow including:
 * - Collecting multiple encrypted keys
 * - Batch decryption
 * - Result display and export
 * - User interaction flow
 *
 * @async
 * @function handleDecryptionFlow
 * @param {Object} encdec - Initialized encryption/decryption utility instance
 * @returns {Promise<void>}
 *
 * @example
 * const encdec = new EncDec(key, iv);
 * await handleDecryptionFlow(encdec);
 */
export async function handleDecryptionFlow(encdec) {
  // Store collected key pairs (encrypted + decrypted)
  const keyPairs = [];
  let continueLoop = true;
  // Main interaction loop
  while (continueLoop) {
    // Prompt user for encrypted key
    const encryptedKey = await promptEncryptedKey();
    // Add new entry with placeholder for decrypted result
    keyPairs.push({
      Encrypted: encryptedKey,
      Decrypted: chalk.yellow("⏳ Not decrypted"),
    });
    // Prompt for next action
    let action = await postAddActionMenu();
    // Start decryption process with loading indicator
    if (action === "decrypt") {
      const spinner = ora("Decrypting...").start();
      let success = 0,
        failed = 0;

      for (let entry of keyPairs) {
        try {
          entry.Decrypted = encdec.decryptPayload(entry.Encrypted);
          success++;
        } catch {
          entry.Decrypted = chalk.red("❌ Failed to decrypt");
          failed++;
        }
      }
      // Complete decryption process
      spinner.succeed("Decryption complete");
      // Display results
      console.log(chalk.cyan.bold("\n📋 Decryption Results:"));
      console.table(keyPairs);
      // Show summary statistics
      console.log(chalk.yellow("\n📊 Summary:"));
      console.log(`🔐 Total: ${keyPairs.length}`);
      console.log(chalk.green(`✅ Decrypted: ${success}`));
      console.log(chalk.red(`❌ Failed: ${failed}`));

      if (keyPairs.length) await exportResultsToFile(keyPairs);
      // Prompt for post-decryption action
      const post = await postDecryptActionMenu();
      // Exit loop if user chooses to go back
      if (post === "back") continueLoop = false;
    } else if (action === "back") {
      continueLoop = false;
    }
  }

  console.log(chalk.green("\n✅ Returning to main menu...\n"));
}
