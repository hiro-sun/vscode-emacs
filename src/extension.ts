import * as vscode from 'vscode';
import {Operation} from './operation';

var inMarkMode: boolean = false;
export function activate(context: vscode.ExtensionContext): void {
    let op = new Operation();
    let command_list: string[] = [
        "C-g",

        // Move
        "C-f", "C-b", "C-n", "C-p", "C-a", "C-e", "M-f", "M-b",
        "C-v", "M-v", "M->", "M-<", "M-g_g",

        // Edit
        "C-d", "C-h", "M-d", "C-k", "C-w", "M-w", "C-y",
        "C-j", "C-m",
        "C-x_h",
        "C-x_u", "C-/", "C-x_z",
        "C-semicolon", "M-semicolon",
 
        // IntelliSense
        "C-quote", "C-doublequote"
    ];

    command_list.forEach((command_name) => {
        context.subscriptions.push(registerCommand(command_name, op));
    });

    initMarkMode(context);
}

export function deactivate(): void {
}

function initMarkMode(context: vscode.ExtensionContext): void {
    context.subscriptions.push(vscode.commands.registerCommand(
        'emacs.enterMarkMode', () => {
            initSelection();
            inMarkMode = true;
            vscode.window.setStatusBarMessage("Mark Set", 1000);
        })
    );

    context.subscriptions.push(vscode.commands.registerCommand(
        'emacs.exitMarkMode', () => {
            if (inMarkMode) {
                vscode.commands.executeCommand("cancelSelection");
                inMarkMode = false;
                vscode.window.setStatusBarMessage("Mark deactivated", 1000);
            }
        })
    );
}

function registerCommand(command_name: string, op: Operation): vscode.Disposable {
    return vscode.commands.registerCommand("emacs." + command_name, op.getCommand(command_name));
}

function initSelection(): void {
    var currentPosition: vscode.Position = vscode.window.activeTextEditor.selection.active;
    vscode.window.activeTextEditor.selection = new vscode.Selection(currentPosition, currentPosition);
}
