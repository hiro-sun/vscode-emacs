import * as vscode from 'vscode';


export class StatusBar {
    private item: vscode.StatusBarItem;
    
    constructor() {
        this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.item.show();
        this.init();
    }
    
    addText(text: string): StatusBar {
        this.item.text += text;
        return this;
    }
    
    setText(text: string): StatusBar {
        this.item.text = text;
        return this;
    }
    
    clear(): StatusBar {
        setTimeout(() => {
            this.init();
        }, 1000);
        return this;
    }
    
    init(): StatusBar {
        this.item.text = "";
        return this;
    }
}