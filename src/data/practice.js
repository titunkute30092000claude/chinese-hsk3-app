import { VOCAB } from "./vocab";

export const WORDS_PER_UNIT = 20;
export const TOTAL_UNITS = Math.ceil(VOCAB.length / WORDS_PER_UNIT);
export const QUESTIONS_PER_PRACTICE = 20;
export const PASSING_SCORE = Math.ceil(QUESTIONS_PER_PRACTICE * 0.6); // 12/20

// Words newly introduced in this unit only
export function getUnitNewWords(unit) {
  const start = (unit - 1) * WORDS_PER_UNIT;
  return VOCAB.slice(start, start + WORDS_PER_UNIT);
}

// Cumulative words through this unit — unit 2 includes unit 1's words too,
// all the way up to the final unit which covers the entire list
export function getUnitCumulativeWords(unit) {
  return VOCAB.slice(0, Math.min(unit * WORDS_PER_UNIT, VOCAB.length));
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuiz(n = QUESTIONS_PER_PRACTICE, pool = VOCAB) {
  const source = pool.length >= n ? pool : VOCAB;
  const chosen = shuffle(source).slice(0, n);
  return chosen.map((word) => {
    const distractors = shuffle(VOCAB.filter((w) => w.hanzi !== word.hanzi))
      .slice(0, 3)
      .map((w) => w.meaning);
    return { ...word, options: shuffle([word.meaning, ...distractors]) };
  });
}
