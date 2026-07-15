import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

export class EnvHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) { return null; }

        const word = document.getText(range);
        
        // Basic heuristic: Env vars are typically uppercase with underscores
        if (word !== word.toUpperCase() || word.length < 2 || !/^[A-Z0-9_]+$/.test(word)) {
            return null;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) { return null; }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const envPath = path.join(rootPath, '.env');
        const examplePath = path.join(rootPath, '.env.example');
        
        let envParsed: Record<string, string> = {};
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envParsed = dotenv.parse(envContent);
        }

        if (word in envParsed) {
            let value = envParsed[word];
            // Mask the value for shoulder-surfing protection
            if (value.length > 3) {
                value = value.substring(0, 3) + '••••••••';
            } else if (value.length > 0) {
                value = '••••••••';
            } else {
                value = '*(empty)*';
            }

            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**Env Manager**\n\n`);
            markdown.appendMarkdown(`✅ \`${word}\` is currently defined in \`.env\`\n\n`);
            markdown.appendMarkdown(`**Value:** \`${value}\``);
            
            return new vscode.Hover(markdown);
        } else if (fs.existsSync(examplePath)) {
            const exampleContent = fs.readFileSync(examplePath, 'utf8');
            const exampleParsed = dotenv.parse(exampleContent);
            
            if (word in exampleParsed) {
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown(`**Env Manager**\n\n`);
                markdown.appendMarkdown(`❌ \`${word}\` is **missing** from \`.env\`! (Found in \`.env.example\`)`);
                return new vscode.Hover(markdown);
            }
        }
        
        return null;
    }
}
