import { Selection, TextDocument } from 'vscode';
import { JumpTarget } from '../jump-target';
import { findNextChar } from './helper/find-surrounding-char-pair.helper';

/**
 * Find start & end separator and return selection in between
 */
function _getSelection(separators: string[], target: JumpTarget, doc: TextDocument): Selection | undefined {
  const text = doc.getText();
  const targetIdx = doc.offsetAt(target.range.start);
  const chars = separators.join('');

  const startMatch = findNextChar(text, targetIdx, true, chars);
  if (!startMatch) return undefined;

  const endMatchIdx = findNextChar(text, targetIdx, false, chars)?.idx;
  if (!endMatchIdx || endMatchIdx < 0 || endMatchIdx < targetIdx) return undefined;

  const startPos = doc.positionAt(startMatch.idx);
  const endPos = doc.positionAt(endMatchIdx);
  return new Selection(startPos, endPos);
}

export async function getSelectedConnectedWordsSelection(
  jumpTargets: JumpTarget[],
  doc: TextDocument
): Promise<Selection[]> {
  const separators = ['(', ')', '[', ']', '{', '}', '<', '>', "'", '"', '`', ' ', '\r', '\n'];
  const selections = jumpTargets.map(x => _getSelection(separators, x, doc)).filter(Boolean) as Selection[];
  return selections;
}
