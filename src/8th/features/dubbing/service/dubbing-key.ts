export const dubbingKeys = {
  root: () => ['dubbing'] as const,
  info: () => ['dubbing', 'info'] as const,
  tags: () => ['dubbing', 'tags'] as const,
  search: () => ['dubbing', 'search'] as const,
  searchWithLevel: (level: string) => ['dubbing', 'search', level] as const,
  myVideo: () => ['dubbing', 'my-video'] as const,
  myVideoWithLevel: (level: string) => ['dubbing', 'my-video', level] as const,
  searchAndMyVideo: (level: string) =>
    ['dubbing', 'search-and-my-video', level] as const,
  content: () => ['dubbing', 'content'] as const,
  contentWithParams: (params: Record<string, unknown>) =>
    ['dubbing', 'content', params] as const,
}
