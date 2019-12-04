// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "timer" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		const wsedit = new vscode.WorkspaceEdit(); // creating editor
		if(vscode.workspace.workspaceFolders) {		// check if we have opened project
		const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
		const filePath = vscode.Uri.file(wsPath + '/settings/timerConfig.json'); // creat a 'object' folder with json file
		//wsedit.deleteFile(filePath,{recursive: true});
		wsedit.createFile(filePath, { ignoreIfExists: true }); // creating
		// get information from timerConfig.json if text exist alert, else add config info and alert
		vscode.workspace.openTextDocument(filePath).then((document) => {
			let text = document.getText();
			if(text ===''){
				let config = {
					'onStartUp': true,
					'weekdayTimer':  50,
					'weekendTimer': 120,
					'alertMessage': 'Don’t forget to rest!'
				};
				const position = new vscode.Position(0,0); // create a start position
				vscode.workspace.applyEdit(wsedit); // applying edits
				wsedit.insert(filePath,position,JSON.stringify(config, null, ' '));	//insert config info at config.json
				vscode.workspace.applyEdit(wsedit);
				vscode.window.showInformationMessage('Created a new file: /settings/timerConfig.json');
			}
			else{
				vscode.window.showInformationMessage('File /settings/timerConfig.json already exist and filled up');
			}
		}); 
		vscode.workspace.applyEdit(wsedit); // applying edits
		}
		else{
			vscode.window.showInformationMessage('Open some project');
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
