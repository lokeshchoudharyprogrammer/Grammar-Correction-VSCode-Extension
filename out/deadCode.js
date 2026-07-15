"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDeadVariables = findDeadVariables;
const vscode = require("vscode");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
async function findDeadVariables() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const envPath = path.join(rootPath, '.env');
    if (!fs.existsSync(envPath)) {
        vscode.window.showInformationMessage('No .env file found.');
        return;
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envParsed = dotenv.parse(envContent);
    const keys = Object.keys(envParsed);
    if (keys.length === 0) {
        vscode.window.showInformationMessage('Your .env file is empty.');
        return;
    }
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Scanning codebase for dead environment variables...",
        cancellable: false
    }, async (progress) => {
        const deadKeys = [];
        // Search common code files, excluding node_modules, dist, build, etc.
        const files = await vscode.workspace.findFiles('**/*.{ts,tsx,js,jsx,py,go,java,php,rb,rs,cpp,h}', '**/node_modules/**,**/dist/**,**/build/**');
        for (const key of keys) {
            let found = false;
            for (const file of files) {
                try {
                    const content = fs.readFileSync(file.fsPath, 'utf8');
                    if (content.includes(key)) {
                        found = true;
                        break;
                    }
                }
                catch (e) {
                    // Skip unreadable files
                }
            }
            if (!found) {
                deadKeys.push(key);
            }
        }
        if (deadKeys.length > 0) {
            vscode.window.showWarningMessage(`Found ${deadKeys.length} dead variables (never used in your code): ${deadKeys.join(', ')}`);
        }
        else {
            vscode.window.showInformationMessage('Great job! All variables in .env are actively used in your codebase! ✅');
        }
    });
}
//# sourceMappingURL=deadCode.js.map