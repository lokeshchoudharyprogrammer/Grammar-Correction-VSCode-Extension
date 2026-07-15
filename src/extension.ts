import * as vscode from 'vscode';
import { refreshDiagnostics } from './linter';
import { syncEnvVariables } from './sync';
import { EnvHoverProvider } from './hover';
import { checkGitIgnoreForEnv } from './security';
import { setupEnvSwitcher } from './switcher';
import { EnvCodeActionProvider } from './codeActions';
import { findDeadVariables } from './deadCode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Env Manager is now active!');

    // Run security check on startup
    checkGitIgnoreForEnv();

    const envDiagnostics = vscode.languages.createDiagnosticCollection('env-manager');
    context.subscriptions.push(envDiagnostics);

    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, envDiagnostics);
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, envDiagnostics)),
        vscode.workspace.onDidOpenTextDocument(doc => refreshDiagnostics(doc, envDiagnostics)),
        vscode.workspace.onDidCloseTextDocument(doc => envDiagnostics.delete(doc.uri))
    );

    let syncCommand = vscode.commands.registerCommand('env-manager.syncEnv', async () => {
        await syncEnvVariables();
    });

    context.subscriptions.push(syncCommand);

    // Setup Environment Profile Switcher
    setupEnvSwitcher(context);

    // Register Command: Find Dead Variables
    let deadVarsCommand = vscode.commands.registerCommand('env-manager.findDeadVariables', async () => {
        await findDeadVariables();
    });
    context.subscriptions.push(deadVarsCommand);

    // Register Hover Provider
    const hoverProvider = vscode.languages.registerHoverProvider('*', new EnvHoverProvider());
    context.subscriptions.push(hoverProvider);

    // Register Code Actions (Quick Fixes)
    const codeActionProvider = vscode.languages.registerCodeActionsProvider(
        { pattern: '**/.env' },
        new EnvCodeActionProvider(),
        { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    );
    context.subscriptions.push(codeActionProvider);
}

export function deactivate() {}
