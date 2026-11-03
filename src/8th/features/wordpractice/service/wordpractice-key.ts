export const wordpracticeKeys = {
  root: () => ['wordpractice'] as const,
  summary: () => ['wordpractice', 'summary'] as const,
  wordList: () => ['wordpractice', 'wordList'] as const,
  wordListWithParams: (params: Record<string, unknown>) =>
    ['wordpractice', 'wordList', params] as const,
}
