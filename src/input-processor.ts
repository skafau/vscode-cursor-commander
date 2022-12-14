import { JumpExecutor } from './jump-executor';
import { JumpTargetCtrlr } from './jump-targets-ctrlr';
import { lineJumpCmd2LineMatchModesMap, lineJumpCmds } from './constants';
import { parseSearchInput, ParsedSearchInput, parseExecutorInput } from './input-parser';

const _lineJumpCmdValues = Object.values(lineJumpCmds).filter(Boolean);

export class InputProcessor {
  private _prevParsedInputStr = '';

  constructor(private _jumpTargetCtrlr: JumpTargetCtrlr, private _jumpExecutor: JumpExecutor) {}

  getPrevParsedInput(): ParsedSearchInput {
    return JSON.parse(this._prevParsedInputStr);
  }

  processSearchInput(input: string): void {
    const parsedInput = parseSearchInput(input);
    const parsedInputStr = JSON.stringify(parsedInput);

    if (this._prevParsedInputStr !== parsedInputStr) {
      this._prevParsedInputStr = parsedInputStr;

      this._jumpTargetCtrlr.disposeAll();

      // Show jump targets for all "line jump" cmds
      const validJumpCmds = parsedInput.lineJumpCmds.filter(jumpCmd => _lineJumpCmdValues.includes(jumpCmd));
      const lineMatchModesForCmds = validJumpCmds
        .map(jumpCmd => lineJumpCmd2LineMatchModesMap[jumpCmd])
        .filter(Boolean);
      lineMatchModesForCmds.forEach(modes => this._jumpTargetCtrlr.addLineJumpTargets(modes));

      // Show jump targets for all search terms
      parsedInput.searchTerms.forEach(searchTerm => this._jumpTargetCtrlr.addFindMatchTarget(searchTerm));
    }
  }

  async processExecutorInput(input: string, execute: boolean): Promise<void> {
    const visibleTargets = this._jumpTargetCtrlr.visibleTargets;
    const parsedInput = parseExecutorInput(input, visibleTargets);
    const highlightedTokens = [...visibleTargets].filter(([_k, v]) => v.highlighted).map(([k]) => k);
    const inputJumpTargetTokens = [...parsedInput.jumpTargets.keys()];
    const tokensToUnhighlight = highlightedTokens.filter(x => !inputJumpTargetTokens.includes(x));
    const tokensToHighlight = inputJumpTargetTokens.filter(x => !highlightedTokens.includes(x));

    tokensToUnhighlight.forEach(x => this._jumpTargetCtrlr.setTargetHighlight(x, false));
    tokensToHighlight.forEach(x => this._jumpTargetCtrlr.setTargetHighlight(x, true));

    if (execute) {
      await this._jumpExecutor.executeJump(parsedInput, this._jumpTargetCtrlr.document);
    }
  }
}
