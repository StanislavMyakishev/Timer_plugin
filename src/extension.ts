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
	let initTimer = vscode.commands.registerCommand('extension.initTimer', () => {
		// The code you place here will be executed every time your command is executed
		const wsedit = new vscode.WorkspaceEdit(); // creating editor
		if (vscode.workspace.workspaceFolders) {		// check if we have opened project
			const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
			const filePath = vscode.Uri.file(wsPath + '/settings/timerConfig.json'); // creat a 'object' folder with json file
			wsedit.createFile(filePath, { ignoreIfExists: true }); // creating
			// get information from timerConfig.json if text exist alert, else add config info and alert 
			// we use setTimeout for a little delay because we need time for creating our file
			setTimeout(() => vscode.workspace.openTextDocument(filePath).then((document) => {
				let text = document.getText();
				if (text === '') {
					let config = {
						'onStartUp': true,
						'weekdayTimer': 50,
						'weekendTimer': 120,
						'alertMessage': 'Don’t forget to rest!'
					};
					const position = new vscode.Position(0, 0); // create a start position
					wsedit.insert(filePath, position, JSON.stringify(config, null, ' '));	//insert config info at config.json
					vscode.workspace.applyEdit(wsedit);
					vscode.window.showInformationMessage('Created a new file: /settings/timerConfig.json');
				}
				else {
					vscode.window.showErrorMessage('File /settings/timerConfig.json already exist and filled up');
				}
			}), 100);
			vscode.workspace.applyEdit(wsedit); // applying edits
		}
		else {
			vscode.window.showInformationMessage('Open some project');
		}
	});
	let startWeekday = vscode.commands.registerCommand('extension.startWeekday', () => {
		if (vscode.workspace.workspaceFolders) {
			const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
			const filePath = vscode.Uri.file(wsPath + '/settings/timerConfig.json');
			vscode.workspace.openTextDocument(filePath).then((document) => {
				let text = document.getText(); // get info from config.json file
				let obj = JSON.parse(text); // conver txt file to json obj
				if (obj.weekdayTimer > 0 && obj.alertMessage !== '' && obj.onStartUp === true) { // check if we have parametrs
					let time = obj.weekdayTimer;
					let message = obj.alertMessage;
					// alert message to rest 
					function displayAlert(time: number, message: string) {
						vscode.window.showInformationMessage('Timer for weekday started');
						const interval = setInterval(function () {
							let text = document.getText();
							let obj = JSON.parse(text);
							if (obj.onStartUp !== true) {
								clearInterval(interval);
							}
							else {
								vscode.window.showInformationMessage(message);
							}
						}, time * 60000);
					}
					displayAlert(time, message);
				}
				else {
					vscode.window.showErrorMessage('Some problem in timerConfig.json with weekdayTimer value or alertMessage value or obj.onStartUp value');
				}
			}).then(undefined, err => {
				vscode.window.showErrorMessage(String(err));
			});
		}
		else {
			vscode.window.showErrorMessage('Open some project');
		}

	});
	let startWeekend = vscode.commands.registerCommand('extension.startWeekend', () => {
		if (vscode.workspace.workspaceFolders) {
			const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
			const filePath = vscode.Uri.file(wsPath + '/settings/timerConfig.json');
			vscode.workspace.openTextDocument(filePath).then((document) => {
				let text = document.getText(); // get info from config.json file
				let obj = JSON.parse(text); // conver txt file to json obj
				if (obj.weekendTimer > 0 && obj.alertMessage !== '' && obj.onStartUp === true) { // check if we have parametrs
					let time = obj.weekendTimer;
					let message = obj.alertMessage;
					// alert message to rest 
					function displayAlert(time: number, message: string) {
						vscode.window.showInformationMessage('Timer for weekend day started');
						const interval = setInterval(function () {
							let text = document.getText();
							let obj = JSON.parse(text);
							if (obj.onStartUp !== true) {
								clearInterval(interval);
							}
							else {
								vscode.window.showInformationMessage(message);
							}
						}, time * 60000);
					}
					displayAlert(time, message);
				}
				else {
					vscode.window.showErrorMessage('Some problem in timerConfig.json with weekendTimer value or alertMessage value or obj.onStartUp value');
				}// handle error
			}).then(undefined, err => {
				vscode.window.showErrorMessage(String(err));
			});


		}
		else {
			vscode.window.showErrorMessage('Open some project');
		}

	});
	let stopTimer = vscode.commands.registerCommand('extension.stopTimer', () => {
		const wsedit = new vscode.WorkspaceEdit();
		if (vscode.workspace.workspaceFolders) {
			const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
			const filePath = vscode.Uri.file(wsPath + '/settings/timerConfig.json');
			const position = new vscode.Position(0, 0); // create a start position
			vscode.workspace.openTextDocument(filePath).then((document) => {
				let text = document.getText(); // get info from config.json file
				let obj = JSON.parse(text); // conver txt file to json obj
				if (obj.onStartUp === true) {
					obj.onStartUp = false;
					let voidStr = new Uint8Array(0); // clear
					vscode.workspace.fs.writeFile(filePath, voidStr);	//clear
					vscode.workspace.applyEdit(wsedit);
					setTimeout(() => wsedit.insert(filePath, position, JSON.stringify(obj, null, ' ')), 100);	//insert config info at config.json with onStartUp: false
					vscode.window.showInformationMessage('Timer stoped');
					setTimeout(() => vscode.workspace.applyEdit(wsedit), 300);
				}
				else {
					vscode.window.showErrorMessage('Timer already stoped onStartUp: false');
				}
			}).then(undefined, err => {
				vscode.window.showErrorMessage(String(err));
			});
		}

	});
	context.subscriptions.push(initTimer);
	context.subscriptions.push(startWeekday);
	context.subscriptions.push(startWeekend);
	context.subscriptions.push(stopTimer);
}

// this method is called when your extension is deactivated
export function deactivate() { }