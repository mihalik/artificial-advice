export interface MacroAnswer {
  value: string;
  percent: number; // macro-averaged, rounded to 1 decimal
}

export interface QuestionStats {
  consensus: MacroAnswer;       // top answer by macro-avg
  macroAnswers: MacroAnswer[];  // all answers sorted by macro-avg %
  agreeing: number;             // models whose #1 answer == consensus
  total: number;                // total models
}

export function computeStats(results: Array<{
  answers: Array<{ value: string; percent: number }>;
}>): QuestionStats | null {
  if (!results.length) return null;

  // Collect all unique answer values
  const allValues = new Set<string>();
  for (const r of results) {
    for (const a of r.answers) allValues.add(a.value);
  }

  // Macro-average: for each value, average its % across all models (0 if absent)
  const macroMap = new Map<string, number>();
  for (const val of allValues) {
    const avg =
      results.reduce((sum, r) => {
        const a = r.answers.find((a) => a.value === val);
        return sum + (a?.percent ?? 0);
      }, 0) / results.length;
    macroMap.set(val, Math.round(avg * 10) / 10);
  }

  const macroAnswers = [...macroMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, percent]) => ({ value, percent }));

  const consensus = macroAnswers[0];

  const agreeing = results.filter(
    (r) => r.answers[0]?.value === consensus.value
  ).length;

  return { consensus, macroAnswers, agreeing, total: results.length };
}
