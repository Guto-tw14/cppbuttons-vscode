
const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */

var folder = vscode.window.createTerminal({
	name: "folder",
	shellPath: "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
	hideFromUser: true
})
var gcc = vscode.window.createTerminal({
	name: "gcc",
	shellPath: "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
	hideFromUser: true
})
var other = vscode.window.createTerminal({
	name: "other",
	shellPath: "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
	hideFromUser: true
})
var msvc = vscode.window.createTerminal({
	name: "msvc",
	shellPath: "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
	hideFromUser: true
})
msvc.sendText(
	'call "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\VC\\Auxiliary\\Build\\vcvars64.bat"'
)
var runner = vscode.window.createTerminal({
	name: "run",
	shellPath: "C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
	hideFromUser: true
})
var path = vscode.workspace.workspaceFolders[0].uri.path.toString().substring(1) + "/"
var file = vscode.window.activeTextEditor.document.fileName.replace(/^.*[\\\/]/, '')
var file_no_ext = file.split('.').slice(0, -1).join('.')
var r_folder = vscode.workspace.getConfiguration().get("cppbuttons.release output folder")
var d_folder = vscode.workspace.getConfiguration().get("cppbuttons.debug output folder")
var r_command = {
	gcc: vscode.workspace.getConfiguration().get("cppbuttons.release gcc command"),
	msvc: vscode.workspace.getConfiguration().get("cppbuttons.release MSVC command"),
	other: vscode.workspace.getConfiguration().get("cppbuttons.release \"other\" command")
}
var d_command = {
	gcc: vscode.workspace.getConfiguration().get("cppbuttons.debug gcc command"),
	msvc: vscode.workspace.getConfiguration().get("cppbuttons.debug MSVC command"),
	other: vscode.workspace.getConfiguration().get("cppbuttons.debug \"other\" command")
}

function activate(context) {
	let release = vscode.commands.registerCommand('cppbuttons.release', function () {
		if (r_folder === "default") {
			switch (vscode.workspace.getConfiguration().get("cppbuttons.compiler")) {
				case "gcc":
					gcc.show(false)
					gcc.sendText(r_command.gcc.replace("{file}", file).replace("{exe}", file_no_ext))
					break;
				case "MSVC":
					msvc.show(false)
					msvc.sendText(r_command.msvc.replace("{file}", file).replace("{exe}", file_no_ext))
					break;
				case "other":
					other.show(false)
					other.sendText(r_command.other.replace("{file}", file).replace("{exe}", file_no_ext))
					break;
			}
		} else {
			folder.sendText("mkdir " + r_folder)
			switch (vscode.workspace.getConfiguration().get("cppbuttons.compiler")) {
				case "gcc":
					gcc.show(false)
					gcc.sendText(r_command.gcc.replace("{file}", file).replace("{exe}", r_folder + "/" + file_no_ext))
					break;
				case "MSVC":
					msvc.show(false)
					msvc.sendText(r_command.msvc.replace("{file}", file).replace("{exe}", r_folder + "/" + file_no_ext))
					break;
				case "other":
					other.show(false)
					other.sendText(r_command.other.replace("{file}", file).replace("{exe}", r_folder + "/" + file_no_ext))
					break;
			}
		}
	});

	let debug = vscode.commands.registerCommand('cppbuttons.debug', function () {
		folder.sendText("mkdir " + r_folder)
		if (d_folder === "default") {
			switch (vscode.workspace.getConfiguration().get("cppbuttons.compiler")) {
				case "gcc":
					gcc.show(false)
					gcc.sendText(d_command.gcc.replace("{file}", file).replace("{exe}", file_no_ext))
					break;
				case "MSVC":
					msvc.show(false)
					msvc.sendText(d_command.msvc.replace("{file}", file).replace("{exe}", file_no_ext))
					break;
				case "other":
					other.show(false)
					other.sendText(d_command.other.replace("{file}", file).replace("{exe}", file_no_ext))
					break;
			}
		} else {
			switch (vscode.workspace.getConfiguration().get("cppbuttons.compiler")) {
				case "gcc":
					gcc.show(false)
					gcc.sendText(d_command.gcc.replace("{file}", file).replace("{exe}", d_folder + "/" + file_no_ext))
					break;
				case "MSVC":
					msvc.show(false)
					msvc.sendText(d_command.msvc.replace("{file}", file).replace("{exe}", d_folder + "/" + file_no_ext))
					break;
				case "other":
					other.show(false)
					other.sendText(d_command.other.replace("{file}", file).replace("{exe}", d_folder + "/" + file_no_ext))
					break;
			}
		}
	});
	let run = vscode.commands.registerCommand('cppbuttons.run', async function () {
		if (r_folder === "default") {
			if (vscode.workspace.getConfiguration().get("cppbuttons.ask parameters when run") == true) {
				var result = await vscode.window.showInputBox({
					title: "parameters to call the program",
					placeHolder: "-parameter1 -parameter2 -etc.",
					ignoreFocusOut: true
				})
				runner.show()
				runner.sendText(path + file_no_ext + ".exe " + result)

			} else {
				runner.show(false)
				runner.sendText(path + file_no_ext + ".exe")
			}
		} else {
			if (vscode.workspace.getConfiguration().get("cppbuttons.ask parameters when run") == true) {
				var result = await vscode.window.showInputBox({
					title: "parameters to call the program",
					placeHolder: "-parameter1 -parameter2 -etc.",
					ignoreFocusOut: true
				})
				runner.show()
				runner.sendText(path + r_folder.substring(1).substring(1) + "/" + file_no_ext + ".exe " + result)

			} else {
				runner.show(false)
				runner.sendText(path + r_folder.substring(1).substring(1) + "/" + file_no_ext + ".exe ")
			}
		}


	});
	let make = vscode.commands.registerCommand('cppbuttons.make', function () {
		gcc.show()
		gcc.sendText("make")
	});

	context.subscriptions.push(release);
	context.subscriptions.push(debug);
	context.subscriptions.push(run);
	context.subscriptions.push(make);
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}
