// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const OPENAI_API_KEY = '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';
// const OPENAI_API_URL = 'https://api.openai.com/v1/engines/grammar-correct';
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "grammar-correction-open-ai" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('grammar-correction-open-ai.correctGrammar', function () {
		const panel = vscode.window.createWebviewPanel(
			'formSubmissionExtension',
			'Form Submission',
			vscode.ViewColumn.One,
			{
				enableScripts: true, // Enable scripts in the webview
			}
		);

		panel.webview.html = getWebviewContent();
	});

	context.subscriptions.push(disposable);

}
function getWebviewContent() {
	return ` <!DOCTYPE html>
    <html>
	<style>
	/* Custom CSS for styling the button */
	#inputForm {
		text-align: center;
		margin: 20px;
	}

	#text {
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
	}

	#submitButton {
		background-color: #007ACC;
		color: white;
		border: none;
		padding: 10px 20px;
		cursor: pointer;
		border-radius: 5px;
		font-size: 14px;
	}

	#submitButton:hover {
		background-color: #005DA6;
	}

	#submittedText {
		margin-top: 20px;
	}
</style>
    <body>
	<h2>Grammar Correction Submit Text and Display Below</h2>
	<form id="inputForm">
		<textarea id="text" name="text" rows="4" cols="50"></textarea><br><br>
		<input type="submit" id="submitButton" value="Submit">
	</form>
	<h3>Your Output 🫡</h3>
        <div id="submittedText"></div>
        <script>
            const inputForm = document.getElementById('inputForm');
            const submittedText = document.getElementById('submittedText');

            inputForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(inputForm);
                const text = formData.get('text');

                try {
                    const correctedText = await app(text);
                    submittedText.innerHTML = "<p><strong>Corrected Text:</strong></p><p>" + correctedText + "</p>";
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            async function app(text) {
                const requestData = {
                    prompt: text,
                    max_tokens: 100,
                    temperature: 0.7,
                    n: 1
                };

                const requestOptions = {
                    method: "POST",
                    headers: {
                        Authorization: 'Bearer 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',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                };

                const response = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', requestOptions);
                const data = await response.json();
                const correctedText = data.choices[0].text.trim();
                return correctedText;
            }
        </script>
    </body>
    </html>
    `;
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
