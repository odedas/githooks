// pre-commit.js
const { execSync } = require("child_process");
const path = require("path");

try {
  // Check ESLint
  console.log("Running ESLint...");
  const eslintPath = path.resolve(__dirname, "node_modules/.bin/eslint");
  execSync(`${eslintPath} .`);
} catch (error) {
  console.error(
    "ESLint check failed. Please fix the errors before committing."
  );
  process.exit(1); // Stop the commit
}
