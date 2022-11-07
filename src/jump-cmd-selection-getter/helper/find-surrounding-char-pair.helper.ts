import { Selection, TextDocument } from 'vscode';
import { escapeRegExPattern, getObjectKeyByValue } from '../../helper';
import { JumpTarget } from '../../jump-target';

/**
 * Key value pairs, where the key represents the "opening char" and the value the "closing char".
 * E.g. { '{': '}' } to represent a matcher for everything within `{` & `}`.
 */
export type SurroundingCharMatchers = {
  [openingChar: string]: string;
};

export type CharSearchResult = {
  /** The index of the found char within the searched text */
  idx: number;
  /** The found char (can be one of the given `openingChars`) */
  char: string;
};

/**
 * Searches within a given text for the matching (balanced) start or closing char of a block.
 * E.g. search for the matching `}` to a open `{` etc.
 *
 * @param text           The whole text to search within
 * @param searchStartIdx Index from where to start the search for the char
 * @param charMatchers   The chars we're looking for (opening and closing brackets etc.)
 * @param searchStart    True to search "up" (backwards in given text), i.e. for the opening char
 *                       False to search "down", i.e. for the closing char
 *
 * @returns Undefined if nothing found at all
 */
function _findSurroundingCharPairBalancedIdx(
  text: string,
  searchStartIdx: number,
  charMatchers: SurroundingCharMatchers,
  searchStart: boolean
): CharSearchResult | undefined {
  const openingChars = Object.keys(charMatchers);
  const closingChars = Object.values(charMatchers);
  const searchText = searchStart ? text.slice(0, searchStartIdx) : text.slice(searchStartIdx);
  const searchTerm = `${openingChars.join('')}${closingChars.join('')}`;
  const searchTermEscaped = escapeRegExPattern(searchTerm);
  const regExp = new RegExp(`[${searchTermEscaped}]`, 'g');
  const resArr = [...searchText.matchAll(regExp)];

  if (searchStart) {
    resArr.reverse();
  }

  const openCnts: { [openingChar: string]: number } = {};
  const charMatch = resArr.find(regExMatch => {
    const matchChar = regExMatch[0];
    const openingChar = openingChars.find(char => char === matchChar) || getObjectKeyByValue(charMatchers, matchChar);
    const closingChar = charMatchers[openingChar];
    const isSearchChar = matchChar === (searchStart ? openingChar : closingChar);
    const curCnt = openCnts[openingChar] || 1;
    openCnts[openingChar] = curCnt + (isSearchChar ? -1 : 1);
    const newCnt = openCnts[openingChar];
    return newCnt <= 0;
  });

  if (!charMatch || undefined === charMatch.index) return undefined;

  return {
    idx: charMatch.index + (searchStart ? 1 : searchStartIdx),
    char: charMatch[0],
  };
}

/**
 * Searches within a given text for the first char of a given set which appears before or after a given index.
 * E.g. search for the first ', ", }, < etc. before or after the given index.
 *
 * @param text             The whole text to search within
 * @param targetIdx        The index after (or before) which the char is to be found
 * @param findBeforeTarget True = Search before the target index
 *                         False = Search after the target index
 * @param chars            The chars to search for
 *
 * @returns Undefined if opening char has not been found at all
 */
export function findNextChar(
  text: string,
  targetIdx: number,
  findBeforeTarget: boolean,
  chars: string
): CharSearchResult | undefined {
  // The "find before" regex copied from https://stackoverflow.com/a/26530130/1273551. I did not really question the
  // regex details, nor did I "stress test" it anyhow but seems to be doing its job so far 🤷‍♂️
  const searchText = findBeforeTarget ? text.slice(0, targetIdx) : text.slice(targetIdx);
  const charsEscaped = escapeRegExPattern(chars);
  const regExpPattern = findBeforeTarget ? `([^${charsEscaped}]*$)` : `^[^${charsEscaped}]*`;
  const regExp = new RegExp(regExpPattern, 'g');
  const result = regExp.exec(searchText);

  if (!result || result.index < 0) return undefined;

  const textToMatch = result[0];
  const idx = findBeforeTarget ? result.index : targetIdx + textToMatch.length;
  const matchingChar = findBeforeTarget ? searchText.slice(idx - 1, idx) : text.slice(idx, idx + 1);

  return {
    idx,
    char: matchingChar,
  };
}

/**
 * Find character pair surrounding the given jump target and return a selection from it.
 * E.g. find surrounding `{}`, `[]`, `''`, `""` pairs etc.
 */
export function findSurroundingCharPair(
  charMatchers: SurroundingCharMatchers,
  target: JumpTarget,
  doc: TextDocument,
  needsBalancedMatch: boolean
): Selection | undefined {
  const text = doc.getText();
  const targetIdx = doc.offsetAt(target.range.start);
  const openingChars = Object.keys(charMatchers).join('');

  const matchStart = needsBalancedMatch
    ? _findSurroundingCharPairBalancedIdx(text, targetIdx, charMatchers, true)
    : findNextChar(text, targetIdx, true, openingChars);

  if (!matchStart) return undefined;

  const matchEndChar = charMatchers[matchStart.char];
  const endMatcher: SurroundingCharMatchers = { [matchStart.char]: matchEndChar };
  const matchEndIdx = needsBalancedMatch
    ? _findSurroundingCharPairBalancedIdx(text, matchStart.idx, endMatcher, false)?.idx
    : findNextChar(text, targetIdx, false, matchEndChar)?.idx;

  if (!matchEndIdx || matchEndIdx < 0 || matchEndIdx < targetIdx) return undefined;

  const startPos = doc.positionAt(matchStart.idx);
  const endPos = doc.positionAt(matchEndIdx);
  return new Selection(startPos, endPos);
}
