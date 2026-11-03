'use client'

import { useEffect, useRef, useState } from 'react'

export default function LessonVideo({ url, title }: { url: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interacting = useRef(false)
  const revealControls = () => {
    setControlsVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (ref.current && !ref.current.paused && !interacting.current) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 2000)
    }
  }
  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current) }, [])
  useEffect(() => {
    const release = () => {
      if (!interacting.current) return
      interacting.current = false
      setControlsVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      if (ref.current && !ref.current.paused) {
        hideTimer.current = setTimeout(() => setControlsVisible(false), 2000)
      }
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
    }
  }, [])
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState(false)
  const toggle = async () => {
    const video = ref.current
    if (!video) return
    if (!video.paused) video.pause()
    else { try { await video.play(); setError(false) } catch { setError(true) } }
  }
  const seek = (value: number) => { if (ref.current && duration) ref.current.currentTime = Math.max(0, Math.min(duration, value)) }
  const format = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`
  useEffect(() => { const video = ref.current; return () => video?.pause() }, [])
  const playIcon = <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">{playing ? <><rect x="6" y="5" width="4" height="14" rx="1.5" /><rect x="14" y="5" width="4" height="14" rx="1.5" /></> : <path stroke="none" d="M7 6.5C7 4.7 8.5 3.9 10 4.8L19 10.2C20.6 11.1 20.6 12.9 19 13.8L10 19.2C8.5 20.1 7 19.3 7 17.5Z" />}</svg>
  return <div className="lesson-video" onPointerDown={revealControls} onKeyDown={revealControls}>
    <div className="lesson-video-screen">
      <video ref={ref} src={url} playsInline preload="metadata" aria-label={title}
        onPlay={() => { setPlaying(true); revealControls() }} onPause={() => { setPlaying(false); revealControls() }} onEnded={() => { setPlaying(false); revealControls() }}
        onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
        onDurationChange={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onVolumeChange={event => { setVolume(event.currentTarget.volume); setMuted(event.currentTarget.muted) }}
        onError={() => setError(true)} />
    </div>
    <div className={`video-toolbar${playing && !controlsVisible ? ' controls-hidden' : ''}`}
      onPointerDown={() => { interacting.current = true; revealControls() }}
      onPointerUp={() => { interacting.current = false; revealControls() }}
      onPointerCancel={() => { interacting.current = false; revealControls() }}
      onFocus={revealControls}>
      <div className="video-toolbar-row">
        <button className="video-skip" type="button" aria-label="Rewind 5 seconds" onClick={() => seek(time - 5)}>-5</button>
        <button className="video-play-toggle" type="button" aria-label={playing ? 'Pause video' : 'Play video'} onClick={() => { void toggle() }}>{playIcon}</button>
        <button className="video-skip" type="button" aria-label="Forward 5 seconds" onClick={() => seek(time + 5)}>+5</button>
        <span className="video-time">{format(time)} / {format(duration)}</span>
      <input className="video-seek" type="range" min="0" max={duration || 1} step="0.1" value={time} disabled={!duration} aria-label="Video progress" aria-valuetext={`${format(time)} of ${format(duration)}`} onChange={event => seek(Number(event.target.value))} />
        <div className="video-volume">
          <button type="button" aria-label={muted ? 'Unmute video' : 'Mute video'} onClick={() => { if (ref.current) ref.current.muted = !muted }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" />{muted || volume === 0 ? <path d="m16 9 6 6m0-6-6 6" /> : <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />}</svg>
          </button>
          <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} aria-label="Volume" onChange={event => { if (ref.current) { ref.current.volume = Number(event.target.value); ref.current.muted = false } }} />
        </div>
      </div>
      {error && <p role="status">Unable to play this video. Please try again.</p>}
    </div>
  </div>
}


