'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/**
 * 상태 종류(semantic). CSS 색상은 view 에서 매핑한다.
 */
export type GuideStatusKind =
  | 'idle' //                앱 미로드
  | 'loading' //             초기 로딩 중
  | 'ready' //               앱 준비 완료
  | 'step-loading' //        Step N 로딩 중
  | 'step-active' //         Step N 진행 중
  | 'step-restarted' //      Step N 재시작됨
  | 'story-loading' //       Story 로딩 중
  | 'story-finished' //      Story 종료
  | 'activity-finished' //   Step N 완료
  | 'retrying' //           현재 Step 재시작 중

export type GuideStatus = {
  kind: GuideStatusKind
  text: string
}

/** iframe → 부모 (수신) */
export type GuideInboundMessage =
  | { type: 'READY'; step?: number }
  | { type: 'STEP_CHANGED'; step: number }
  | { type: 'STEP_RESTARTED'; step: number }
  | { type: 'VIEW_CHANGED'; step?: number }
  | { type: 'ACTIVITY_FINISHED'; step: number }
  | { type: 'STORY_FINISHED' }

/** 부모 → iframe (발신) */
export type GuideOutboundMessage =
  | { type: 'GO_STEP'; step: number }
  | { type: 'GO_STORY' }
  | { type: 'RETRY_STEP' }

export type GuideMessageCallbacks = {
  onReady?: (step: number | undefined) => void
  onStepChanged?: (step: number) => void
  onStepRestarted?: (step: number) => void
  onActivityFinished?: (step: number) => void
  onStoryFinished?: () => void
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const KNOWN_INBOUND: ReadonlySet<string> = new Set([
  'READY',
  'STEP_CHANGED',
  'STEP_RESTARTED',
  'VIEW_CHANGED',
  'ACTIVITY_FINISHED',
  'STORY_FINISHED',
])

const INITIAL_STATUS: GuideStatus = { kind: 'idle', text: '앱 미로드' }

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

/**
 * Guide Mode postMessage 송수신 + 상태 관리를 캡슐화한 커스텀 훅.
 *
 * - Step / Story 이동: iframe 리로드 → READY 수신 → 명령 전송
 * - Step 재시작: 리로드 없이 직접 RETRY_STEP 전송
 */
export function useGuideMessaging({
  frameRef,
  iframeUrl,
  callbacks,
}: {
  frameRef: RefObject<HTMLIFrameElement | null>
  iframeUrl: string
  callbacks?: GuideMessageCallbacks
}) {
  const [appReady, setAppReady] = useState(false)
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [status, setStatus] = useState<GuideStatus>(INITIAL_STATUS)
  const [loadingStep, setLoadingStep] = useState<number | null>(null)

  // 리로드 후 READY 수신 시 실행할 대기 액션
  const pendingActionRef = useRef<
    { kind: 'step'; step: number } | { kind: 'story' } | null
  >(null)

  // 콜백은 최신값을 참조하도록 ref 로 보관 (리스너 재부착 방지)
  const callbacksRef = useRef(callbacks)
  useEffect(() => {
    callbacksRef.current = callbacks
  })

  // ── iframe 발신 ─────────────────────────────
  const postToFrame = useCallback(
    (msg: GuideOutboundMessage) => {
      frameRef.current?.contentWindow?.postMessage(msg, window.location.origin)
    },
    [frameRef],
  )

  // ── iframe 강제 리로드 + 대기 액션 등록 ─────
  const reloadWithPending = useCallback(
    (action: { kind: 'step'; step: number } | { kind: 'story' }) => {
      setAppReady(false)
      pendingActionRef.current = action

      if (action.kind === 'step') {
        setLoadingStep(action.step)
        setStatus({
          kind: 'step-loading',
          text: `Step ${action.step} 로딩 중…`,
        })
      } else {
        setStatus({ kind: 'story-loading', text: 'Story 로딩 중…' })
      }

      if (frameRef.current) frameRef.current.src = iframeUrl
    },
    [frameRef, iframeUrl],
  )

  // ── postMessage 수신 리스너 ──────────────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return

      const data = e.data as { type?: string; step?: number } | null
      const type = data?.type
      const step = data?.step
      if (!type || !KNOWN_INBOUND.has(type)) return

      switch (type) {
        case 'READY': {
          setLoadingStep(null)
          setCurrentStep(step ?? null)
          setStatus({ kind: 'ready', text: `앱 준비 완료 (step ${step})` })

          // 대기 액션이 있으면 이어서 실행
          const pending = pendingActionRef.current
          if (pending?.kind === 'step') {
            postToFrame({ type: 'GO_STEP', step: pending.step })
          } else if (pending?.kind === 'story') {
            postToFrame({ type: 'GO_STORY' })
          }
          pendingActionRef.current = null

          setAppReady(true)
          callbacksRef.current?.onReady?.(step)
          break
        }
        case 'STEP_CHANGED':
          if (step != null) {
            setCurrentStep(step)
            setStatus({ kind: 'step-active', text: `Step ${step} 진행 중` })
            callbacksRef.current?.onStepChanged?.(step)
          }
          break
        case 'STEP_RESTARTED':
          if (step != null) {
            setStatus({
              kind: 'step-restarted',
              text: `Step ${step} 재시작됨`,
            })
            callbacksRef.current?.onStepRestarted?.(step)
          }
          break
        case 'ACTIVITY_FINISHED':
          if (step != null) {
            setStatus({
              kind: 'activity-finished',
              text: `Step ${step} 완료`,
            })
            callbacksRef.current?.onActivityFinished?.(step)
          }
          break
        case 'STORY_FINISHED':
          setStatus({ kind: 'story-finished', text: 'Story 종료' })
          setAppReady(true)
          callbacksRef.current?.onStoryFinished?.()
          break
        // VIEW_CHANGED: 별도 상태 변화 없음
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [postToFrame])

  // ── 공개 API ─────────────────────────────────
  const handleStepClick = useCallback(
    (step: number) => reloadWithPending({ kind: 'step', step }),
    [reloadWithPending],
  )

  const handleGoStory = useCallback(
    () => reloadWithPending({ kind: 'story' }),
    [reloadWithPending],
  )

  const handleRetryStep = useCallback(() => {
    if (!appReady) return
    postToFrame({ type: 'RETRY_STEP' })
    setStatus({ kind: 'retrying', text: '현재 Step 재시작 중…' })
  }, [appReady, postToFrame])

  // iframe onLoad — Step/Story 리로드는 이미 상태를 세팅했으니 초기 로드만 처리
  const handleFrameLoad = useCallback(() => {
    if (pendingActionRef.current) return
    setAppReady(false)
    setCurrentStep(null)
    setStatus({ kind: 'loading', text: '로딩 중…' })
  }, [])

  return {
    // 상태
    appReady,
    currentStep,
    status,
    loadingStep,
    // 핸들러
    handleStepClick,
    handleGoStory,
    handleRetryStep,
    handleFrameLoad,
  } as const
}
