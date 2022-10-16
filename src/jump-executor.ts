import { ParsedExecutorInput } from './input-parser';
import { Selection, TextEditor, TextDocument } from 'vscode';
import { JumpTarget } from './jump-target';
import { getJumpCmdSelection } from './jump-cmd-selection-getter';

export class JumpExecutor {
  constructor(private _textEditor: TextEditor) {}

  private _getSimpleJumpSelections(jumpTargets: JumpTarget[]): Selection[] {
    const rangeStarts = jumpTargets.map(x => x.range.start);
    const selections = rangeStarts.map(x => new Selection(x, x));
    return selections;
  }

  async executeJump(parsedInput: ParsedExecutorInput, doc: TextDocument): Promise<void> {
    const jumpTargets = [...parsedInput.jumpTargets.values()];

    // Always fall back to "just" jump to the target e.g. if a given cmd did not yield any result. E.g. target not
    // inside a function etc.
    let selections = await getJumpCmdSelection(parsedInput.executorCmds, jumpTargets, doc);
    if (!selections.length) {
      selections = this._getSimpleJumpSelections(jumpTargets);
    }

    this._textEditor.selections = selections;
  }
}
