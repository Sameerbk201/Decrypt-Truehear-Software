import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import chalk from "chalk";

/**
 * Prompts user for AES encryption credentials (key and IV) with validation.
 *
 * @async
 * @function askForCredentials
 * @returns {Promise<{key: string, iv: string}>} Object containing validated AES key and IV
 * @throws {Error} If validation fails or unexpected error occurs
 *
 * @example
 * const { key, iv } = await askForCredentials();
 * // key = "1234...", iv = "abcd..."
 */
export async function askForCredentials() {
  console.log(chalk.gray("\n🔐 AES Credentials Required:"));
  console.log(
    chalk.gray(
      "- The secret key must be a 64-character hexadecimal string (32 bytes)."
    )
  );
  console.log(
    chalk.gray("- The IV must be a 32-character hexadecimal string (16 bytes).")
  );
  const responses = await inquirer.prompt([
    {
      type: "password",
      name: "key",
      message: "🔑 Enter AES_SECRET_KEY:",
      mask: "*",
      validate: (input) =>
        /^[0-9a-fA-F]{64}$/.test(input.trim()) ||
        "Key must be 64-character hex", // Validate 64-char hex format
    },
    {
      type: "password",
      name: "iv",
      message: "🧩 Enter AES_IV:",
      mask: "*",
      validate: (input) =>
        /^[0-9a-fA-F]{32}$/.test(input.trim()) || "IV must be 32-character hex", // Validate 32-char hex format
    },
  ]);

  return {
    key: responses.key,
    iv: responses.iv,
  };
}

/**
 * Displays main menu with available actions.
 *
 * @async
 * @function mainMenu
 * @returns {Promise<string>} User's selected option ('add', 'import', or 'exit')
 *
 * @example
 * const option = await mainMenu();
 * if (option === 'import') { ... }
 */
export async function mainMenu() {
  const { option } = await inquirer.prompt({
    type: "list",
    name: "option",
    message: "📋 Choose an option:",
    choices: [
      { name: "➕ Add encrypted key manually", value: "add" },
      { name: "📂 Import JSON & decrypt", value: "import" },
      { name: "📄 Import CSV & decrypt", value: "importCsv" },
      { name: "❌ Exit", value: "exit" },
    ],
  });
  return option;
}

/**
 * Prompts user for a single encrypted key with basic validation.
 *
 * @async
 * @function promptEncryptedKey
 * @returns {Promise<string>} Validated encrypted key string
 *
 * @example
 * const encryptedKey = await promptEncryptedKey();
 */
export async function promptEncryptedKey() {
  const { encryptedKey } = await inquirer.prompt({
    type: "input",
    name: "encryptedKey",
    message: "🔐 Paste or enter the encrypted key:",
    validate: (input) => input.trim() !== "" || "Encrypted key cannot be empty",
  });
  return encryptedKey;
}

/**
 * Displays post-addition action menu after adding a key.
 *
 * @async
 * @function postAddActionMenu
 * @returns {Promise<string>} Next action ('add', 'decrypt', or 'back')
 *
 * @example
 * const action = await postAddActionMenu();
 * if (action === 'decrypt') { ... }
 */
export async function postAddActionMenu() {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "📌 What would you like to do next?",
    choices: [
      { name: "➕ Add another encrypted key", value: "add" },
      { name: "🔓 Decrypt all collected keys", value: "decrypt" },
      { name: "⬅️ Back to main menu", value: "back" },
    ],
  });
  return action;
}

/**
 * Displays post-decryption action menu.
 *
 * @async
 * @function postDecryptActionMenu
 * @returns {Promise<string>} Next action ('add' or 'back')
 *
 * @example
 * const nextStep = await postDecryptActionMenu();
 */
export async function postDecryptActionMenu() {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "🔁 What would you like to do now?",
    choices: [
      { name: "➕ Add another encrypted key", value: "add" },
      { name: "⬅️ Back to main menu", value: "back" },
    ],
  });
  return action;
}

/**
 * Prompts user for JSON file path with comprehensive validation.
 *
 * @async
 * @function promptJsonFile
 * @returns {Promise<string>} Resolved absolute path to valid JSON file
 * @throws {Error} If file validation fails
 *
 * @example
 * const jsonPath = await promptJsonFile();
 * const data = JSON.parse(fs.readFileSync(jsonPath));
 */
export async function promptJsonFile() {
  console.log(chalk.gray("\n📂 Import JSON file with encrypted records."));
  console.log(chalk.gray("- You can drag & drop the file into the terminal."));
  console.log(
    chalk.gray("- File must be a valid .json file containing an array.\n")
  );

  const { filePath } = await inquirer.prompt({
    type: "input",
    name: "filePath",
    message: "📄 Enter path to JSON file:",
    validate: (input) => {
      // Clean input by stripping surrounding quotes
      const cleaned = input.trim().replace(/^['"]|['"]$/g, ""); // Strip quotes
      const resolved = path.resolve(cleaned);
      // Validate file existence
      if (!fs.existsSync(resolved)) {
        return "❌ File not found.";
      }
      // Validate is actually a file
      const stat = fs.statSync(resolved);
      if (!stat.isFile()) {
        return "❌ This is not a file.";
      }
      // Validate has .json extension
      if (!resolved.toLowerCase().endsWith(".json")) {
        return "❌ Must be a .json file.";
      }

      return true;
    },
  });
  // Return cleaned and resolved absolute path
  const cleanedPath = filePath.trim().replace(/^['"]|['"]$/g, "");
  return path.resolve(cleanedPath);
}

/**
 * Prompts user for CSV file path and validates format.
 *
 * @async
 * @function promptCsvFile
 * @returns {Promise<string>} Validated and resolved CSV file path
 */
export async function promptCsvFile() {
  console.log(chalk.gray("\n📂 Import CSV file with encrypted records."));
  console.log(chalk.gray("- You can drag & drop the file into the terminal."));
  console.log(chalk.gray("- CSV must have a `socialSecurityNumber` column.\n"));

  const { filePath } = await inquirer.prompt({
    type: "input",
    name: "filePath",
    message: "📄 Enter path to CSV file:",
    validate: (input) => {
      const cleaned = input.trim().replace(/^['"]|['"]$/g, "");
      const resolved = path.resolve(cleaned);

      if (!fs.existsSync(resolved)) return "❌ File not found.";
      const stat = fs.statSync(resolved);
      if (!stat.isFile()) return "❌ This is not a file.";
      if (!resolved.toLowerCase().endsWith(".csv"))
        return "❌ Must be a .csv file.";

      return true;
    },
  });

  const cleanedPath = filePath.trim().replace(/^['"]|['"]$/g, "");
  return path.resolve(cleanedPath);
}
