import * as vscode from 'vscode';
import {Operation} from './operation';

export function activate(context: vscode.ExtensionContext) {
    
    let op = new Operation();
    let command_list: string[] = [
        "C-g",
        "C-space",
        
        // Move
        "C-f","C-b","C-n","C-p","C-a","C-e","M-f","M-b",
        "C-v","M-v","M->","M-<","M-g_g",
        "C-s","C-r","C-l",
        
        // Edit
        "C-d","C-h","M-d","C-k","C-w","M-w","C-y",
        "C-j","C-m","C-o",
        "C-semicolon","M-semicolon",
        "C-x_h","C-x_u","C-x_C-s","C-x_C-w","C-x_C-f",
        
        //File
        "C-x",
        
        //Meta
        "M-x"
    ];
    
    command_list.forEach((command_name) => {
        context.subscriptions.push(registerCommand(command_name, op));
    });
}

export function deactivate() {
}

function registerCommand(command_name: string, op: Operation): vscode.Disposable {
    return vscode.commands.registerCommand("emacs." + command_name, op.getCommand(command_name));
}

export function showInfo(text: string): Thenable<{}> {
    return vscode.window.showInformationMessage("Emacs: " + text);
}

export function showError(text: string): Thenable<{}> {
    return vscode.window.showErrorMessage("Emacs: " + text);
}
