/**
 * Uses raw diffs as a patch mechanism
 */

import DiffMatchPatch, { Diff } from "diff-match-patch";

type DiffModifyOpCode = 1 | 3;
type DiffModify = [DiffModifyOpCode, string];
export type DiffOp = number | DiffModify;

const RAW_OPCODE_KEEP = 0;

const OPCODE_INSERT: DiffModifyOpCode = 3;
const OPCODE_DELETE: DiffModifyOpCode = 1;

const dmp = new DiffMatchPatch();

function cut(str: string, start: number, end: number) {
  return str.substring(0, start) + str.substring(end);
}

function inject(str: string, loc: number, substr: string) {
  return str.substring(0, loc) + substr + str.substring(loc);
}

function optimizeDiff(diff: Diff[]): DiffOp[] {
  return diff.map(([opCode, text]) =>
    opCode === RAW_OPCODE_KEEP
      ? text.length
      : [(opCode + 2) as DiffModifyOpCode, text],
  );
}

function generateDmpDiff(text1: string, text2: string) {
  console.log(text1, text2);

  console.log(dmp.diff_main(text1, text2, undefined, 0.25));
  return dmp.diff_main(text1, text2, undefined, 0.25);
}

export function generateDiff(text1: string, text2: string) {
  return optimizeDiff(generateDmpDiff(text1, text2));
}

export function applyDiff(text1: string, diff: DiffOp[]) {
  let cursor = 0;
  let finalText = text1;

  for (const diffOp of diff) {
    if (typeof diffOp === "number") {
      cursor += diffOp;
    } else {
      const [opCode, text] = diffOp;

      if (OPCODE_DELETE === opCode) {
        finalText = cut(finalText, cursor, cursor + text.length);
      } else if (OPCODE_INSERT === opCode) {
        finalText = inject(finalText, cursor, text);
      }
    }
  }

  return finalText;
}

function invertDiff(diff: DiffOp[]): DiffOp[] {
  const invertedDiff: DiffOp[] = diff.map((diffOp) => {
    if (typeof diffOp !== "number") {
      const invertedDiffOpCode =
        OPCODE_DELETE === diffOp[0] ? OPCODE_INSERT : OPCODE_DELETE;

      return [invertedDiffOpCode, diffOp[1]];
    }

    return diffOp;
  });

  for (let i = 1; i < invertedDiff.length; i++) {
    const diffOp = invertedDiff[i];
    const prevDiffOp = invertedDiff[i - 1];

    if (
      typeof diffOp !== "number" &&
      typeof prevDiffOp !== "number" &&
      diffOp[0] === OPCODE_DELETE &&
      prevDiffOp[0] === OPCODE_INSERT
    ) {
      invertedDiff[i] = prevDiffOp;
      invertedDiff[i - 1] = diffOp;
    }
  }

  return invertedDiff;
}

export function applyInvertedDiff(text2: string, diff: DiffOp[]) {
  return applyDiff(text2, invertDiff(diff));
}
