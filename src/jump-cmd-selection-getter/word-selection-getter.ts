import { Range, Selection, TextDocument } from 'vscode';
import { JumpTarget } from '../jump-target';

export async function getWordJumpSelection(jumpTargets: JumpTarget[], doc: TextDocument): Promise<Selection[]> {
  const rangeStarts = jumpTargets.map(x => x.range.start);
  const wordRanges = rangeStarts.map(x => doc.getWordRangeAtPosition(x)).filter(Boolean) as Range[];
  const selections = wordRanges.map(x => new Selection(x.start, x.end));
  return selections;
}
