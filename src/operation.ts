import {Editor} from './editor';
import {Item} from './item';
import {Point} from './point';

export class Operation {
    private editor: Editor;
    private commandList: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};

    constructor() {
        this.editor = new Editor();
        this.commandList = {
            'C-d': () => {
                this.editor.setNormalMode();
                this.editor.deleteRight();
            },
            'C-h': () => {
                this.editor.setNormalMode();
                this.editor.deleteLeft();
            },
            'M-d': () => {
                this.editor.setNormalMode();
                this.editor.deleteWordRight();

            },
            'C-k': () => {
                if (!this.editor.getMotion().getPoint().isLineEnd()) {
                    this.editor.setMarkMode();
                    this.editor.getMotion().lineEnd().move();
                    this.editor.cut();
                    this.editor.yank();
                } else {
                    if (this.editor.getMotion().getPoint().isLineBegin()) {
                        this.editor.deleteLeft();
                    }
                    this.editor.setNormalMode();
                }
            },
            'C-w': () => {
                if (this.editor.cut()) {
                    this.editor.setStatusBarMessage("Cut");
                } else {
                    this.editor.setStatusBarMessage("Cut Error!");
                }
            },
            'M-w': () => {
                this.editor.copy();
                this.editor.setNormalMode();
                this.editor.setStatusBarMessage("Copy");

            },
            'C-y': () => {
                this.editor.setNormalMode();
                this.editor.yank();
                this.editor.setStatusBarMessage("Yank");

            },
            'C-j': () => {
                this.editor.setNormalMode();
                this.editor.lineBreak();
            },
            'C-m': () => {
                this.editor.setNormalMode();
                this.editor.lineBreak();
            },
            "C-x_h": () => {
                this.editor.selectAll();
                this.editor.setStatusBarMessage("C-x h");
            },
            "C-x_u": () => {
                this.editor.undo();
                this.editor.setStatusBarMessage("Undo!");
            },
            "C-/": () => {
                this.editor.undo();
                this.editor.setStatusBarMessage("Undo!");
            },
            "C-x_z": () => {
                this.editor.redo();
                this.editor.setStatusBarMessage("C-x z");
            },
            "C-semicolon": () => {
                this.editor.toggleLineComment();
                this.editor.setNormalMode();
            },
            "M-semicolon": () => {
                this.editor.toggleRegionComment();
                this.editor.setNormalMode();
            },
            'C-g': () => {
                this.editor.setNormalMode();
                this.editor.setStatusBarMessage("Quit");
            }
        };
    }

    getCommand(command_name: string): (...args: any[]) => any {
        return this.commandList[command_name];
    }
}
