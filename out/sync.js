"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncEnvVariables = syncEnvVariables;
const vscode = require("vscode");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
async function syncEnvVariables() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace opened.');
        return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;
    const envPath = path.join(rootPath, '.env');
    const examplePath = path.join(rootPath, '.env.example');
    if (!fs.existsSync(examplePath)) {
        vscode.window.showErrorMessage('.env.example not found in the workspace root.');
        return;
    }
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, '');
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    const envParsed = dotenv.parse(envContent);
    const exampleParsed = dotenv.parse(exampleContent);
    const missingKeys = Object.keys(exampleParsed).filter(key => !(key in envParsed));
    if (missingKeys.length === 0) {
        vscode.window.showInformationMessage('.env is already in sync with .env.example!');
        return;
    }
    let textToAppend = '';
    if (envContent && !envContent.endsWith('\n')) {
        textToAppend += '\n';
    }
    missingKeys.forEach(key => {
        textToAppend += `${key}=\n`;
    });
    const envUri = vscode.Uri.file(envPath);
    const document = await vscode.workspace.openTextDocument(envUri);
    const edit = new vscode.WorkspaceEdit();
    const startLine = document.lineCount;
    edit.insert(envUri, new vscode.Position(startLine, 0), textToAppend);
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
        await document.save();
        vscode.window.showInformationMessage(`Added ${missingKeys.length} missing variables to .env`);
        const editor = await vscode.window.showTextDocument(document);
        // Move cursor to the first newly added key's value position
        const targetLine = envContent && !envContent.endsWith('\n') ? startLine : startLine;
        const newPosition = new vscode.Position(targetLine, missingKeys[0].length + 1);
        editor.selection = new vscode.Selection(newPosition, newPosition);
        editor.revealRange(new vscode.Range(newPosition, newPosition));
    }
    else {
        vscode.window.showErrorMessage('Failed to update .env file.');
    }
}
//# sourceMappingURL=sync.js.map