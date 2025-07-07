// src/cli/exporter.js
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { handleUnexpectedError } from "../core/error.js";

/**
 * Exports data to a file in either JSON or CSV format based on user selection.
 * Provides interactive prompts for format selection and handles file creation.
 *
 * @async
 * @function exportResultsToFile
 * @param {Array<Object>} data - The data to be exported. Each object in the array represents a row of data.
 * @returns {Promise<void>} Resolves when the export is complete or rejects on error.
 *
 * @example
 * const results = [{name: 'Alice', age: 30}, {name: 'Bob', age: 25}];
 * await exportResultsToFile(results);
 */
export async function exportResultsToFile(data) {
  try {
    // Prompt user to select export format or cancel
    const { format } = await inquirer.prompt({
      type: "list",
      name: "format",
      message: "📤 Export results to:",
      choices: ["JSON", "CSV", "Cancel"],
    });
    // Early return if user cancels
    if (format === "Cancel") return;
    // Create timestamp for filename
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `decryption_results_${stamp}.${format.toLowerCase()}`;
    const filepath = path.join(process.cwd(), filename);

    if (format === "JSON") {
      // Write data as pretty-printed JSON
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");
    } else {
      // Handle CSV export
      // Generate CSV headers from object keys
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((obj) =>
        Object.values(obj)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
      // Combine headers and rows with newlines
      fs.writeFileSync(filepath, [headers, ...rows].join("\n"), "utf8");
    }
    // Display success message to user
    console.log(chalk.green(`\n✅ Results exported to ${filename}\n`));
  } catch (err) {
    handleUnexpectedError(err);
  }
}
