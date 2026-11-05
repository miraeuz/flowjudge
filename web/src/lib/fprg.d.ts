export interface JudgeTest { in?: string; out: string | string[]; hidden?: boolean }
export interface JudgeCase { n: number; verdict: 'AC' | 'WA' | 'RE' | 'TLE' | 'CE'; message: string; input?: string; expected?: string; got?: string }
export interface JudgeResult { verdict: 'AC' | 'WA' | 'RE' | 'TLE' | 'CE'; message?: string; passed: number; total: number; results: JudgeCase[] }
export function judge(xml: string, tests: JudgeTest[], opts?: { mode?: string; eps?: number; maxSteps?: number }): JudgeResult;
export function run(xml: string, input?: string, opts?: { maxSteps?: number }): string;
