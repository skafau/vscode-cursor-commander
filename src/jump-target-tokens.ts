const _charCodeA = 97;
const _charCodeZ = 122;
const _charCodeRange = _charCodeZ - _charCodeA + 1;
const _totalTokenCnt = 702; // Current algo of `getJumpTargetToken` can generate 702 unique tokens...

/**
 * Generates tokens a - z, then aa - az, then ba - bz until za - zz
 *
 * @returns The generated token or '' if no valid token is availalbe for the given `idx`
 */
export function getJumpTargetToken(idx: number): string {
  if (idx >= _totalTokenCnt) return '';

  const secondCharCode = _charCodeA + (idx % _charCodeRange);
  const secondChar = String.fromCharCode(secondCharCode);

  const firstCharIdx = Math.floor(idx / _charCodeRange);
  const firstCharCode = _charCodeA + ((firstCharIdx - 1) % _charCodeRange);
  const firstChar = firstCharIdx ? String.fromCharCode(firstCharCode) : '';

  return firstChar + secondChar;
}
