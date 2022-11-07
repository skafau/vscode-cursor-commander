import { Selection, TextDocument } from 'vscode';
import { executorCmds } from '../constants';
import { JumpTarget } from '../jump-target';
import { getBlockJumpSelection } from './block-selection-getter';
import { getSelectedConnectedWordsSelection } from './connected-word-selection-getter';
import { getLineJumpSelection } from './link-selection-getter';
import { getSelectToSelection } from './select-to-getter';
import { getStringJumpSelection } from './string-selection-getter';
import { getWordJumpSelection } from './word-selection-getter';

export type JumpSelectionGetter = (jumpTargets: JumpTarget[], doc: TextDocument) => Promise<Selection[]>;

const _jumpCmdSelectionGetters: Record<string, JumpSelectionGetter> = {
  [executorCmds.selectString]: getStringJumpSelection,
  [executorCmds.selectWord]: getWordJumpSelection,
  [executorCmds.selectBlock]: getBlockJumpSelection,
  [executorCmds.selectLine]: getLineJumpSelection,
  [executorCmds.selectTo]: getSelectToSelection,
  [executorCmds.selectConnectedWords]: getSelectedConnectedWordsSelection,
};

/**
 * Looks for the first given cmd which has an associated getter and executes it
 */
export async function getJumpCmdSelection(
  cmds: string[],
  jumpTargets: JumpTarget[],
  doc: TextDocument
): Promise<Selection[]> {
  const cmd = cmds.find(x => !!_jumpCmdSelectionGetters[x]);
  const getter = (cmd && _jumpCmdSelectionGetters[cmd]) || undefined;
  const selections = (await getter?.(jumpTargets, doc)) || [];
  return selections;
}
