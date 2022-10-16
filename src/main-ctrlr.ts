import { JumpExecutor } from './jump-executor';
import { TextEditor } from 'vscode';
import { InputBox, Steps } from './input-box';
import { InputProcessor } from './input-processor';
import { JumpTargetCtrlr } from './jump-targets-ctrlr';

export class MainCtrlr {
  private _jumpTargetCtrlr: JumpTargetCtrlr;
  private _jumpExecutor: JumpExecutor;
  private _inputProcessor: InputProcessor;
  private _inputBox: InputBox;

  constructor(textEditor: TextEditor, step: Steps, initialText?: string) {
    this._jumpTargetCtrlr = new JumpTargetCtrlr(textEditor);
    this._jumpExecutor = new JumpExecutor(textEditor);
    this._inputProcessor = new InputProcessor(this._jumpTargetCtrlr, this._jumpExecutor);

    this._inputBox = new InputBox(step, initialText);
    this._inputBox.onValueChanged(this._onInputBoxValueChanged.bind(this));
    this._inputBox.onAccept(this._onInputBoxAccept.bind(this));
    this._inputBox.onAbort(this._onInputBoxAbort.bind(this));

    if (step === Steps.executorInput) {
      // Process "forced search input" right away & go to executor step
      this._onInputBoxValueChanged(initialText || '', Steps.searchInput);
      this._onInputBoxAccept(initialText || '', Steps.searchInput);
    }
  }

  private async _onInputBoxValueChanged(newText: string, forcedStep?: Steps): Promise<void> {
    const step = forcedStep ?? this._inputBox.getStep();
    switch (step) {
      case Steps.searchInput:
        this._inputProcessor.processSearchInput(newText);
        break;

      case Steps.executorInput:
        await this._inputProcessor.processExecutorInput(newText, false);
        break;
    }
  }

  private async _onInputBoxAccept(inputText: string, forcedStep?: Steps): Promise<void> {
    const step = forcedStep ?? this._inputBox.getStep();
    switch (step) {
      case Steps.searchInput:
        this._initExecutorStep();
        break;

      case Steps.executorInput:
        await this._inputProcessor.processExecutorInput(inputText, true);
        this._inputBox.hide();
        break;
    }
  }

  private _onInputBoxAbort(): void {
    this._jumpTargetCtrlr.disposeAll();
  }

  private _initExecutorStep(): void {
    const prevParsedSearchInput = this._inputProcessor.getPrevParsedInput();
    const executorCmds = (prevParsedSearchInput.executorCmds.join(' ') + ' ').trimStart();
    this._inputBox.setStep(Steps.executorInput, executorCmds);
  }
}
