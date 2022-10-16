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
 * Searches within a given text for the first "closing char" which appears after a given index.
 * E.g. search for the first ', ", } etc. after the given index.
 *
 * @param text      The whole text to search within
 * @param targetIdx The index after which the closing char is to be found
 * @param endChar   The closing char which is to be found
 *
 * @returns Index of the found char. -1 if nothing found at all.
 */
function _findSurroundingCharPairEndIdx(text: string, targetIdx: number, endChar: string): number {
  const textAfterTarget = text.slice(targetIdx);
  const regExpAfterTarget = new RegExp(`^[^${endChar}]*`, 'g');
  const resAfterTarget = regExpAfterTarget.exec(textAfterTarget);

  if (!resAfterTarget || resAfterTarget.index < 0) return -1;

  const foundStrEndText = resAfterTarget[0];
  const foundStrEndIdx = targetIdx + foundStrEndText.length;
  return foundStrEndIdx;
}

/**
 * Search within a given text fo rthe first "opening char" which appears before a given index.
 * E.g. search for the first ', ", } etc. before the given index.
 *
 * @param text         The whole text to search within
 * @param targetIdx    The index before which the opening char is to be found
 * @param openingChars All allowed opening characters
 *
 * @returns Undefined if opening char has not been found at all
 */
function _findSurroundingCharPairStartIdx(
  text: string,
  targetIdx: number,
  openingChars: string
): CharSearchResult | undefined {
  // Regex copied from https://stackoverflow.com/a/26530130/1273551. I did not really question the regex details, nor
  // did I "stress tested" it anyhow but seems to be doing its job so far 🤷‍♂️
  const textBeforeTarget = text.slice(0, targetIdx);
  const regExpBeforeTarget = new RegExp(`([^${openingChars}]*$)`, 'g');
  const resBeforeTarget = regExpBeforeTarget.exec(textBeforeTarget);

  if (!resBeforeTarget || resBeforeTarget.index < 0) return undefined;

  const matchStartIdx = resBeforeTarget.index;
  const matchStartChar = textBeforeTarget.slice(matchStartIdx - 1, resBeforeTarget.index);

  return {
    idx: matchStartIdx,
    char: matchStartChar,
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
    : _findSurroundingCharPairStartIdx(text, targetIdx, openingChars);

  if (!matchStart) return undefined;

  const matchEndChar = charMatchers[matchStart.char];
  const endMatcher: SurroundingCharMatchers = { [matchStart.char]: matchEndChar };
  const matchEndIdx = needsBalancedMatch
    ? _findSurroundingCharPairBalancedIdx(text, matchStart.idx, endMatcher, false)?.idx
    : _findSurroundingCharPairEndIdx(text, targetIdx, matchEndChar);

  if (!matchEndIdx || matchEndIdx < 0 || matchEndIdx < targetIdx) return undefined;

  const startPos = doc.positionAt(matchStart.idx);
  const endPos = doc.positionAt(matchEndIdx);
  return new Selection(startPos, endPos);
}
