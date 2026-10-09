import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_DIR = path.join(__dirname, '..');

function runCmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: REPO_DIR }, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout.trim());
    });
  });
}

let isSyncing = false;

async function checkAndPush() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const status = await runCmd('git status --porcelain');
    if (status) {
      console.log('🔄 Git Watcher: Changes detected! Staging, committing, and pushing to GitHub...');
      const timestamp = new Date().toISOString();
      await runCmd('git add .');
      await runCmd(`git commit -m "auto-sync: update codebase state at ${timestamp}"`);
      const pushOutput = await runCmd('git push origin main');
      console.log('✅ Git Watcher: Successfully pushed to GitHub (origin/main)!');
      console.log(pushOutput);
    }
  } catch (err) {
    // Ignore if no changes or push collision
  } finally {
    isSyncing = false;
  }
}

console.log('🚀 Git Auto-Push Watcher active! Monitoring workspace for automatic GitHub pushes...');

// Check for changes every 8 seconds
setInterval(checkAndPush, 8000);
checkAndPush();
