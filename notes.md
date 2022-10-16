# ToDo

- Publish on marketplace
  To consider:
  - Add recommended workspace extensions (prettier, ...)
  - Public GitHub repo (under which user name?)
  - Better readme with preview image & gifs showing the possibilities
  - Review `package.json` (add missing properties, ...)
  - Extension icon (+ manifest?)

# Further ideas

- Somehow highlight "selected" targets in second step when jump tokens are already entered.
  E.g. use some border, some different background color etc.
- "Auto commit" in certain situations:
  - Execute jump without explicit "enter" by the user in the following situations:
    - Jump token entered in input is unambiguous ("a" vs "ab" etc.).
      Also jump token must not be the start of a jump cmd (e.g. `s` in `sl` etc.).
    - Exactly 1 valid executor cmd was found (no "multi select" etc.)
    - User stops typing ("xx ms debounce...")
      Not sure if this would feel good 🤷‍♂️
  - Auto apply input in "search input step" without explicit enter when user stops typing ("xx ms debounce...").
    Not sure if this would feel good 🤷‍♂️
- Start first jump target token (a, b, c, ...) from current cursor position/line and distribute them alternating before & after.
  Not sure if this would actually be better 🤷‍♂️
- Cmd to select from current cursor position until target. E.g. "select until" with `su` or `st`.
  Not compatible with "multi target".
- Extend "select block" cmd by allowing selection of not only the nearest bracket pair, but also the 2nd, 3rd, ... nearest.
  - E.g. using some command like "sb2", "sb3", ...
  - Same could be used for "select word/line/..." etc. to select multiple words/lines/... starting from the target
- Cmd to select the string/block/function in which the cursor is currently placed in
  E.g.:
  - Just enter cmd "stc" (select string current), "sfc" (select function current), "sbc" (select block current) etc. in search field.
    -> Perform the action right away on enter
    -> No additional search term needed
    -> No additional "jump target selection" needed
  - Not sure if actually that helpful. Actually only see the use case with functions but "select function" was removed... 🤷‍♂️
- Add "select block" functionality for "XML like" syntax
- Add "select contiguous words/word block/..." jump cmd (wording to be defined...).
  E.g.:
  - `(switch(this._inputBox.getStep())...)` jumping to `input` -> select `this._inputBox.getStep`
  - `jump with 'modifier+enter'` jumping to `modifier` -> select `modifier+enter`
  - `const blah = foo.bar.more;` -> Select `foo.bar.more`
    Possible "boundary chars":
  - All brackets
  - <>
  - All quotes ('"`)
  - Anything else?
- "Custom input webview" which could allow the following:
  - Show info about recognized jump cmds
  - Show info about available jump cmds (maybe only when user enters `?` or something the like?)
  - Allow finishing the jump with `modifier+enter` (`alt+enter`, `shift+enter`, ...) which could be an addition to the jump cmds
  - ...
