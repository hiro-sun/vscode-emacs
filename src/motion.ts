import * as vscode from 'vscode';

import {Point} from './point';
import {EditMode} from './edit_mode';


export class Motion implements vscode.Disposable {
    private column: number = 0;

    private edit_mode: EditMode;
    private point: Point;
    private disposable_list = new Array<vscode.Disposable>();
    private mark_point: Point;
    
    constructor (edit_mode: EditMode) {
        
        this.edit_mode = edit_mode;
        this.disposable_list.push(vscode.window.onDidChangeActiveTextEditor(e => {
            if (vscode.window.activeTextEditor.selection) {
                let current_position = vscode.window.activeTextEditor.selection.active;
                this.point = new Point(current_position.line, current_position.character);
                this.column = this.point.character;
            }
        }));
        
        this.disposable_list.push(vscode.window.onDidChangeTextEditorSelection(e => {
            let selection = e.selections[0];
            if (selection) {
                let line = selection.active.line;
                let character = selection.active.character;
                if (this.point.line != line || this.point.character != character) {
                    this.point = new Point(line, character);
                    this.column = this.point.character;
                    
                }
            }
        }));
    }
    
    updateMode(edit_mode: EditMode): Motion {
        this.edit_mode = edit_mode;
        if (this.edit_mode === EditMode.MARK) {
            this.mark_point = new Point(this.point.line, this.point.character);
        } else {
            this.mark_point = null;
        }
        return this;
    }
    
    move(line: number = null, character: number = null): Motion {
        if (this.edit_mode === EditMode.MARK)  return this.select(line, character);
        
        if (line != null && character != null) {
            this.point = new Point(line, character);
        }
        
        let selection = new vscode.Selection(this.point, this.point);
        vscode.window.activeTextEditor.selection = selection;

        let range = new vscode.Range(this.point, this.getPoint().translate(0, 1));
        vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
        
        return this;
    }
    
    private select(line: number = null, character: number = null): Motion {
        if (line != null && character != null) {
            this.mark_point = new Point(line, character);
        }
        
        let selection = new vscode.Selection(this.mark_point, this.getPoint());
        vscode.window.activeTextEditor.selection = selection;

        let range = new vscode.Range(this.point, this.getPoint().translate(0, 1));
        vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
        return this;
    }
    
    quit(): Motion {
        vscode.window.activeTextEditor.selection = new vscode.Selection(this.point, this.point);
        return this;
    }
    
    right(): Motion {
        this.point = this.point.right();
        this.column = this.point.character;
        return this;
    }
    
    left(): Motion {
        this.point = this.point.left();
        this.column = this.point.character;
        return this;
    }
    
    down(): Motion {
        if (!this.point.isLastLine()) {
            this.point = this.point.nextLine(this.column);
        }
        return this;
    }
    
    
    up(): Motion {
        if (!this.point.isFirstLine()) {
            this.point = this.point.prevLine(this.column);
        }
        return this;
    }
    
    leftWord(): Motion {
        this.point = this.point.leftWord();
        this.column = this.getPoint().character;
        return this;
    }
    
    rightWord(): Motion {
        this.point = this.point.rightWord();
        this.column = this.getPoint().character;
        return this;
    }
    
    lineBegin(): Motion {
        this.point = this.point.lineBegin();
        return this;
    }
    
    lineEnd(): Motion {
        this.point = this.point.lineEnd();
        return this;
    }
    
    documentBegin(): Motion {
        this.point = this.point.documentBegin();
        this.column = this.point.character;
        return this;
    }
    
    documentEnd(): Motion {
        this.point = this.point.documentEnd();
        this.column = this.point.character;
        return this;
    }
    
    getPoint(): Point {
        return this.point;
    }
    
    getMarkPoint(): Point {
        return this.mark_point;
    }
    
    dispose() {
        _.each(this.disposable_list, disposable => {
           disposable.dispose();
        });
    }
}