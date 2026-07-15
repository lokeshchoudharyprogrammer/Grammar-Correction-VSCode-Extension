"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshDiagnostics = refreshDiagnostics;
const vscode = require("vscode");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
function refreshDiagnostics(doc, envDiagnostics) {
    // Only check .env files
    if (path.basename(doc.fileName) !== '.env') {
        return;
    }
    const envPath = doc.fileName;
    const examplePath = path.join(path.dirname(envPath), '.env.example');
    if (!fs.existsSync(examplePath)) {
        envDiagnostics.set(doc.uri, []);
        return;
    }
    const envContent = doc.getText();
    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    const envParsed = dotenv.parse(envContent);
    const exampleParsed = dotenv.parse(exampleContent);
    // Extract type definitions from .env.example
    const typeMap = {};
    exampleContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const key = trimmed.split('=')[0].trim();
            const commentMatch = trimmed.match(/#\s*@type:\s*(url|boolean|number)/i);
            if (commentMatch) {
                typeMap[key] = commentMatch[1].toLowerCase();
            }
        }
    });
    const missingKeys = Object.keys(exampleParsed).filter(key => !(key in envParsed));
    const diagnostics = [];
    if (missingKeys.length > 0) {
        // Create a warning on the first line
        const range = new vscode.Range(0, 0, 0, doc.lineAt(0).text.length);
        const message = `Missing variables from .env.example: ${missingKeys.join(', ')}`;
        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
        diagnostics.push(diagnostic);
    }
    // Check for empty values and type validations
    const lines = envContent.split(/\r?\n/);
    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const parts = trimmed.split('=');
            const key = parts[0].trim();
            let val = parts.slice(1).join('=').trim();
            // Remove inline comments for validation
            if (val.includes('#')) {
                val = val.split('#')[0].trim();
            }
            if (val === '' && key in exampleParsed) {
                const range = new vscode.Range(i, 0, i, line.length);
                const diagnostic = new vscode.Diagnostic(range, `Value for '${key}' is empty.`, vscode.DiagnosticSeverity.Information);
                diagnostics.push(diagnostic);
            }
            else if (val !== '' && key in typeMap) {
                const expectedType = typeMap[key];
                let isValid = true;
                let errorMessage = '';
                if (expectedType === 'url') {
                    isValid = /^(https?|ftp|postgres|mongodb|redis):\/\/[^\s]+$/i.test(val) || /^localhost(:[0-9]+)?$/i.test(val);
                    errorMessage = `Value for '${key}' must be a valid URL.`;
                }
                else if (expectedType === 'boolean') {
                    isValid = ['true', 'false', '1', '0'].includes(val.toLowerCase());
                    errorMessage = `Value for '${key}' must be a boolean (true/false, 1/0).`;
                }
                else if (expectedType === 'number') {
                    isValid = !isNaN(Number(val));
                    errorMessage = `Value for '${key}' must be a valid number.`;
                }
                if (!isValid) {
                    const startIdx = line.indexOf(val) !== -1 ? line.indexOf(val) : 0;
                    const range = new vscode.Range(i, startIdx, i, line.length);
                    const diagnostic = new vscode.Diagnostic(range, errorMessage, vscode.DiagnosticSeverity.Error);
                    diagnostics.push(diagnostic);
                }
            }
        }
    });
    envDiagnostics.set(doc.uri, diagnostics);
}
//# sourceMappingURL=linter.js.map