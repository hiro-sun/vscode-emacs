import {Editor} from './editor';
import {Item} from './item';
import {Point} from './point';

export class Operation {
    private editor: Editor;
    private command_list: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};

    constructor() {
        this.editor = new Editor();

        this.command_list = {
            'C-f': () => this.editor.getMotion().right().move(),
            'C-b': () => this.editor.getMotion().left().move(),
            'C-n': () => this.editor.getMotion().down().move(),
            'C-p': () => this.editor.getMotion().up().move(),        
            'C-a': () => this.editor.getMotion().lineBegin().move(),
            'C-e': () => this.editor.getMotion().lineEnd().move(),
            'M-f': () => this.editor.getMotion().rightWord().move(),
            'M-b': () => this.editor.getMotion().leftWord().move(),
            'C-v': () => {
                this.editor.setNormalMode();
                this.editor.pageDown();
            },
            'M-v': () => {
                this.editor.setNormalMode();
                this.editor.pageUp();
            },
            'M->': () => {
                this.editor.setNormalMode();
                this.editor.getMotion().documentEnd().move();
            },
            'M-<': () => {
                this.editor.setNormalMode();
                this.editor.getMotion().documentBegin().move();
            },
            "M-g_g": () => {
                this.editor.gotoLine();
            },
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
                    this.editor.getStatusBar().init();
                }
            },
            'C-w': () => {
                if (this.editor.cut()) {
                    this.editor.getStatusBar().setText("Cut").clear();
                } else {
                    this.editor.getStatusBar().setText("Cut Error!").clear();
                }
            },
            'M-w': () => {
                this.editor.copy();
                this.editor.setNormalMode();
                this.editor.getStatusBar().setText("Copy").clear();

            },
            'C-y': () => {
                this.editor.setNormalMode();
                this.editor.yank();
                this.editor.getStatusBar().setText("Yank").clear();

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
                this.editor.getStatusBar().addText("C-x h").clear();
            },
            "C-x_u": () => {
                this.editor.undo();
                this.editor.getStatusBar().addText("Undo!").clear();
            },
            "C-/": () => {
                this.editor.undo();
                this.editor.getStatusBar().setText("Undo!").clear();
            },
            "C-x_z": () => {
                this.editor.redo();
                this.editor.getStatusBar().addText("C-x z").clear();
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
                this.editor.getStatusBar().setText("Quit").clear();
            },
            'C-space': () => {
                this.editor.changeMode();
                if (this.editor.isNormalMode()) {
                    this.editor.getStatusBar().setText("Mark deactivated").clear();
                } else if (this.editor.isMarkMode()) {
                    this.editor.getStatusBar().setText("Mark Set");
                }
            },
            "C-quote": () => {
                this.editor.toggleSuggest();
                this.editor.getStatusBar().setText("Triggered Suggest").clear();
            },
            "C-doublequote": () => {
                this.editor.toggleParameterHint();
                this.editor.getStatusBar().setText("Triggered Parameter Hints").clear();
            }
        };
    }

    getCommand(command_name: string): (...args: any[]) => any {
        return this.command_list[command_name];
    }
}
