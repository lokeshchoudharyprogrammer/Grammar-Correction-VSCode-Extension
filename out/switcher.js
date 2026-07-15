"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEnvSwitcher = setupEnvSwitcher;
exports.updateStatusBar = updateStatusBar;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
let statusBarItem;
function setupEnvSwitcher(context) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'env-manager.switchEnv';
    context.subscriptions.push(statusBarItem);
    updateStatusBar();
    const switchCommand = vscode.commands.registerCommand('env-manager.switchEnv', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        // Find all files starting with .env in the root
        const files = fs.readdirSync(rootPath).filter(file => file.startsWith('.env') && !file.endsWith('.example'));
        if (files.length === 0) {
            vscode.window.showInformationMessage('No environment files found (e.g. .env.local, .env.staging).');
            return;
        }
        const selected = await vscode.window.showQuickPick(files, {
            placeHolder: 'Select an environment profile to activate as .env'
        });
        if (selected && selected !== '.env') {
            const sourcePath = path.join(rootPath, selected);
            const destPath = path.join(rootPath, '.env');
            try {
                const content = fs.readFileSync(sourcePath, 'utf8');
                fs.writeFileSync(destPath, content);
                vscode.window.showInformationMessage(`✅ Switched active environment to ${selected}`);
                updateStatusBar(selected);
            }
            catch (err) {
                vscode.window.showErrorMessage(`Failed to switch environment: ${err}`);
            }
        }
    });
    context.subscriptions.push(switchCommand);
}
function updateStatusBar(activeEnv = '.env') {
    statusBarItem.text = `$(gear) Env: ${activeEnv}`;
    statusBarItem.show();
}
//# sourceMappingURL=switcher.js.map