import Trial, { TrialLevel } from '@/8th/features/account/ui/page/Trial'

export default async function Page(props: {
  params: Promise<{ level: string }>
}) {
  const params = await props.params
  const level = params.level as TrialLevel

  return <Trial level={level} />
}
