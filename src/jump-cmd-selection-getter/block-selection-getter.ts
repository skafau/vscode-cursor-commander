import { Selection, TextDocument } from 'vscode';
import { JumpTarget } from '../jump-target';
import { findSurroundingCharPair, SurroundingCharMatchers } from './helper/find-surrounding-char-pair.helper';

/**
 * Very naive implementation:
 *   * Does not handle any kind of special/edge cases at all.
 *   * Won't correctly handle stuff like brackets within string literals etc.
 *   * Does not check if given jump target position is actually inside a block but simply searches for the nearest
 *     "matchingChars"
 *   * ...
 */
export async function getBlockJumpSelection(jumpTargets: JumpTarget[], doc: TextDocument): Promise<Selection[]> {
  const blockMatchingChars: SurroundingCharMatchers = {
    '(': ')',
    '[': ']',
    '{': '}',
  };
  const selections = jumpTargets
    .map(x => findSurroundingCharPair(blockMatchingChars, x, doc, true))
    .filter(Boolean) as Selection[];
  return selections;
}
