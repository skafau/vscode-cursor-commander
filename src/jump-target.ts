import { Range, TextEditorDecorationType, TextLine, window } from 'vscode';
import { MatchModes } from './constants';

interface JumpTargetProps {
  foreground: TextEditorDecorationType;
  range: Range;
}

export class JumpTarget {
  token: string;
  foreground: TextEditorDecorationType;
  range: Range;

  /**
   * @param posInLine Not needed for "line jump" match modes
   */
  constructor(jumpTargetToken: string, matchMode: MatchModes, line: TextLine, posInLine?: number) {
    const props =
      matchMode === MatchModes.findMatch
        ? this._createFindMatchJumpTargetProps(jumpTargetToken, line, posInLine || 0)
        : this._createLineJumpTargetProps(jumpTargetToken, matchMode, line);

    this.token = jumpTargetToken;
    this.foreground = props.foreground;
    this.range = props.range;
  }

  dispose(): void {
    this.foreground.dispose();
  }

  setHighlighted(highlighted: boolean): void {
    this.foreground.dispose();
    const newFg = this._createForegroundDecorationType(this.token, highlighted);
    this.foreground = newFg;
  }

  private _createLineJumpTargetProps(
    jumpTargetToken: string,
    matchMode: MatchModes.lineStart | MatchModes.lineEnd | MatchModes.codeStart,
    line: TextLine
  ): JumpTargetProps {
    const lineNo = line.lineNumber;
    const lineText = line.text;
    const lineEndPos = Math.max(0, lineText.length);
    const codeStartPos = Math.max(0, lineText.search(/\S/));
    const posInLine =
      MatchModes.lineStart === matchMode // force break
        ? 0
        : MatchModes.lineEnd === matchMode
        ? lineEndPos
        : codeStartPos;
    const foreground = this._createForegroundDecorationType(jumpTargetToken, false);
    const range = new Range(lineNo, posInLine, lineNo, posInLine);

    return { foreground, range };
  }

  private _createFindMatchJumpTargetProps(jumpTargetToken: string, line: TextLine, posInLine: number): JumpTargetProps {
    const lineNo = line.lineNumber;
    const foreground = this._createForegroundDecorationType(jumpTargetToken, false);
    const range = new Range(lineNo, posInLine, lineNo, posInLine);

    return { foreground, range };
  }

  private _createForegroundDecorationType(jumpTargetToken: string, highlighted: boolean): TextEditorDecorationType {
    const colorVar = highlighted ? 'jumpTargetForegroundSelected' : 'jumpTargetForeground';
    const bgVar = highlighted ? 'jumpTargetBackgroundSelected' : 'jumpTargetBackground';
    const borderVar = highlighted ? 'jumpTargetBorderSelected' : 'jumpTargetBorder';
    const addCss: string[] = [
      'position: absolute',
      `color: var(--vscode-cursorCommander-${colorVar})`,
      `background-color: var(--vscode-cursorCommander-${bgVar})`,
      `border: 1px solid var(--vscode-cursorCommander-${borderVar})`,
      'border-radius: 0px',
      'padding: 0 2px',
    ].filter(Boolean);

    const foreground = window.createTextEditorDecorationType({
      after: {
        contentText: jumpTargetToken,
        width: 'auto',
        fontWeight: '400',
        textDecoration: ';' + addCss.join(';'),
      },
    });

    return foreground;
  }
}
