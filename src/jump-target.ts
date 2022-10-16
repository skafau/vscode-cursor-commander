import { Range, TextEditorDecorationType, TextLine, window } from 'vscode';
import { MatchModes } from './constants';

interface JumpTargetProps {
  foreground: TextEditorDecorationType;
  range: Range;
}

export class JumpTarget {
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

    this.foreground = props.foreground;
    this.range = props.range;
  }

  dispose(): void {
    this.foreground.dispose();
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
    const foreground = this._createForegroundDecorationType(jumpTargetToken);
    const range = new Range(lineNo, posInLine, lineNo, posInLine);

    return { foreground, range };
  }

  private _createFindMatchJumpTargetProps(jumpTargetToken: string, line: TextLine, posInLine: number): JumpTargetProps {
    const lineNo = line.lineNumber;
    const foreground = this._createForegroundDecorationType(jumpTargetToken);
    const range = new Range(lineNo, posInLine, lineNo, posInLine);

    return { foreground, range };
  }

  private _createForegroundDecorationType(jumpTargetToken: string): TextEditorDecorationType {
    const addCss: string[] = [
      'position: absolute',
      'color: var(--vscode-cursorCommander-jumpTargetForeground)',
      'background-color: var(--vscode-cursorCommander-jumpTargetBackground)',
      'border: 1px solid var(--vscode-cursorCommander-jumpTargetBorder)',
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
