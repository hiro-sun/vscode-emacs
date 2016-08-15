import * as vscode from 'vscode';

export class Editor {
    private killRing: string;
    private isKillRepeated: boolean;

    constructor() {
        this.killRing = '';
        this.isKillRepeated = false;
        vscode.window.onDidChangeTextEditorSelection(() => {
            this.isKillRepeated = false;
        });
    }

    setStatusBarMessage(text: string): vscode.Disposable {
        return vscode.window.setStatusBarMessage(text, 1000);
    }

    getSelectionRange(): vscode.Range {
        let selection = vscode.window.activeTextEditor.selection,
            start = selection.start,
            end = selection.end;

        return (start.character !== end.character || start.line !== end.line) ? new vscode.Range(start, end) : null;
    }

    getSelection(): vscode.Selection {
        return vscode.window.activeTextEditor.selection;
    }

    setSelection(start: vscode.Position, end: vscode.Position): void {
        let editor = vscode.window.activeTextEditor;

        editor.selection = new vscode.Selection(start, end);
    }

    /** Behave like Emacs kill command
    */
    kill(): void {
        let saveIsKillRepeated = this.isKillRepeated,
            promises = [
                vscode.commands.executeCommand("emacs.exitMarkMode"),
                vscode.commands.executeCommand("cursorEndSelect")
            ];

        Promise.all(promises).then(() => {
            let selection = this.getSelection(),
                range = new vscode.Range(selection.start, selection.end);

            this.setSelection(range.start, range.start);
            this.isKillRepeated = saveIsKillRepeated;
            if (range.isEmpty) {
                this.killEndOfLine(saveIsKillRepeated, range);
            } else {
                this.killText(range);
            }
        });
    }

    private killEndOfLine(saveIsKillRepeated: boolean, range: vscode.Range): void {
        let doc = vscode.window.activeTextEditor.document,
            eof = doc.lineAt(doc.lineCount - 1).range.end;

        if (doc.lineCount && !range.end.isEqual(eof) &&
            doc.lineAt(range.start.line).rangeIncludingLineBreak) {
            this.isKillRepeated ? this.killRing += '\n' : this.killRing = '\n';
            saveIsKillRepeated = true;
        } else {
            this.setStatusBarMessage("End of buffer");
        }
        vscode.commands.executeCommand("deleteRight").then(() => {
            this.isKillRepeated = saveIsKillRepeated;
        });
    }

    private killText(range: vscode.Range): void {
        let text = vscode.window.activeTextEditor.document.getText(range),
            promises = [
                Editor.delete(range),
                vscode.commands.executeCommand("emacs.exitMarkMode")
            ];

        this.isKillRepeated ? this.killRing += text : this.killRing = text;
        Promise.all(promises).then(() => {
            this.isKillRepeated = true;
        });
    }

    copy(range: vscode.Range = null): boolean {
        this.killRing = '';
        if (range === null) {
            range = this.getSelectionRange();
            if (range === null) {
                vscode.commands.executeCommand("emacs.exitMarkMode");
                return false;
            }
        }
        this.killRing = vscode.window.activeTextEditor.document.getText(range);
        vscode.commands.executeCommand("emacs.exitMarkMode");
        return this.killRing !== undefined;
    }

    cut(): boolean {
        let range: vscode.Range = this.getSelectionRange();

        if (!this.copy(range)) {
            return false;
        }
        Editor.delete(range);
        return true;
    }

    yank(): boolean {
        if (this.killRing.length === 0) {
            return false;
        }
        vscode.commands.executeCommand("emacs.enterMarkMode");
        vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.insert(this.getSelection().active, this.killRing);
        });
        this.isKillRepeated = false;
        return true;
    }

    undo(): void {
        vscode.commands.executeCommand("undo");
    }

    private getFirstBlankLine(range: vscode.Range): vscode.Range {
        let doc = vscode.window.activeTextEditor.document;

        if (range.start.line === 0) {
            return range;
        }
        range = doc.lineAt(range.start.line - 1).range;
        while (range.start.line > 0 && range.isEmpty) {
            range = doc.lineAt(range.start.line - 1).range;
        }
        if (range.isEmpty) {
            return range;
        } else {
            return doc.lineAt(range.start.line + 1).range;
        }
    }

    deleteBlankLines(): void {
        let selection = this.getSelection(),
            anchor = selection.anchor,
            doc = vscode.window.activeTextEditor.document,
            range = doc.lineAt(selection.start.line).range,
            promises = [],
            nextLine: vscode.Position;

        if (range.isEmpty) {
            range = this.getFirstBlankLine(range);
            anchor = range.start;
            nextLine = range.start;
        } else {
            nextLine = range.start.translate(1, 0);
        }
        selection = new vscode.Selection(nextLine, nextLine);
        vscode.window.activeTextEditor.selection = selection;
        for (let line = selection.start.line;
             line < doc.lineCount - 1  && doc.lineAt(line).range.isEmpty;
             ++line) {
            promises.push(vscode.commands.executeCommand("deleteRight"));
        }
        Promise.all(promises).then(() => {
            vscode.window.activeTextEditor.selection = new vscode.Selection(anchor, anchor);
        });
    }

    static delete(range: vscode.Range = null): Thenable<boolean> {
        if (range === null) {
            let start = new vscode.Position(0, 0),
                doc = vscode.window.activeTextEditor.document,
                end = doc.lineAt(doc.lineCount - 1).range.end;

            range = new vscode.Range(start, end);
        }
        return vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.delete(range);
        });
    }

}
