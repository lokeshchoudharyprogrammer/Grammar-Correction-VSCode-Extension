"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvCodeActionProvider = void 0;
const vscode = require("vscode");
const crypto = require("crypto");
class EnvCodeActionProvider {
    provideCodeActions(document, range, context, token) {
        const actions = [];
        for (const diagnostic of context.diagnostics) {
            if (diagnostic.message.includes('Missing variables')) {
                const fix = new vscode.CodeAction('Sync all missing variables from .env.example', vscode.CodeActionKind.QuickFix);
                fix.command = { command: 'env-manager.syncEnv', title: 'Sync .env' };
                fix.diagnostics = [diagnostic];
                fix.isPreferred = true;
                actions.push(fix);
            }
            else if (diagnostic.message.includes('is empty')) {
                const match = diagnostic.message.match(/Value for '(.+)' is empty/);
                if (match) {
                    // Quick fix for generating random secure value
                    const fix = new vscode.CodeAction('Generate random secure value', vscode.CodeActionKind.QuickFix);
                    fix.edit = new vscode.WorkspaceEdit();
                    const line = document.lineAt(diagnostic.range.start.line);
                    const eqIndex = line.text.indexOf('=');
                    const valuePos = new vscode.Position(line.lineNumber, eqIndex + 1);
                    const randomVal = crypto.randomBytes(16).toString('hex');
                    fix.edit.insert(document.uri, valuePos, randomVal);
                    fix.diagnostics = [diagnostic];
                    actions.push(fix);
                }
            }
        }
        return actions;
    }
}
exports.EnvCodeActionProvider = EnvCodeActionProvider;
//# sourceMappingURL=codeActions.js.map