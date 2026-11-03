'use client'

import styled from 'styled-components'

export const PlayerDialog = styled.dialog.withConfig({ componentId: 'dnf-lesson-player' })`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: #101b2a;
  color: #fff;
  font-size: 16px;
  &[open] { display: flex; flex-direction: column; }
  .player-surface {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    background: #101b2a;
    color: #fff;
  }
  .player-surface:fullscreen { width: 100vw; height: 100dvh; }
  button { cursor: pointer; border: 0; border-radius: 12px; padding: 12px 16px; background: #263b53; color: white; }
  button:disabled { opacity: .4; cursor: default; }
  button:focus-visible, summary:focus-visible { outline: 3px solid #2bb0bd; outline-offset: -3px; }
  .player-header { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); flex-shrink: 0; align-items: center; padding: 16px 24px; gap: 16px; background: #17263a; }
  .player-menu-toggle { justify-self: start; min-width: 0; padding: 0; background: transparent; text-align: left; border-radius: 4px; }
  .player-menu-toggle strong, .player-menu-toggle span { display: block; }
  .player-menu-toggle span { color: #a2b1c4; font-size: .8em; margin-top: 4px; }
  .player-controls { justify-self: end; display: flex; gap: 12px; }
  .player-controls button { display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border-radius: 50%; }
  .player-controls button svg { width: 24px; height: 24px; stroke-width: 2.5; }
  .player-controls button:hover { background: #35516e; }
  .player-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }
  .player-stage { width: auto; max-width: none; margin: 0; padding: 0; flex: 1; min-width: 0; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: auto; }
  .player-stage > video, .player-stage > iframe { width: 100%; height: 100%; border: 0; background: black; object-fit: contain; }
  .unity-stable-container { position: relative; width: 100%; height: 100%; min-height: 0; overflow: hidden; background: #000; }
  .unity-stable-container iframe { position: absolute; top: 50%; left: 50%; width: 1280px; height: 720px; max-width: none; border: 0; transform-origin: center; }
  .player-menu { width: 300px; flex-shrink: 0; min-height: 0; overflow: hidden; background: #142235; color: #e4edf7; box-shadow: inset -1px 0 #0b1522; transition: width 240ms ease; }
  .player-menu-inner { width: 300px; height: 100%; display: flex; flex-direction: column; transition: transform 240ms ease; }
  .player-menu.is-collapsed { width: 0; }
  .player-menu.is-collapsed .player-menu-inner { transform: translateX(-100%); }
  .player-menu-steps { flex: 1; min-height: 0; overflow-y: auto; padding-top: 12px; }
  .player-menu details { width: 276px; margin: 0 12px 12px; border-radius: 16px; background: #1e3148; overflow: hidden; }
  .player-menu summary { display: flex; gap: 8px; align-items: center; padding: 16px 12px; cursor: pointer; list-style: none; font-size: .9em; }
  .player-menu summary::-webkit-details-marker { display: none; }
  .player-menu summary span { font-size: .9em; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: #2bb0bd; color: white; }
  .player-menu summary svg { margin-left: auto; }
  .player-menu details[open] summary svg { transform: rotate(90deg); }
  .player-menu details button { display: block; text-align: left; width: calc(100% - 16px); margin: 0 8px 8px; background: #263b53; color: #bfcedf; font-size: .8em; }
  .player-menu details button[aria-current] { background: #185360; color: #bdf6f7; }
  .player-menu details p { padding: 12px; font-size: .8em; }
  .player-footer { flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 0; background: #17263a; }
  .player-footer .player-page-menu-toggle { background: transparent; min-width: 80px; min-height: 44px; font-variant-numeric: tabular-nums; }
  .player-footer .player-page-menu-toggle:hover { background: #263b53; }
  .player-footer .player-navigation { width: 48px; height: 48px; display: grid; place-items: center; padding: 0; border-radius: 50%; }
  .player-navigation:not(:disabled):hover { background: #35516e; }
  .player-stage.content-expanded { position: fixed; inset: 0; z-index: 10; width: 100%; height: 100%; padding: 0; background: #000; }
  .content-fullscreen-exit { position: absolute; top: 16px; right: 16px; z-index: 2; width: 44px; height: 44px; padding: 0; border-radius: 50%; display: grid; place-items: center; }
  .lesson-video { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; min-height: 0; background: #000; }
  .lesson-video-screen { position: relative; flex: 1; min-height: 0; display: flex; }
  .lesson-video-screen video { width: 100%; height: 100%; object-fit: contain; }
  .video-toolbar { position: absolute; bottom: 0; left: 0; right: 0; padding: 32px 24px 20px; background: linear-gradient(transparent, #101b2aeF); }
  .video-toolbar.controls-hidden { opacity: 0; pointer-events: none; }
  .video-toolbar:has(:focus-visible) { opacity: 1; pointer-events: auto; }
  .video-toolbar input[type='range'] { accent-color: #35c9d7; cursor: pointer; height: 24px; padding: 0; }
  .video-seek { flex: 1; min-width: 80px; width: auto; display: block; margin: 0 12px; }
  .video-toolbar-row { display: flex; align-items: center; gap: 12px; }
  .video-toolbar-row button { height: 52px; min-width: 52px; display: flex; align-items: center; justify-content: center; gap: 4px; border-radius: 50%; padding: 8px; }
  .video-toolbar-row .video-skip,
  .video-toolbar-row .video-volume button { width: 40px; height: 40px; min-width: 40px; padding: 0; font-size: .9em; }
  .video-toolbar-row .video-play-toggle { background: #159cae; border-radius: 50%; }
  .video-toolbar-row button:hover { background: #3b5776; }
  .video-time { color: #c4d2e2; font-family: var(--font-family-secondary); font-size: .9em; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .video-volume { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  .video-volume input { width: 100px; }
  .video-toolbar input[type='range'] { appearance: none; -webkit-appearance: none; height: 44px; background: transparent; }
  .video-toolbar input[type='range']::-webkit-slider-runnable-track { height: 8px; border-radius: 8px; background: #8295a6; }
  .video-toolbar input[type='range']::-moz-range-track { height: 8px; border-radius: 8px; background: #8295a6; }
  .video-toolbar input[type='range']::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 28px; height: 28px; border: 3px solid #fff; border-radius: 50%; background: #35c9d7; margin-top: -10px; box-shadow: 0 2px 8px #0005; }
  .video-toolbar input[type='range']::-moz-range-thumb { width: 22px; height: 22px; border: 3px solid #fff; border-radius: 50%; background: #35c9d7; box-shadow: 0 2px 8px #0005; }
  .player-finished { text-align: center; }
  .player-finished button { margin: 24px auto; }
  .workbook-viewer {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .workbook-page-row { display: flex; flex: 1; min-height: 0; align-items: center; gap: 24px; padding-inline: 24px; }
  .workbook-page { flex: 1; min-width: 0; height: 100%; }
  .workbook-page img { display: block; width: 100%; height: 100%; object-fit: contain; }
  .workbook-pagination, .workbook-page-status { flex-shrink: 0; }
  .workbook-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #77899e; }
  .page-arrow { width: 48px; height: 48px; flex: 0 0 48px; padding: 0; border-radius: 50%; display: grid; place-items: center; }
  .page-arrow[aria-label='Previous page'] svg { transform: rotate(180deg); }
  .workbook-pagination { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; }
  .workbook-pagination [aria-current] { background: #1689ac; }
  .workbook-page-status { display: block; text-align: center; margin: 8px 0 24px; }
  @media (prefers-reduced-motion: reduce) { .player-menu, .player-menu-inner { transition: none; } }
`
