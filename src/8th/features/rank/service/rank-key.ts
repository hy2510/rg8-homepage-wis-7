export const rankKeys = {
  root: () => ['rank'] as const,
  point: (type: string) => ['rank', 'point', type] as const,
  levelMaster: () => ['rank', 'level-master'] as const,
  hallOfFame: (gradeId?: string, page?: number) =>
    ['rank', 'hall-of-fame', gradeId, page] as const,
  hallOfFameInfo: () => ['rank', 'hall-of-fame-info'] as const,
  hallOfFameTierRank: (tier: string) =>
    ['rank', 'hall-of-fame-tier-rank', tier] as const,
  readingKing: (eventId: string) => ['rank', 'reading-king', eventId] as const,
  readingKingGroup: (eventId: string) =>
    ['rank', 'reading-king-group', eventId] as const,
  rgRaceRank: (groupId: string, page?: number) =>
    ['rank', 'rg-race-rank', groupId, page] as const,
  rgRaceStage: () => ['rank', 'rg-race-stage'] as const,
}
