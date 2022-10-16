import { InputBox as VSInputBox, window } from 'vscode';

export enum Steps {
  searchInput = 1,
  executorInput = 2,
}

const _stepPlaceholders = {
  [Steps.searchInput]: 'Enter search term(s) & commands',
  [Steps.executorInput]: 'Enter jump target token(s) & commands',
};

export class InputBox {
  private _inputBox: VSInputBox;
  private _valueChangedHandlers: ((newText: string) => void)[];
  private _acceptHandlers: ((inputText: string) => void)[];
  private _abortHandlers: (() => void)[];

  constructor(step: Steps, initialText = '') {
    this._inputBox = window.createInputBox();
    this.setStep(step, step === Steps.searchInput ? initialText : '');
    this._inputBox.totalSteps = 2;
    this._inputBox.show();
    this._inputBox.onDidChangeValue(this._fireValueChanged.bind(this));
    this._inputBox.onDidHide(this._fireAbort.bind(this));
    this._inputBox.onDidAccept(this._fireAccept.bind(this));

    this._valueChangedHandlers = [];
    this._acceptHandlers = [];
    this._abortHandlers = [];

    // Process "initial cmd/text" in next execution ctxt so that calling code has already registered events and can act
    // accordingly on them
    if (initialText) {
      setTimeout(this._fireValueChanged.bind(this, initialText), 0);
    }
  }

  public hide(): void {
    this._inputBox.hide();
  }

  public setStep(step: Steps, value: string): void {
    this._inputBox.step = step;
    this._inputBox.placeholder = _stepPlaceholders[step];
    this._inputBox.value = value;
  }

  public getStep(): Steps {
    return <Steps>this._inputBox.step;
  }

  private _fireValueChanged = (newText: string): void =>
    this._valueChangedHandlers.forEach(handler => handler(newText));
  public onValueChanged = (handler: (newText: string) => void): number => this._valueChangedHandlers.push(handler);

  private _fireAbort = (): void => this._abortHandlers.forEach(handler => handler());
  public onAbort = (handler: () => void): number => this._abortHandlers.push(handler);

  private _fireAccept = (): void => this._acceptHandlers.forEach(handler => handler(this._inputBox.value));
  public onAccept = (handler: (inputText: string) => void): number => this._acceptHandlers.push(handler);
}
