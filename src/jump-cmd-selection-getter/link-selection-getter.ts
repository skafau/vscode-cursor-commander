import { Range, Selection, TextDocument } from 'vscode';
import { JumpTarget } from '../jump-target';

export async function getLineJumpSelection(jumpTargets: JumpTarget[], doc: TextDocument): Promise<Selection[]> {
  const selections = jumpTargets.map(x => {
    const line = x.range.start.line;
    const lineText = doc.lineAt(line).text;
    const codeStart = Math.max(0, lineText.search(/\S/));
    const range = new Range(line, codeStart, line, lineText.length);
    return new Selection(range.start, range.end);
  });
  return selections;
}
