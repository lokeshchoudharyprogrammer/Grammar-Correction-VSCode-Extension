import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function checkGitIgnoreForEnv() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) { return; }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const gitignorePath = path.join(rootPath, '.gitignore');
    const envPath = path.join(rootPath, '.env');

    // Proceed only if both files exist
    if (!fs.existsSync(envPath) || !fs.existsSync(gitignorePath)) {
        return;
    }

    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const lines = gitignoreContent.split(/\r?\n/).map(line => line.trim());
    
    // Check if .env or *.env is ignored
    const isIgnored = lines.includes('.env') || lines.includes('*.env');

    if (!isIgnored) {
        const action = await vscode.window.showWarningMessage(
            '⚠️ SECURITY ALERT: Your .env file is not ignored in .gitignore! You risk committing secrets.',
            'Fix it for me',
            'Ignore'
        );

        if (action === 'Fix it for me') {
            const appendContent = gitignoreContent.endsWith('\n') || gitignoreContent === '' ? '.env\n' : '\n.env\n';
            fs.appendFileSync(gitignorePath, appendContent);
            vscode.window.showInformationMessage('✅ Successfully added .env to .gitignore.');
        }
    }
}
