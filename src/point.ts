import * as vscode from 'vscode';
import * as _ from 'lodash';

export class Point extends vscode.Position {
    private non_word_characters = "/\\()\"':,.;<>~!@#$%^&*|+=[]{}`?-";
    private word_delimiters: string[] = ["(", ")", "[", "]", "{", "}", ":", " ", "=", "<", ">", "|", "/", "'", "\"", "~", "`", "@", "*", "+", "-", "?", ",", ".", ";"];

    private non_word_char_regex : RegExp;
   
    constructor(line: number, character: number) {
        super(line, character);
        let segments = ["(^[\t ]*$)"];
        segments.push(`([^\\s${_.escapeRegExp(this.non_word_characters) }]+)`);
        segments.push(`[\\s${_.escapeRegExp(this.non_word_characters) }]+`);
        this.non_word_char_regex = new RegExp(segments.join("|"), "g");
    }
    
    create(line: number, character: number): Point {
        return new Point(line, character);
    }
    
    left(): Point {
        return (!this.isLineBegin()) ? new Point(this.line, this.character - 1) : this;           
    }
    
    right(): Point {
        return (!this.isLineEnd()) ? new Point(this.line, this.character + 1) : this;
    }
    
    nextLine(column: number): Point {
        return (!this.isBufferEnd()) ? new Point(this.line + 1, Math.min(this.getLineLength(this.line + 1), column)) : this;
    } 
    
    prevLine(column: number): Point {
        return (!this.isBufferEnd()) ? new Point(this.line - 1, Math.min(this.getLineLength(this.line - 1), column)) : this;
    }
    
    leftWord(): Point {
        let current_line = vscode.window.activeTextEditor.document.lineAt(this);
        
        if (!this.isFirstLine() && this.isExistWordAtCurrentLine(current_line)) {
            let prev_line = new Point(this.line - 1, this.character);
            return prev_line.lineEnd();
        }

        let line = this.getLineAt(this);
        let words = line.text.match(this.non_word_char_regex);

        let start_word: number;
        let end_word: number;

        if (words) {
            words = words.reverse();
            end_word = line.range.end.character;
            for (var index = 0; index < words.length; index++) {
                end_word = end_word - words[index].length;
                var word = words[index].trim();
                if (word.length > 0) {
                    start_word = line.text.indexOf(word, end_word);

                    if (start_word !== -1 && this.character > start_word) {
                        return new Point(this.line, start_word);
                    }
                }
            }
        }

        return this.lineBegin();
    }
    
    rightWord(): Point {
        if (!this.isLastLine() && this.character === this.lineEnd().character) {
            let line = this.getLineAt(this.translate(1));
            return new Point(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
        }

        let line = this.getLineAt(this);
        let words = line.text.match(this.non_word_char_regex);
        
        let start_word: number;
        let end_word: number;

        if (words) {
            for (var index = 0; index < words.length; index++) {
                var word = words[index].trim();
                if (word.length > 0) {
                    start_word = line.text.indexOf(word, end_word);
                    end_word = start_word + word.length;
                    if (this.character < start_word) {
                        return new Point(this.line, start_word);
                    }
                }
            }
        }

        return this.lineEnd();
    }
    
    documentBegin(): Point {
        return new Point(0, 0);
    }
    
    documentEnd(): Point {
        let line_count = vscode.window.activeTextEditor.document.lineCount;
        let max_line = line_count > 0 ? line_count - 1 : 0;
        let max_character = this.getLineLength(max_line);
        return new Point(max_line, max_character);
    }
 
    isFirstLine(): boolean {
        return this.line === 0;
    }
    
    isLastLine(): boolean {
        return this.line === (vscode.window.activeTextEditor.document.lineCount - 1);
    }
    
    isExistWordAtCurrentLine(current_line: vscode.TextLine): boolean {
       return this.character <= current_line.firstNonWhitespaceCharacterIndex;
    }
    
    
    getLineAt(position: vscode.Position): vscode.TextLine {
        return vscode.window.activeTextEditor.document.lineAt(position);
    }
    
    lineBegin(): Point {
        return new Point(this.line, 0);
    }
    
    lineEnd(): Point {
        return new Point(this.line, this.getLineLength(this.line));
    }
    
    isLineBegin(): boolean { 
        return this.character === 0;
    }
    
    isLineEnd(): boolean {
        return this.character === this.getLineLength(this.line);
    }
    
    isBufferBegin(): boolean {
        return false;
    }
    
    isBufferEnd(): boolean {
        return false;
    }
    
    getLineLength(line_number: number = null): number {
        line_number = (line_number === null) ? vscode.window.activeTextEditor.selection.active.line : line_number;
        
        if (line_number < vscode.window.activeTextEditor.document.lineCount) {
            let count = vscode.window.activeTextEditor.document.lineAt(line_number).text.length;
            return count;
        }
        return 0;
    }
}