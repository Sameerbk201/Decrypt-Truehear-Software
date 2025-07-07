// src/core/error.js
import chalk from "chalk";
import readline from "readline";
/**
 * Centralized error handler for the application.
 * Handles different types of errors with appropriate user feedback and exit codes.
 *
 * @function handleUnexpectedError
 * @param {Error|Object} err - The error object to handle
 * @returns {void} Exits the process with appropriate status code
 *
 * @example
 * try {
 *   // Some operation that might throw
 * } catch (err) {
 *   handleUnexpectedError(err);
 * }
 */
export function handleUnexpectedError(err) {
  // Handle specific known error cases
  if (
    err?.isTtyError || // Terminal-related errors
    err?.message?.includes("SIGINT") || // User pressed Ctrl+C
    err?.message?.includes("User force closed") // Explicit prompt cancellation
  ) {
    console.log(chalk.yellow("\n❌ Prompt interrupted by user. Exiting...\n"));
    process.exit(0); // Clean exit with code 0 (user-initiated)
  }
  // Handle all other unexpected errors
  console.log(
    chalk.red("\n❌ An unexpected error occurred:\n"),
    err?.message || err
  );
  // Ask user to press Enter before exiting
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(chalk.gray("\nPress Enter to exit..."), () => {
    rl.close();
    process.exit(1);
  });
}
