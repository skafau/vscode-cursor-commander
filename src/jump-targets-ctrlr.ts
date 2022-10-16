import { TextEditor, TextLine, TextDocument } from 'vscode';
import { MatchModes, allCmds } from './constants';
import { escapeRegExPattern } from './helper';
import { JumpTarget } from './jump-target';
import { getJumpTargetToken } from './jump-target-tokens';

export type JumpTargetMap = Map<string, JumpTarget>;

export class JumpTargetCtrlr {
  public visibleTargets: JumpTargetMap;
  private _nextTargetTokenIdx = 0;

  constructor(private _textEditor: TextEditor) {
    this.visibleTargets = new Map();
  }

  get document(): TextDocument {
    return this._textEditor.document;
  }

  addLineJumpTargets(matchModes: (MatchModes.lineStart | MatchModes.lineEnd | MatchModes.codeStart)[]): void {
    const { startLine, endLine } = this._getStartAndEndLine();
    for (let lineNo = startLine; lineNo < endLine; lineNo++) {
      const line = this._textEditor.document.lineAt(lineNo);
      matchModes.forEach(matchMode => this._addTarget(matchMode, line));
    }
  }

  addFindMatchTarget(searchTerm: string): void {
    const searchTermEscaped = escapeRegExPattern(searchTerm);
    const searchRegex = new RegExp(searchTermEscaped, 'gi');
    const { startLine, endLine } = this._getStartAndEndLine();
    for (let lineNo = startLine; lineNo <= endLine; lineNo++) {
      const line = this._textEditor.document.lineAt(lineNo);
      const matches = line.text.matchAll(searchRegex);
      for (const match of matches) {
        this._addTarget(MatchModes.findMatch, line, match.index);
      }
    }
  }

  /**
   * @param posInLine Not needed, for "line jump" match modes
   */
  private _addTarget(matchMode: MatchModes, line: TextLine, posInLine?: number): void {
    let jumpTargetToken = getJumpTargetToken(this._nextTargetTokenIdx++);
    if (!jumpTargetToken) return; // There are no more unique tokens available...

    // Ensure that the jump target != any configured jump cmd
    while (allCmds.includes(jumpTargetToken)) {
      jumpTargetToken = getJumpTargetToken(this._nextTargetTokenIdx++);
    }

    const target = new JumpTarget(jumpTargetToken, matchMode, line, posInLine);
    const visibleTargetValues = [...this.visibleTargets.values()];
    const targetAlreadyExists = visibleTargetValues.find(visibleTarget => visibleTarget.range.contains(target.range));

    if (!targetAlreadyExists) {
      this._textEditor.setDecorations(target.foreground, [target.range]);
      this.visibleTargets.set(jumpTargetToken, target);
    }
  }

  private _getStartAndEndLine(): { startLine: number; endLine: number } {
    const visibleRange = this._textEditor.visibleRanges[0];
    const startLine = visibleRange?.start.line || 0;
    const endLine = visibleRange?.end.line || 0;

    return { startLine, endLine };
  }

  disposeAll(): void {
    this.visibleTargets.forEach(target => target.dispose());
    this.visibleTargets = new Map();
    this._nextTargetTokenIdx = 0;
  }
}
