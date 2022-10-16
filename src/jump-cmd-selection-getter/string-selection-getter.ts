import { Selection, TextDocument } from 'vscode';
import { JumpTarget } from '../jump-target';
import { findSurroundingCharPair, SurroundingCharMatchers } from './helper/find-surrounding-char-pair.helper';

/**
 * Very naive implementation:
 *   * Does not handle any kind of special/edge cases at all.
 *   * Won't correctly handle stuff like escaped string start characters inside string like `'it\'s time to' or other
 *     "string start char" inside strings at all for that matter (e.g. `"it's time to"`).
 *   * Does not check if given jump target position is actually inside a string but simply searches for the nearest
 *     "matchingChars"
 *   * ...
 */
export async function getStringJumpSelection(jumpTargets: JumpTarget[], doc: TextDocument): Promise<Selection[]> {
  const stringMatchingChars: SurroundingCharMatchers = {
    "'": "'", // String within '...'
    '"': '"', // String within "..."
    '`': '`', // String within `...`
  };
  const selections = jumpTargets
    .map(x => findSurroundingCharPair(stringMatchingChars, x, doc, false))
    .filter(Boolean) as Selection[];
  return selections;
}
