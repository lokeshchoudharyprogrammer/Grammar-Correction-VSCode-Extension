// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// const OPENAI_API_URL = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

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
	let disposable = vscode.commands.registerCommand('grammar-correction-ai.correctGrammar', function () {
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
	.btn {
		border: none;
		width: 15em;
		height: 5em;
		border-radius: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
		background: #1C1A1C;
		cursor: pointer;
		transition: all 450ms ease-in-out;
	  }
	  
	  .sparkle {
		fill: #AAAAAA;
		transition: all 800ms ease;
	  }
	  
	  .text {
		font-weight: 600;
		color: #AAAAAA;
		font-size: medium;
	  }
	  
	  .btn:hover {
		background: linear-gradient(0deg,#A47CF3,#683FEA);
		box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
		inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
		0px 0px 0px 4px rgba(255, 255, 255, 0.2),
		0px 0px 180px 0px #9917FF;
		transform: translateY(-2px);
	  }
	  
	  .btn:hover .text {
		color: white;
	  }
	  
	  .btn:hover .sparkle {
		fill: white;
		transform: scale(1.2);
	  } 
</style>
    <body>
	<h2>Grammar Correction Submit Text and Display Below </h2>
	<form id="inputForm">
		<textarea id="text" name="text" rows="4" cols="50"></textarea><br><br>
		<button class="btn"  type="submit" id="submitButton" value="Submit">
    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>

    <span class="text">Generate</span>
</button>

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
                    submittedText.innerHTML = "<p><strong>Error</strong></p>";

                    console.error('Error:', error);
                }
            });

            async function app(text) {
                const requestData = {
                    prompt: text,
                    max_tokens: 1500,
                    temperature: 0.7,
                    n: 1
                };

                const requestOptions = {
                    method: "POST",
                    headers: {
                        Authorization: 'Bearer ',
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
