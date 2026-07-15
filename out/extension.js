"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const linter_1 = require("./linter");
const sync_1 = require("./sync");
const hover_1 = require("./hover");
const security_1 = require("./security");
const switcher_1 = require("./switcher");
const codeActions_1 = require("./codeActions");
const deadCode_1 = require("./deadCode");
function activate(context) {
    console.log('Env Manager is now active!');
    // Run security check on startup
    (0, security_1.checkGitIgnoreForEnv)();
    const envDiagnostics = vscode.languages.createDiagnosticCollection('env-manager');
    context.subscriptions.push(envDiagnostics);
    if (vscode.window.activeTextEditor) {
        (0, linter_1.refreshDiagnostics)(vscode.window.activeTextEditor.document, envDiagnostics);
    }
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => (0, linter_1.refreshDiagnostics)(e.document, envDiagnostics)), vscode.workspace.onDidOpenTextDocument(doc => (0, linter_1.refreshDiagnostics)(doc, envDiagnostics)), vscode.workspace.onDidCloseTextDocument(doc => envDiagnostics.delete(doc.uri)));
    let syncCommand = vscode.commands.registerCommand('env-manager.syncEnv', async () => {
        await (0, sync_1.syncEnvVariables)();
    });
    context.subscriptions.push(syncCommand);
    // Setup Environment Profile Switcher
    (0, switcher_1.setupEnvSwitcher)(context);
    // Register Command: Find Dead Variables
    let deadVarsCommand = vscode.commands.registerCommand('env-manager.findDeadVariables', async () => {
        await (0, deadCode_1.findDeadVariables)();
    });
    context.subscriptions.push(deadVarsCommand);
    // Register Hover Provider
    const hoverProvider = vscode.languages.registerHoverProvider('*', new hover_1.EnvHoverProvider());
    context.subscriptions.push(hoverProvider);
    // Register Code Actions (Quick Fixes)
    const codeActionProvider = vscode.languages.registerCodeActionsProvider({ pattern: '**/.env' }, new codeActions_1.EnvCodeActionProvider(), { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] });
    context.subscriptions.push(codeActionProvider);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map