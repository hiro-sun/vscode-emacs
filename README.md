# vscode-emacs

This is emacs like plugin for Visual Studio Code.

## Update History

0.0.7 (2016-07-14)
- bug fix for C-k. Thanks trezm.
- C-o and C-x C-f execute "workbench.action.files.openFile". Thanks sammy44nts.

0.0.6
- C-p and C-n can be used in other panels such as Suggestion and Hint.
- Fix bug C-x C-f won't open file explorer.
- Add one more undo operation C-/
- Add redo operation C-x z
- Fix incorrect column moving after using C-a and C-e

These commands and bug fixes were coding by kpping. Thanks. :)

0.0.5
- Change the processing of C-u, C-h.
- Change the processing of C-x C-f, C-x C-w, C-x C-s.

0.0.4
- Modify the search operation.

0.0.3
- Fixed a bug that occurred when you start from the command line.

## Operation
Use `Shift+DEL` to cut to clipboard, the `Ctrl+C` is not overridden.
Use `Shift+Insert` to paste from clipboard.

### Move command
|Command | Status | Desc |
|--------|--------|------|
| `C-f` | OK | Move to the forward |
| `C-b` | OK | Move to the backward |
| `C-n` | OK | Move to the next line |
| `C-p` | OK | Move to the previous line |
| `C-a` | OK | Move to the beginning of line |
| `C-e` | OK | Move to the end of line |
| `M-f` | OK | Move to the forward by one word unit |
| `M-b` | OK | Move to the backward by one word unit |
| `M->` | OK | Move to the end of buffer |
| `M-<` | OK | Move to the beginning of buffer |
| `C-v` | OK | Scroll down by one screen unit |
| `M-v` | OK | Scroll up by one screen unit |
| `M-x goto-line` | - | Jump to line |
| `M-x goto-char` | - | - |
| `C-x C-n` | - | - |
| `C-u C-x C-n` | - |deactivate C-x C-n |
| `M-g g` | OK | Jump to line (command palette) |


### Search Command
|Command | Status | Desc |
|--------|--------|------|
| `C-s` | OK | Search forward |
| `C-r` | OK | Search backward |
| `C-l` | - | - |
| `M-x (regex)` | - | - |
| `M-% (string)` | - | - |

### Edit command
|Command | Status | Desc |
|--------|--------|------|
| `C-d` | OK | Delete right from point (DEL)|
| `C-h` | OK | Delete left from point (BS) |
| `M-d` | OK | Delete word at current position |
| `C-k` | - | Kill to line end |
| `C-w` | △ | Kill region |
| `M-w` | △ | Copy region to kill ring |
| `C-y` | △ | Yank |
| `C-j` | OK | Line Feed |
| `C-m` | - | Carriage Return |
| `C-i` | - | Horizontal Tab |
| `C-x C-o` | - | - |
| `C-x h` | OK | Select All |
| `C-x u` (`C-/`)| OK | Undo |
| `M-x tabify` | - | - |
| `M-x untabify` | - | - |
| `M-x comment-region` | - | Comment out |
| `C-u M-x comment-region` | - | Comment in |
| `C-;` | OK | Toggle line comment in and out |
| `M-;` | △ | Toggle region comment in and out |

### Other Command
|Command | Status | Desc |
|--------|--------|------|
| `C-g` | OK | Cancel |
| `C-space` | OK | Set mark |
| `C-\` | - | IME control |
| `C-quote` | OK | IntelliSense Suggestion |
| `C-doublequote` | △ | IntelliSense Parameter Hint |
| `M-x shell` | - | Start up to the shell |
| `M-/(dabbrev)` | - | - |
| `M-num command` | - | - |

### File Command
|Command | Status | Desc |
|--------|--------|------|
| `C-o` | OK | Open a file |
| `C-x C-f` | OK | Open a working directory |
| `C-x C-s` | OK | Save |
| `C-x C-w` | OK | Save as |
| `C-x i` | - | Insert buffer from file |
| `C-x C-d` | - | Open Folder |
| `C-x C-n` | - | Open new window |
| `C-x C-b` | - | Create new file and open |

## Conflicts with default key bindings
- `ctrl+g`: workbench.action.gotoLine => **Use `alt+g g` instead**;
- `ctrl+b`: workbench.action.toggleSidebarVisibility;
- `ctrl+space`: toggleSuggestionDetails, editor.action.triggerSuggest;
- `ctrl+x`: editor.action.clipboardCutAction => **Use `shift+DEL` instead**;
- `ctrl+v`: editor.action.clipboardPasteAction => **Use `shift+insert` instead**;
- `ctrl+k`: editor.debug.action.showDebugHover, editor.action.trimTrailingWhitespace, editor.action.showHover, editor.action.removeCommentLine, editor.action.addCommentLine, editor.action.openDeclarationToTheSide;
- `ctrl+y`: redo;
- `ctrl+m`: editor.action.toggleTabFocusMode;
- `ctrl+/`: editor.action.commentLine => **Use `ctrl+;` instead**;
- `ctrl+p`: workbench.action.quickOpenNavigateNext.
