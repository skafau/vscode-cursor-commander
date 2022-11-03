import { Selection, TextDocument, window } from 'vscode';
import { JumpTarget } from '../jump-target';

export async function getSelectToSelection(jumpTargets: JumpTarget[], _doc: TextDocument): Promise<Selection[]> {
  const startPos = window.activeTextEditor?.selection.start;
  const targetPos = jumpTargets[0]?.range.start; // No "multi target" jump here
  const selections = startPos && targetPos ? [new Selection(startPos, targetPos)] : [];
  return selections;
}
