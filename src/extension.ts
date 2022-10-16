import { MainCtrlr } from './main-ctrlr';
import * as vscode from 'vscode';
import { TextEditor } from 'vscode';
import { Steps } from './input-box';
import { lineJumpCmds } from './constants';

function _onStartBlank(textEditor: TextEditor): void {
  new MainCtrlr(textEditor, Steps.searchInput);
}

function _onShowAllLineJumpTargets(textEditor: TextEditor): void {
  if (lineJumpCmds.showAllLineJumpTargets) {
    new MainCtrlr(textEditor, Steps.executorInput, lineJumpCmds.showAllLineJumpTargets);
  } else {
    _onStartBlank(textEditor);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const disposables = [
    vscode.commands.registerTextEditorCommand('cursor-commander.start-blank', _onStartBlank),
    vscode.commands.registerTextEditorCommand('cursor-commander.show-all-line-targets', _onShowAllLineJumpTargets),
  ];
  context.subscriptions.push(...disposables);
}

export function deactivate(): void {}
