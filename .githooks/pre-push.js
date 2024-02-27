// pre-push.js
const fs = require("fs-extra");
const { execSync } = require("child_process");

// Function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

try {
  // Check for releasenotes.txt
  const releaseNotesFile = "releasenotes.txt";
  if (!fs.existsSync(releaseNotesFile)) {
    fs.writeFileSync(releaseNotesFile, "");
    console.log("Created releasenotes.txt");
  }

  // Read current package.json
  const packageJson = fs.readJsonSync("package.json");

  // Increment version
  const currentVersion = packageJson.version;
  const versionParts = currentVersion.split(".");
  versionParts[2] = parseInt(versionParts[2]) + 1;
  const newVersion = versionParts.join(".");

  // Update package.json with new version
  packageJson.version = newVersion;
  fs.writeJsonSync("package.json", packageJson, { spaces: 2 });

  // Get current date
  const currentDate = getCurrentDate();

  // Get commit messages since last push
  const commitMessages = execSync(
    'git log @{u}.. --pretty=format:"%h %s"'
  ).toString();

  // Update releasenotes.txt
  const releaseNotesContent = `## ${newVersion} (${currentDate})\n${commitMessages}\n\n`;
  fs.appendFileSync(releaseNotesFile, releaseNotesContent);

  console.log(`Updated version to ${newVersion} and releasenotes.txt`);
} catch (error) {
  console.error("An error occurred:", error.message);
  process.exit(1); // Stop the push
}
