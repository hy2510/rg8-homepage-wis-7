export const accountKeys = {
  root: () => ['account'] as const,
  classGroupList: (customerId: string) =>
    ['account', 'class-group', 'list', customerId] as const,
  classList: (params: { customerId: string; classGroupId: string }) =>
    [
      'account',
      'class',
      'list',
      params.customerId,
      params.classGroupId,
    ] as const,
  findId: (params: { customerId: string; useType: string; keyword: string }) =>
    [
      'account',
      'find-id',
      params.customerId,
      params.useType,
      params.keyword,
    ] as const,
  logout: () => ['account', 'logout'] as const,
  trialContents: (params: { level: string }) =>
    ['account', 'trial', 'contents', params.level] as const,
}
export type AccountKeys = typeof accountKeys
