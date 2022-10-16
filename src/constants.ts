import * as vscode from 'vscode';

const workbenchConfig = vscode.workspace.getConfiguration('cursor-commander');

const showLineStartsCmd = <string>workbenchConfig.get('commands.showLineStarts');
const showCodeStartsCmd = <string>workbenchConfig.get('commands.showCodeStarts');
const showLineEndsCmd = <string>workbenchConfig.get('commands.showLineEnds');
const showAllLineJumpTargetsCmd = <string>workbenchConfig.get('commands.showAllLineJumpTargets');

const selectWordCmd = <string>workbenchConfig.get('commands.selectWord');
const selectStringCmd = <string>workbenchConfig.get('commands.selectString');
const selectLineCmd = <string>workbenchConfig.get('commands.selectLine');
const selectBlockCmd = <string>workbenchConfig.get('commands.selectBlock');

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
