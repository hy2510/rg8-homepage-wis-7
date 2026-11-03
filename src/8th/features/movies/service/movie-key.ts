export const movieKeys = {
  root: () => ['movie'] as const,
  categories: () => ['movie', 'categories'] as const,
  list: () => ['movie', 'list'] as const,
  listWithParam: (params?: Record<string, unknown>) =>
    ['movie', 'list', params] as const,
}
