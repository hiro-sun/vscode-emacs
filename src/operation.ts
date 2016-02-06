import {Editor} from './editor';
import {Item} from './item';
import {Point} from './point';

export class Operation {
    private editor: Editor;
    private command_list: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};
    
    constructor() {
        this.editor = new Editor();
       
        this.command_list = {
            
            "u": () => {
                if (!this.editor.getCx()) {
                    this.editor.insertCharacter("u");
                } else {
                    this.editor.undo();
                    this.editor.setCx(false);
                }
            },
            'C-f': () => {
                if (!this.editor.getCx()) {
                    this.editor.getMotion().right().move()
                } else {
                    this.editor.openFile();
                    this.editor.getStatusBar().addText(" C-f").clear();
                    this.editor.setCx(false);
                }
                
            },
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
            'C-s': () => {
                if (!this.editor.getCx()) {
                    // 後方検索
                } else {
                    // 保存
                    this.editor.saveFile();
                    this.editor.getStatusBar().addText(" C-s").clear();
                    this.editor.setCx(false);
                }
                this.editor.setNormalMode();
            },
            "C-r": () => {
                // 前方検索
            },
            
            // Edit command
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
                // 行カット
                if (!this.editor.getMotion().getPoint().isLineEnd()) {
                    this.editor.setMarkMode();
                    this.editor.getMotion().lineEnd().move();
                    let range = this.editor.getMarkSelection();
                    return Editor.delete(range).then(() => {
                        this.editor.setNormalMode();
                        if (this.editor.getMotion().getPoint().lineEnd()) {
                            //return this.editor.getMotion().left().move();
                        }
                    });
                } else {
                    this.editor.setNormalMode();
                    this.editor.getStatusBar().init();
                }
                
            },
            'C-w': () => {
                if (!this.editor.getCx()) {
                    if (this.editor.cut()) {
                        this.editor.getStatusBar().setText("Cut").clear();
                    } else {
                        this.editor.getStatusBar().setText("Cut Error!").clear();
                    }
                } else {
                    // ファイルを別名で保存
                    this.editor.saveFileAs();
                    this.editor.getStatusBar().addText(" C-w").clear();
                    this.editor.setCx(false);
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
            'C-o': () => {
                this.editor.setNormalMode();
                this.editor.insertBlankNextLine();
            },
            "C-semicolon": () => {
                
                this.editor.toggleLineComment();
                this.editor.setNormalMode();
            },
            "M-semicolon": () => {
                
                this.editor.toggleRegionComment();
                this.editor.setNormalMode();
            },
            
            'C-space': () => {
                this.editor.changeMode();
                if (this.editor.isNormalMode()) {
                    this.editor.getStatusBar().setText("Mark deactivated").clear();
                } else if (this.editor.isMarkMode()) {
                    this.editor.getStatusBar().setText("Mark Set");
                }
            },
            'C-g': () => {
                this.editor.setNormalMode();
                this.editor.getStatusBar().setText("Quit").clear();
    
            },
            "C-x": () => {
                this.editor.setNormalMode();
                this.editor.toggleCx();
                if (this.editor.getCx()) {
                    this.editor.getStatusBar().setText("C-x");
                } else {
                    this.editor.getStatusBar().init();
                  
                }
            },
            "M-x": () => {
                
            },
            
        };
    }
    
    getCommand(command_name: string):  (...args: any[]) => any {   
        return this.command_list[command_name];
    }
}