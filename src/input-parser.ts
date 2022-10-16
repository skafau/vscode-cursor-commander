import { lineJumpCmds as knownLineJumpCmds, executorCmds as knownExecutorCmds, allCmds } from './constants';
import { JumpTargetMap } from './jump-targets-ctrlr';

export interface ParsedSearchInput {
  lineJumpCmds: string[];
  searchTerms: string[];
  executorCmds: string[];
}

export interface ParsedExecutorInput {
  executorCmds: string[];
  jumpTargets: JumpTargetMap;
}

const _lineJumpCmdValues = Object.values(knownLineJumpCmds).filter(Boolean);
const _executorCmdValues = Object.values(knownExecutorCmds).filter(Boolean);

export function parseSearchInput(input: string): ParsedSearchInput {
  const inputTokens = input.split(' ');
  const searchTerms = inputTokens.filter(token => token && !allCmds.includes(token));
  const lineJumpCmds = inputTokens.filter(token => _lineJumpCmdValues.includes(token));
  const executorCmds = inputTokens.filter(token => _executorCmdValues.includes(token));
  return { lineJumpCmds, searchTerms, executorCmds };
}

export function parseExecutorInput(input: string, visibleJumpTargets: JumpTargetMap): ParsedExecutorInput {
  const inputTokens = input.split(' ');
  const executorCmds = inputTokens.filter(token => _executorCmdValues.includes(token));
  const jumpTargets = new Map([...visibleJumpTargets].filter(([k]) => inputTokens.includes(k)));
  return { executorCmds, jumpTargets };
}
