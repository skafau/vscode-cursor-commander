import * as vscode from 'vscode';

const workbenchConfig = vscode.workspace.getConfiguration('cursorCommander');

const showLineStartsCmd = <string>workbenchConfig.get('jumpTargetModes.showLineStarts');
const showCodeStartsCmd = <string>workbenchConfig.get('jumpTargetModes.showCodeStarts');
const showLineEndsCmd = <string>workbenchConfig.get('jumpTargetModes.showLineEnds');
const showAllLineJumpTargetsCmd = <string>workbenchConfig.get('jumpTargetModes.showAllLineJumpTargets');

const selectWordCmd = <string>workbenchConfig.get('jumpCommands.selectWord');
const selectStringCmd = <string>workbenchConfig.get('jumpCommands.selectString');
const selectLineCmd = <string>workbenchConfig.get('jumpCommands.selectLine');
const selectBlockCmd = <string>workbenchConfig.get('jumpCommands.selectBlock');
const selectToCmd = <string>workbenchConfig.get('jumpCommands.selectTo');
const selectConnectedWords = <string>workbenchConfig.get('jumpCommands.selectConnectedWords');

export const lineJumpCmds = {
  showLineStarts: showLineStartsCmd,
  showCodeStarts: showCodeStartsCmd,
  showLineEnds: showLineEndsCmd,
  showAllLineJumpTargets: showAllLineJumpTargetsCmd,
};

export const executorCmds = {
  selectWord: selectWordCmd,
  selectString: selectStringCmd,
  selectLine: selectLineCmd,
  selectBlock: selectBlockCmd,
  selectTo: selectToCmd,
  selectConnectedWords: selectConnectedWords,
};

export const allCmds = [...Object.values(lineJumpCmds), ...Object.values(executorCmds)].filter(Boolean);

export enum MatchModes {
  lineStart,
  codeStart,
  lineEnd,
  findMatch,
}

type LineJumpCmd2LineMatchModesMap = {
  [lineJumpCmd: string]: (MatchModes.lineStart | MatchModes.lineEnd | MatchModes.codeStart)[];
};

export const lineJumpCmd2LineMatchModesMap: LineJumpCmd2LineMatchModesMap = {
  [lineJumpCmds.showLineStarts]: [MatchModes.lineStart],
  [lineJumpCmds.showLineEnds]: [MatchModes.lineEnd],
  [lineJumpCmds.showCodeStarts]: [MatchModes.codeStart],
  [lineJumpCmds.showAllLineJumpTargets]: [MatchModes.codeStart, MatchModes.lineEnd],
};
