export type HallOfFameTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'titanium'
const HALL_OF_FAME_TIERS: {
  tier: HallOfFameTier
  tIdCode: string
  point: number
}[] = [
  { tier: 'titanium', tIdCode: 't8th0175', point: 50000 },
  { tier: 'platinum', tIdCode: 't8th0176', point: 40000 },
  { tier: 'gold', tIdCode: 't8th0177', point: 30000 },
  { tier: 'silver', tIdCode: 't8th0178', point: 20000 },
  { tier: 'bronze', tIdCode: 't8th0179', point: 10000 },
]

// FIXME: 하드코딩 데이터
const HALL_OF_FAME_TIERS_INFO: {
  id: HallOfFameTier
  percent: number
  benefits: string[]
  note: string
}[] = [
  {
    id: 'bronze',
    percent: 30,
    benefits: ['RG몰 포인트 지급', '명예의 전당 등재 배지'],
    note: '※ 신청 기간 : 등재일로부터 10일 이내',
  },
  {
    id: 'silver',
    percent: 20,
    benefits: ['RG몰 포인트 지급', '명예의 전당 등재 배지'],
    note: '※ 신청 기간 : 등재일로부터 10일 이내',
  },
  {
    id: 'gold',
    percent: 10,
    benefits: ['RG몰 포인트 지급', '상패 수여 대상 검토'],
    note: '※ 신청 기간 : 등재일로부터 10일 이내',
  },
  {
    id: 'platinum',
    percent: 5,
    benefits: ['RG몰 포인트 지급', '상패 수여', '특별 이벤트 초대'],
    note: '※ 신청 기간 : 등재일로부터 10일 이내',
  },
  {
    id: 'titanium',
    percent: 1,
    benefits: [
      '리딩게이트 1년 이용권 지급',
      'RG몰 포인트 100,000점 지급',
      '본사 기념 촬영, 상패 수여, 국내 투어 지원, 캐나다 여름캠프 지원',
    ],
    note: '※ 신청 기간 : 등재일로부터 10일 이내',
  },
]

export function toTier(value: string): HallOfFameTier | undefined {
  const medal = value.toLowerCase()

  return HALL_OF_FAME_TIERS.some((tier) => tier.tier === medal)
    ? (medal as HallOfFameTier)
    : undefined
}

export function getTierNameCode(tier: HallOfFameTier): string | undefined {
  return HALL_OF_FAME_TIERS.find((item) => item.tier === tier)?.tIdCode
}

export function getTierPoint(tier: HallOfFameTier): number {
  return HALL_OF_FAME_TIERS.find((item) => item.tier === tier)?.point || 0
}

export function getAllTier() {
  return HALL_OF_FAME_TIERS
}

export function getTierInfo() {
  return HALL_OF_FAME_TIERS_INFO
}

export function getTier(point: number): HallOfFameTier | undefined {
  return HALL_OF_FAME_TIERS.find((item) => point >= item.point)?.tier
}
