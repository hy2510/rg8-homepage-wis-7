'use client'

import GlossyBackground from '@/8th/assets/images/glossy-bg-big-white-25.svg'
import GlossyPoint from '@/8th/assets/images/icons/glossy-point.svg'
import { LibraryFinderTabBarStyle } from '@/8th/shared/styled/FeaturesStyled'
import {
  labtopS,
  phone,
  tabletL,
  tabletS,
} from '@/8th/shared/styled/StyleUtils'
import styled, { css, keyframes } from 'styled-components'

const thumbnailSkeletonGradient =
  'linear-gradient(90deg, #f0f2f5 25%, #e4e8ee 50%, #f0f2f5 75%)'

const thumbnailShimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`

const hofHeroWaveDrift = keyframes`
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
`

const hofHeroPulse = keyframes`
  0%, 100% {
    opacity: 0.12;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.12);
  }
`

const hofHeroPulseAlt = keyframes`
  0%, 100% {
    opacity: 0.08;
  }
  50% {
    opacity: 0.7;
  }
`

const hofTierGradientSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const hpContentWidth = css`
  width: min(100%, 1400px);
  margin-inline: auto;
`

export const HpGapStyle = styled.div<{ $size: number }>`
  flex-shrink: 0;
  width: 100%;
  height: ${({ $size }) => `${$size}px`};
  @media (max-width: 768px) {
    height: ${({ $size }) => `${Math.min($size, 40)}px`};
  }
`

export const HpFloatingMenuStyled = styled.nav`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 990;
  display: flex;
  flex-direction: column;
  gap: 10px;

  button {
    width: 60px;
    height: 60px;
    padding: 0;
    border: 0;
    background-color: transparent;
    background-size: cover;
    cursor: pointer;
  }

  ${tabletS(`
    bottom: calc(70px + env(safe-area-inset-bottom));
    right: 10px;
    gap: 5px;
    button { width: 50px; height: 50px; }
  `)}
`

export const HpFloatingMenuVnStyled = styled.div`
  position: fixed;
  bottom: 54px;
  left: 20px;
  z-index: 99999;

  a {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px 20px;
    border: 1px solid #f5f5f5;
    border-radius: 10px;
    background: #f9f3f9;
    box-shadow: 0 0 10px 20px rgb(0 0 0 / 16%);

    &:last-child {
      margin-bottom: 0;
    }

    &:focus {
      box-shadow: none !important;
      outline: 0 !important;
    }

    &:hover {
      text-decoration: none;
      box-shadow: 0 0 10px 10px rgb(255 255 255 / 18%);
    }
  }

  .contact-icon-box {
    display: block;
    width: 40px;
    height: 40px;
    border: 1px solid #e5e5e5;
    border-radius: 999px;
    font-size: 16px;
    line-height: 38px;
    text-align: center;
  }

  .nut-chat-facebook .contact-icon-box,
  .nut-chat-zalo .contact-icon-box {
    border: none;
  }

  .zalo-shade {
    fill: #001a33;
    opacity: 0.12;
    isolation: isolate;
  }

  .contact-info {
    padding-left: 10px;
    color: #000;

    b,
    span {
      display: block;
    }

    span {
      color: #868686;
      font-size: 12px;
    }
  }

  @media only screen and (max-width: 1800px) {
    .contact-info {
      display: none;
    }

    a {
      padding: 0;
      border: none;
      border-radius: 100px;
    }
  }
`

export const HpBaseStyled = styled.div`
  /* The legacy homepage stylesheet also loads on client navigation. */
  html:has(&),
  body:has(&) {
    min-width: 0;
  }
  min-width: 0;
  width: 100%;
  min-height: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  color: var(--font-color-primary);
  background: #fff;

  ${LibraryFinderTabBarStyle} {
    .tabs {
      /* The baseline stays fixed while the tab items scroll. */
      background-image: linear-gradient(
        var(--line-color-primary),
        var(--line-color-primary)
      );
      background-position: left bottom;
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-attachment: scroll;
      &::after {
        display: none;
      }
    }
    .tab.active {
      position: relative;
      z-index: 1;
    }
    @media (max-width: 768px) {
      .tabs {
        gap: 6px;
      }
      .tab {
        padding: 12px 16px;
        font-size: 14px;
        line-height: 20px;
        border-radius: 12px 12px 0 0;
      }
    }
  }

  &,
  * {
    font-family: var(--font-family-secondary);
  }

  .page-slot {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  @media (max-width: 768px) {
    input,
    select,
    textarea {
      font-size: 16px;
    }
  }
`

export const HpGnbStyled = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  overflow: visible;
  border-bottom: 1px solid rgba(212, 220, 230, 0.5);
  background: rgb(255 255 255 / 96%);
  backdrop-filter: blur(12px);

  .inner {
    width: min(100%, 1920px);
    min-height: 70px;
    display: grid;
    grid-template-columns: minmax(160px, 300px) minmax(0, 1fr) minmax(
        200px,
        300px
      );
    align-items: center;
    gap: 20px;
    margin-inline: auto;
    padding: 0 20px;
  }

  .logo {
    display: flex;
    align-items: center;

    img {
      width: auto;
      height: 30px;
      display: block;
    }
  }

  @media (min-width: 769px) {
    .logo .custom-logo {
      width: auto;
      height: 52px;
      max-width: 250px;
      object-fit: contain;
      object-position: left center;
    }
  }

  .navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(28px, 3vw, 58px);
    white-space: nowrap;

    a {
      color: var(--font-color-secondary);
      font-size: 1.1em;
      font-weight: 800;
      line-height: 70px;
      transition: color 160ms ease;

      &:focus-visible,
      &.active {
        color: var(--font-color-primary);
      }

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          color: var(--font-color-primary);
        }
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    white-space: nowrap;
  }

  .language-select {
    position: relative;
  }

  .language-button {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    color: var(--font-color-primary);
    background: transparent;
    cursor: pointer;

    svg {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.8;
    }
  }

  .language-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 120;
    min-width: 148px;
    margin: 0;
    padding: 8px;
    border: 1px solid rgba(212, 220, 230, 0.7);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 12px 28px rgb(32 48 72 / 12%);
    list-style: none;

    button {
      width: 100%;
      min-height: 40px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      border: 0;
      border-radius: 10px;
      color: var(--font-color-primary);
      background: transparent;
      font-size: 0.9em;
      font-weight: 700;
      text-align: left;
      cursor: pointer;

      &:hover,
      &:focus-visible,
      &.is-active {
        background: #f4f7fb;
      }
    }
  }

  .account-button,
  .app-button {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    border: 0;
    border-radius: 999px;
    color: white;
    font-size: 1em;
    font-weight: 800;
    cursor: pointer;
  }

  .account-button {
    background: var(--color-red-medium);
  }

  .app-select {
    position: relative;
  }

  .app-button {
    background: var(--font-color-primary);
  }

  .app-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 120;
    min-width: 188px;
    margin: 0;
    padding: 8px;
    border: 1px solid rgba(212, 220, 230, 0.7);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 12px 28px rgb(32 48 72 / 12%);
    list-style: none;

    a,
    button {
      width: 100%;
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 12px;
      border: 0;
      border-radius: 10px;
      color: var(--font-color-primary);
      background: transparent;
      font-size: 0.9em;
      font-weight: 700;
      text-align: left;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        background: #f4f7fb;
      }
    }

    .app-icon {
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      display: block;
      border-radius: 5px;
      object-fit: contain;
    }
  }

  .account-select {
    position: relative;
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    min-width: 44px;
    max-width: 44px;
    min-height: 44px;
    max-height: 44px;
  }

  .account-avatar {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    overflow: hidden;
    border: 1px solid rgba(212, 220, 230, 0.8);
    border-radius: 50%;
    background: #fff;
    cursor: pointer;

    .avatar-stack {
      position: absolute;
      inset: 0;
    }

    .avatar-image {
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: 50%;
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    &.has-frame {
      overflow: visible;
      border: none;
      background: transparent;

      .avatar-frame {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 2;
        width: 133.333%;
        height: 133.333%;
        max-width: none;
        transform: translate(-50%, -50%);
        object-fit: contain;
      }
    }
  }

  .account-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 120;
    min-width: 188px;
    overflow: hidden;
    border: 1px solid rgba(212, 220, 230, 0.7);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 12px 28px rgb(32 48 72 / 12%);

    .account-menu-head {
      margin: 0;
      padding: 8px 20px;
      background: #f4f7fb;
      border-bottom: 1px solid #eef2f6;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 800;
      line-height: 1.4;
    }

    ul {
      margin: 0;
      padding: 8px;
      list-style: none;
    }

    button {
      width: 100%;
      min-height: 44px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      border: 0;
      border-radius: 10px;
      color: var(--font-color-primary);
      background: transparent;
      font-size: 0.9em;
      font-weight: 700;
      text-align: left;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        background: #f4f7fb;
      }

      &.study-link {
        justify-content: space-between;
        gap: 8px;
      }

      img {
        flex-shrink: 0;
      }
    }
  }

  ${labtopS(`
    .inner { grid-template-columns: auto 1fr auto; gap: 20px; }
    .navigation {
      gap: 24px;
      a { font-size: 0.9em; }
    }
    .account-button,
    .app-button { padding-inline: 16px; font-size: 0.9em; }
  `)}

  @media (max-width: 1400px) {
    .logo {
      grid-column: 1;
      grid-row: 1;
      min-width: 0;
    }
    .actions {
      grid-column: 2;
      grid-row: 1;
    }
    .inner {
      min-height: auto;
      grid-template-columns: 1fr auto;
      padding-top: 8px;
      gap: 4px;
    }
    .navigation {
      grid-column: 1 / -1;
      grid-row: 2;
      justify-content: flex-start;
      gap: 30px;
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
      a {
        line-height: 46px;
      }
    }
  }

  ${phone(`
    .inner { padding-inline: 16px; }
    .logo img { width: min(100%, 130px); height: auto; }
    .actions { gap: 4px; }
    .account-button,
    .app-button {
      min-height: 36px;
      padding-inline: 12px;
      font-size: 0.8em;
    }
    .account-select {
      flex-basis: 36px;
      width: 36px;
      height: 36px;
      min-width: 36px;
      max-width: 36px;
      min-height: 36px;
      max-height: 36px;
    }
    .navigation {
      gap: 24px;
      a { font-size: 0.9em; }
    }
  `)}

  @media (max-width: 360px) {
    .inner {
      grid-template-columns: minmax(0, 1fr) auto;
      padding-inline: 12px;
    }
    .logo img {
      max-width: 105px;
    }
    .actions {
      gap: 2px;
    }
    .account-button,
    .app-button {
      padding-inline: 8px;
    }
  }

  @media (max-width: 768px) {
    .inner {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .logo .custom-logo {
      width: auto;
      height: auto;
      max-width: min(100%, 250px);
      max-height: 42px;
      object-fit: contain;
      object-position: left center;
    }
  }
`

export const HpFooterStyled = styled.footer`
  margin-top: auto;
  width: 100%;
  background: #fff;
  border-top: 1px solid #e8edf3;

  .inner {
    ${hpContentWidth}
    padding-inline: 40px;
  }

  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px 28px;
    padding: 28px 0;

    a {
      color: #8b97a6;
      font-size: 0.9em;
      font-weight: 600;
      letter-spacing: -0.02em;
      transition: color 160ms ease;

      &:hover,
      &:focus-visible {
        color: var(--font-color-primary);
      }
    }
  }

  .footer-rule {
    width: 100%;
    border-top: 1px solid #e8edf3;
  }

  .footer-meta {
    padding: 28px 0 56px;
  }

  .legal {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    color: #7b8794;
    font-size: 0.8em;
    font-weight: 500;
    line-height: 1.7;
    letter-spacing: -0.02em;

    p {
      margin: 0;
    }
  }

  .legal-row {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0;

    span + span::before {
      content: ' | ';
      color: #c3ccd6;
    }

    a {
      color: inherit;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  ${tabletS(`
    .inner { padding-inline: 24px; }
    .footer-nav { gap: 8px 20px; }
    .footer-meta { padding: 24px 0 44px; }
  `)}

  ${phone(`
    .inner { padding-inline: 16px; }
    .footer-nav {
      gap: 8px 16px;
      padding: 24px 0;
      a { font-size: 0.8em; }
    }
    .footer-meta { padding: 24px 0 36px; }
    .legal { font-size: 0.8em; }
  `)}
`

export const HpMainStyled = styled.main`
  width: 100%;
  background: #fff;

  .notice,
  .section {
    ${hpContentWidth}
  }

  .notice {
    position: sticky;
    top: 71px;
    z-index: 90;
    min-height: 52px;
    display: grid;
    place-items: center;
    padding: 12px 24px;
    border-radius: 18px;
    color: var(--color-red-medium);
    background: #fff0f2;
    font-family: var(--font-family-secondary);
    font-size: 0.9em;
    font-weight: 500;
    text-align: center;
  }

  .hero,
  .cta {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.25fr);
    align-items: center;
    gap: 72px;
  }

  .hero {
    min-height: 600px;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.25fr);
    padding: 48px clamp(24px, 3.6vw, 52px);
  }

  .hero-copy.dodo-hero-copy {
    .dodo-tagline {
      font-size: 1.8em;
      margin: 0 0 20px;
    }
    .dodo-logo {
      width: min(100%, 400px);
      height: auto;
      margin-bottom: 0;
    }
  }

  .hero-copy {
    .dodo-logo {
      display: block;
      width: auto;
      max-width: 100%;
      height: 34px;
      margin-bottom: 32px;
    }

    h1,
    h2 {
      margin: 0;
      font-size: 3em;
      font-family: var(--font-family-secondary);
      font-weight: 700;
    }

    p:not(.eyebrow) {
      margin: 40px 0;
      margin-bottom: 60px;
      color: var(--font-color-secondary);
      font-size: 1.5em;
      font-family: var(--font-family-secondary);
      font-weight: 500;
    }

    .trial-cta {
      width: auto;
      min-width: 260px;
      min-height: 72px;
      padding: 0 40px;
      border-radius: 16px;
      font-size: 1.4em;
      font-weight: 800;
      box-shadow: 0 5px 0 0 var(--color-red-medium-shadow);

      &:active {
        box-shadow: 0 2px 0 0 var(--color-red-medium-shadow);
      }
    }
  }

  .eyebrow {
    margin: 0 0 16px;
    color: #169bd7;
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.12em;
  }

  .hero-visual,
  .cta-visual {
    position: relative;
    height: 420px;
  }

  .hero-video {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--line-color-primary);
    border-radius: 40px;
    background: #000;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .dodo-hero-gloss {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 2;
    width: 24px;
    height: 24px;
    background: url(${GlossyPoint.src}) center / contain no-repeat;
    pointer-events: none;

    @media (max-width: 768px) {
      top: 12px;
      left: 12px;
      width: 18px;
      height: 18px;
    }
  }

  .dodo-hero-character {
    position: absolute;
    right: -44px;
    bottom: -36px;
    z-index: 2;
    width: clamp(114px, 22%, 167px);
    height: auto;
    pointer-events: none;
    transform: rotate(6deg);
    filter: drop-shadow(0 8px 10px rgba(32, 48, 64, 0.14));

    @media (max-width: 768px) {
      width: clamp(77px, 22%, 106px);
      right: -16px;
      bottom: -24px;
    }
  }

  .dodo-hero-character-left {
    right: auto;
    left: -44px;
    width: clamp(84px, 16%, 123px);
    transform: rotate(-6deg);

    @media (max-width: 768px) {
      right: auto;
      left: -16px;
      width: clamp(56px, 16%, 77px);
    }
  }

  .award-badge {
    position: absolute;
    top: -20px;
    right: -50px;
    z-index: 1;
    width: 100px;
    pointer-events: none;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    min-height: 120px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid var(--line-color-primary);
    border-radius: 28px;
    color: #a5b3c6;
    background:
      linear-gradient(135deg, rgb(239 246 255 / 75%), rgb(251 253 255 / 92%)),
      repeating-linear-gradient(
        45deg,
        transparent 0 16px,
        rgb(205 218 234 / 22%) 16px 17px
      );
    font-size: 0.9em;
    font-weight: 700;
  }

  .promotion-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @media (max-width: 768px) {
      .promotion-card:first-child {
        grid-column: 1 / -1;
        height: auto;
        aspect-ratio: 8 / 3;
      }

      .promotion-card:not(:first-child) {
        display: none;
      }
    }

    .image-placeholder,
    .promotion-card {
      height: 180px;
      overflow: hidden;
      border-radius: 18px;
    }

    .promotion-card {
      display: block;
      position: relative;

      .thumbnail-skeleton {
        position: absolute;
        inset: 0;
        z-index: 1;
        border-radius: inherit;
        background: ${thumbnailSkeletonGradient};
        background-size: 200% 100%;
        animation: ${thumbnailShimmer} 1.4s ease-in-out infinite;
        opacity: 1;
        transition: opacity 0.28s ease;

        &.is-done {
          opacity: 0;
          pointer-events: none;
          animation: none;
        }
      }

      .thumbnail-img {
        object-fit: cover;
        object-position: center;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.28s ease;

        &.is-loaded {
          opacity: 1;
        }
      }
    }
  }

  .carousel-controls {
    min-height: 54px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    column-gap: 14px;

    .carousel-prev {
      justify-self: end;
    }
    .carousel-next {
      justify-self: start;
    }
    @media (max-width: 768px) {
      .carousel-prev {
        justify-self: start;
      }
      .carousel-next {
        justify-self: end;
      }
    }
    .carousel-index {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 6px;
      min-width: 64px;
      color: #9aa8b8;
      font-size: 0.9em;
      font-weight: 600;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }
    .carousel-index strong {
      color: #53637a;
      font-size: 0.9em;
      font-weight: 800;
    }
    .carousel-index span {
      color: #c3ccd6;
      font-weight: 600;
    }

    button {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
    }
  }

  .section-title {
    margin: 0 0 24px 16px;
    color: var(--renewal-ink);
    font-size: 1.3em;
    letter-spacing: -0.03em;
    &::before {
      content: '· ';
    }
  }

  .panel {
    border: 1px solid rgba(212, 220, 230, 0.5);
    border-radius: 30px;
    background: #fff;
  }

  .ebook-panel {
    display: grid;
    grid-template-columns: 0.75fr 1.35fr 0.75fr;
    align-items: center;
    gap: 18px;
    padding: 44px 0 12px;
    overflow: hidden;

    .side-book,
    .main-book {
      height: 340px;
      overflow: hidden;
      border-radius: 18px;
      background: #111;
    }
    .side-book {
      padding: 0;
      border: 0;
      background-color: #111;
      background-size: cover;
      background-position: center;
      cursor: pointer;
    }
    .side-book:first-child {
      transform: translateX(-22%);
    }
    .side-book:nth-child(3) {
      transform: translateX(22%);
    }
    .main-book .video-frame {
      height: 100%;
      aspect-ratio: auto;
      border-radius: 18px;
    }
    > strong,
    .carousel-controls {
      grid-column: 1 / -1;
    }
    > strong {
      justify-self: center;
      max-width: 80%;
      margin-top: 8px;
      padding-inline: 16px;
      color: var(--renewal-ink);
      font-size: 1em;
      font-weight: 800;
      line-height: 1.45;
      text-align: center;
      letter-spacing: -0.02em;
    }
  }

  .video-frame {
    .review-play-icon {
      display: inline-grid;
      place-items: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      color: #fff;
      background: rgba(0, 0, 0, 0.65);
      font-size: 24px;
    }
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 18px;
    background: #111;

    iframe,
    .video-thumb {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
      object-fit: cover;
      pointer-events: none;
    }

    .video-shield {
      position: absolute;
      inset: 0;
      z-index: 1;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
    }
  }

  .level-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 54px 68px;
    padding: 52px 72px;
  }

  .level-card {
    display: grid;
    grid-template-columns: minmax(150px, 0.9fr) 1fr;
    align-items: center;
    gap: 34px;

    p {
      color: var(--renewal-muted);
      font-size: 1.2em;
      line-height: 1.5;
    }
    h3 {
      margin: 8px 0;
      font-size: 2.2em;
      line-height: 1.2;
    }
    span {
      display: block;
      color: var(--renewal-muted);
      font-size: 1.1em;
    }
    .text-button {
      display: block;
      font-size: 1.2em;
    }
  }

  .level-image {
    height: 240px;

    img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
      object-position: center;
    }
  }
  .text-button {
    margin-top: 16px;
    padding: 0;
    border: 0;
    color: #00b4d8;
    background: transparent;
    font-size: 0.9em;
    font-weight: 800;
    cursor: pointer;
  }

  .review-grid {
    min-height: 410px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 42px;
    padding: 48px;

    article {
      display: flex;
      flex-direction: column;
    }
    h3 {
      margin: 0 0 24px;
      font-size: 1.1em;
    }
    p {
      min-height: 150px;
      margin: 0;
      color: #5f6d81;
      font-size: 0.9em;
      line-height: 1.65;
    }
    span {
      margin-top: auto;
      color: #8694a7;
      font-size: 0.9em;
    }
    .text-button {
      align-self: flex-start;
    }
    .carousel-controls {
      grid-column: 1 / -1;
    }
  }

  .cta {
    min-height: 470px;
    padding: 40px 52px;
    overflow: visible;

    .hero-copy > span {
      display: block;
      margin-top: 16px;
      color: var(--renewal-muted);
    }

    .cta-buttons {
      width: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;

      span {
        display: block;
        font-size: 1.1em;
        font-weight: 700;
      }
    }
  }

  .cta-model {
    position: absolute;
    right: -80px;
    bottom: 0;
    z-index: 2;
    height: 118%;
    pointer-events: none;

    img {
      width: auto !important;
      height: 100% !important;
      max-width: none;
      display: block;
    }
  }

  .partner-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .partner-card {
    min-height: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 16px 20px;
    border: 1px solid rgba(212, 220, 230, 0.5);
    border-radius: 18px;
    color: #303b4c;
    background: #fff;
    font-size: 1.1em;
    text-decoration: none;
    cursor: pointer;

    &.is-logo img {
      width: auto !important;
      height: 40px !important;
      max-width: 82%;
      object-fit: contain;
    }
  }
  .partner-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    object-fit: contain;
  }
  .partner-mark {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: linear-gradient(135deg, #22b8dc, #6bcf6b);
  }
  .deferred-section {
    content-visibility: visible;
  }

  .hero-copy,
  .hero-visual,
  .cta-visual {
    min-width: 0;
  }
  @media (max-width: 1440px) {
    .cta-model {
      right: 0;
    }
  }
  @media (max-width: 1400px) {
    .notice {
      position: relative;
      top: auto;
    }
    .hero,
    .cta {
      gap: 40px;
    }
  }

  ${tabletL(`
    padding-inline: 16px;
    .hero,
    .cta { grid-template-columns: 1fr; gap: 36px; padding: 32px 20px; }
    .hero-copy {
      text-align: center;
      .trial-cta { margin-inline: auto; }
      .dodo-logo { margin-inline: auto; }
    }
    .hero-visual,
    .cta-visual { height: 300px; }
    .cta-model {
      right: -12px;
      height: 112%;
    }
    .award-badge {
      top: -12px;
      right: -8px;
      width: clamp(52px, 9vw, 80px);
    }
    .promotion-grid {
      grid-template-columns: 1fr;
    }
    .level-grid,
    .review-grid { grid-template-columns: 1fr; }
    .level-grid { padding: 32px 24px; }
    .review-grid {
      min-height: auto;
      padding: 32px 28px;
      p { min-height: auto; }
    }
    .partner-grid { grid-template-columns: repeat(2, 1fr); }
  `)}

  ${phone(`
    .notice { border-radius: 12px; font-size: 0.8em; }
    .hero { min-height: auto; padding-inline: 0; }
    .cta { padding-inline: 0; }
    .hero-copy:not(.dodo-hero-copy) > img {
      width: 210px;
      max-width: 80%;
      height: auto;
      margin-inline: auto;
    }
    .hero:has(.dodo-hero-copy) { padding: 24px 0 32px; gap: 24px; }
    .hero-copy.dodo-hero-copy .dodo-logo { width: min(100%, 240px); margin-inline: auto; }
    .hero-copy.dodo-hero-copy .dodo-tagline { font-size: 18px; margin-bottom: 12px; }
    .hero-copy.dodo-hero-copy p:not(.eyebrow) { margin: 20px 0; font-size: 15px; }
    .hero-copy {
      h1,
      h2 { font-size: 1.9em; }
      p:not(.eyebrow) { margin: 28px 0; font-size: 1em; }
      .trial-cta {
        min-width: 220px;
        min-height: 60px;
        padding: 0 28px;
        font-size: 1.2em;
      }
    }
    .hero-visual,
    .cta-visual { height: auto; aspect-ratio: 16 / 9; }
    .promotion-grid .promotion-card { height: auto; aspect-ratio: 8 / 3; }
    .promotion-grid .thumbnail-img { object-fit: contain; }
    .hero-video { border-radius: 26px; }
    .cta-model {
      right: 0;
      height: 108%;
    }
    .ebook-panel {
      grid-template-columns: 1fr;
      padding-inline: 8px;
      .side-book { display: none; }
      .main-book { height: auto; aspect-ratio: 16 / 9; }
    }
    .level-card {
      grid-template-columns: 1fr;
      gap: 20px;
      h3 { margin: 4px 0; font-size: 24px; line-height: 1.3; }
      span { font-size: 14px; }
      p { margin-top: 0; font-size: 15px; line-height: 1.6; }
      .text-button { font-size: 15px; }
    }
    .level-image { height: 220px; }
    .partner-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 16px; line-height: 1.5; }
    .hero-copy p:not(.eyebrow) { font-size: 16px; line-height: 1.6; }
    .ebook-panel { padding-top: 20px; }
    .ebook-panel > strong { max-width: 100%; font-size: 14px; }
    .cta .cta-buttons { margin-inline: auto; }
  `)}

  @media (min-width: 600px) and (max-width: 1400px) {
    min-width: 0;
    padding-inline: 16px;
    overflow-x: clip;
    .promotion-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .promotion-grid .promotion-card,
    .promotion-grid .image-placeholder {
      height: auto;
      aspect-ratio: 8 / 3;
      border-radius: 12px;
    }
    .promotion-grid .thumbnail-img {
      object-fit: contain;
    }
    .hero,
    .cta {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.25fr);
      gap: 28px;
      min-height: 360px;
      padding: 40px 16px;
    }
    .hero-copy {
      text-align: left;
      h1,
      h2 {
        font-size: 28px;
        line-height: 1.35;
      }
      p:not(.eyebrow) {
        margin: 24px 0 28px;
        font-size: 16px;
        line-height: 1.6;
      }
      > img {
        max-width: 210px;
        height: auto;
      }
      .dodo-logo,
      .trial-cta {
        margin-inline: 0;
      }
      .trial-cta {
        min-width: 180px;
        min-height: 52px;
        padding: 0 24px;
        font-size: 16px;
        border-radius: 12px;
      }
    }
    .hero-copy.dodo-hero-copy {
      .dodo-logo {
        width: min(100%, 280px);
      }
      .dodo-tagline {
        font-size: 20px;
        margin-bottom: 12px;
      }
    }
    .hero-visual,
    .cta-visual {
      height: auto;
      aspect-ratio: 16 / 9;
    }
    .hero-video {
      border-radius: 22px;
    }
    .award-badge {
      top: -12px;
      right: -8px;
      width: 80px;
    }
    .cta-model {
      right: -8px;
      height: 110%;
    }
    .section-title {
      font-size: 17px;
      margin-bottom: 20px;
    }
    .level-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px 20px;
      padding: 28px 20px;
    }
    .level-card {
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
      gap: 14px;
      h3 {
        font-size: 24px;
        margin: 6px 0;
      }
      span {
        font-size: 12px;
      }
      p {
        font-size: 14px;
        line-height: 1.5;
      }
      .text-button {
        font-size: 14px;
        margin-top: 14px;
      }
    }
    .level-image {
      height: 170px;
    }
    .ebook-panel {
      padding-top: 28px;
      gap: 14px;
    }
    .ebook-panel .side-book,
    .ebook-panel .main-book {
      height: 220px;
    }
    .ebook-panel > strong {
      font-size: 14px;
    }
    .partner-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .partner-card {
      min-height: 68px;
      padding: 12px;
      gap: 8px;
      font-size: 13px;
    }
    .partner-card.is-logo img {
      height: 30px !important;
    }
    .carousel-controls .carousel-prev {
      justify-self: end;
    }
    .carousel-controls .carousel-next {
      justify-self: start;
    }
  }
  @media (min-width: 600px) and (max-width: 1400px) and (orientation: landscape),
    (min-width: 1024px) and (max-width: 1400px) and (orientation: portrait) {
    .hero > .hero-copy,
    .cta > .hero-copy {
      padding-left: clamp(16px, 2.5vw, 32px);
    }
    .ebook-panel .main-book {
      height: auto;
      aspect-ratio: 16 / 9;
      min-width: 0;
    }
    .ebook-panel .main-book .video-frame {
      height: auto;
      aspect-ratio: 16 / 9;
    }
    .ebook-panel .side-book {
      height: auto;
      min-height: 0;
      align-self: stretch;
    }
  }
  @media (min-width: 1100px) and (max-width: 1400px) and (orientation: landscape) {
    .hero-copy {
      h1,
      h2 {
        font-size: 34px;
      }
      p:not(.eyebrow) {
        font-size: 18px;
      }
      .trial-cta {
        font-size: 18px;
      }
    }
    .section-title {
      font-size: 20px;
    }
    .level-card {
      h3 {
        font-size: 28px;
      }
      span {
        font-size: 14px;
      }
      p,
      .text-button {
        font-size: 16px;
      }
    }
    .ebook-panel > strong {
      font-size: 16px;
    }
    .partner-card {
      font-size: 15px;
    }
  }
  /* Portrait changes layout only; retain the tablet typography above. */
  @media (min-width: 600px) and (max-width: 1023px) and (orientation: portrait) {
    .hero,
    .cta {
      grid-template-columns: minmax(0, 1fr);
      min-height: auto;
      gap: 28px;
      padding: 32px 0;
    }
    .hero-copy {
      text-align: center;
      > img,
      .dodo-logo,
      .trial-cta {
        margin-inline: auto;
      }
    }
    .cta .cta-buttons {
      margin-inline: auto;
    }
    .promotion-grid,
    .level-grid,
    .review-grid,
    .partner-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    .level-card {
      grid-template-columns: minmax(160px, 0.8fr) minmax(0, 1fr);
      gap: 24px;
    }
    .level-image {
      height: 190px;
    }
    .partner-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .ebook-panel {
      grid-template-columns: minmax(0, 1fr);
      padding-inline: 12px;
    }
    .ebook-panel .side-book {
      display: none;
    }
    .ebook-panel .main-book {
      height: auto;
      aspect-ratio: 16 / 9;
    }
    .carousel-controls .carousel-prev {
      justify-self: start;
    }
    .carousel-controls .carousel-next {
      justify-self: end;
    }
  }
`

export const HpIntroTabsStyled = styled.nav`
  ${hpContentWidth}
  padding: 24px 24px 32px;
  isolation: isolate;
  .tabs {
    display: flex;
  }
  .tab {
    flex: 1;
    justify-content: center;
    text-align: center;
  }
  .tab.active {
    position: relative;
    z-index: 1;
  }
  @media (max-width: 768px) {
    padding: 16px;
    .tabs {
      overflow-x: auto;
    }
    .tab {
      flex: 1 0 auto;
      min-height: 44px;
    }
  }
`

export const HpDodoFriendsStyled = styled(HpMainStyled)`
  @media (max-width: 768px) {
    /* Clip decorative overflow without creating a nested scroll container. */
    html:has(&),
    body:has(&) {
      overflow-x: clip;
    }
    min-width: 0;
    max-width: 100%;
    overflow-x: clip;
  }

  .dodo-desktop-only {
    display: block;
  }
  .dodo-mobile-only {
    display: none;
  }
  @media (max-width: 768px) {
    .dodo-desktop-only {
      display: none;
    }
    .dodo-mobile-only {
      display: block;
    }
  }

  .dodo-level-controls {
    display: grid;
    grid-template-columns: 44px minmax(0, 240px) 44px;
    justify-content: center;
    align-items: center;
    gap: 12px;
    button {
      width: 44px;
      height: 44px;
      padding: 0;
      font-size: 28px;
    }
  }
  .dodo-level-indicator {
    display: grid;
    gap: 4px;
    font-size: 15px;
    span {
      font-size: 13px;
    }
  }
  .dodo-level-slider {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: 32px;
    min-width: 0;
    text-align: center;
    background: #fff;
  }
  .dodo-level-waves {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 40%;
    z-index: -1;
    pointer-events: none;
    use {
      animation: ${hofHeroWaveDrift} 25s cubic-bezier(0.55, 0.5, 0.45, 0.5)
        infinite;
    }
    use:nth-child(1) {
      fill: rgba(44, 177, 190, 0.2);
      animation-delay: -2s;
      animation-duration: 7s;
    }
    use:nth-child(2) {
      fill: rgba(92, 197, 204, 0.2);
      animation-delay: -3s;
      animation-duration: 10s;
    }
    use:nth-child(3) {
      fill: rgba(159, 224, 225, 0.3);
      animation-delay: -4s;
      animation-duration: 13s;
    }
    use:nth-child(4) {
      fill: rgba(44, 177, 190, 0.2);
      animation-delay: -5s;
      animation-duration: 20s;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .dodo-level-waves use {
      animation: none;
    }
  }
  .dodo-stage-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 32px;
    button {
      border: 0;
      border-radius: 20px;
      padding: 12px 20px;
      background: #f4f6f9;
      color: inherit;
      font: inherit;
      font-size: 1em;
      font-weight: 700;
      cursor: pointer;
      &[aria-pressed='true'] {
        background: #000;
        color: #fff;
      }
    }
  }
  .dodo-stage-window {
    overflow: hidden;
  }
  .dodo-stage-nav.dodo-level-controls {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) 44px;
    padding-inline: 0;
    width: 100%;
    button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      background: transparent;
      border-radius: 0;
    }
    .dodo-level-indicator {
      color: #53637a;
    }
    .dodo-level-indicator span {
      color: #9aa8b8;
      font-weight: 600;
    }
  }
  @media (max-width: 768px) {
    .dodo-level-waves {
      width: 1100px;
      max-width: none;
      height: 180px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .dodo-stage-track {
    display: flex;
    transition: transform 0.4s ease;
  }
  .dodo-stage-slide {
    flex: 0 0 100%;
    min-width: 0;
  }
  .dodo-stage-heading {
    margin-bottom: 24px;
    h3 {
      margin: 8px 0 12px;
      font-size: 1.8em;
    }
    strong {
      font-size: 1.2em;
    }
    p {
      margin: 12px 0 0;
      font-size: 1em;
      line-height: 1.7;
      word-break: keep-all;
    }
  }
  .dodo-stage-number {
    color: #e53945;
    font-size: 0.9em;
    font-weight: 700;
  }
  .dodo-stage-courses {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: 16px;
  }
  .dodo-stage-courses > .dodo-stage-course:only-child {
    max-width: 50%;
    justify-self: center;
  }
  .dodo-stage-course {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    width: 100%;
    min-width: 0;
    padding: 24px;
    border-radius: 28px;
    background-color: #d6eeeb;
    color: #34465f;
    background-image: url(${GlossyPoint.src}), url(${GlossyBackground.src});
    background-position:
      12px 12px,
      center;
    background-size:
      16px 16px,
      cover;
    background-repeat: no-repeat;
    &[data-character='baro'] {
      background-color: #f7e8ad;
      color: #70551e;
    }
    &[data-character='chello'] {
      background-color: #f5ccdf;
      color: #813b5c;
    }
    &[data-character='millo'] {
      background-color: #d9e8f4;
      color: #365f80;
    }
    &[data-character='jack'] {
      background-color: #f8d3b6;
      color: #854b27;
    }
    &[data-character='blanc'] {
      background-color: #e2dff1;
      color: #5c4e80;
    }
    &[data-character='sheila'] {
      background-color: #c5e8e3;
      color: #286660;
    }
    &[data-character='tori'] {
      background-color: #f3cec9;
      color: #823f3d;
    }
    &[data-character='roro'] {
      background-color: #f5d8b8;
      color: #79502b;
    }
    &[data-character='leoni'] {
      background-color: #f5e6b7;
      color: #70571e;
    }
    &[data-character='goma'] {
      background-color: #f5cfc3;
      color: #824839;
    }
    &[data-character='gino'] {
      background-color: #cce7cc;
      color: #35623b;
    }
    strong {
      font-size: 1.1em;
      line-height: 1.5;
    }
    p {
      margin: 12px 0 0;
      font-size: 1em;
      line-height: 1.7;
      word-break: keep-all;
    }
  }
  .dodo-stage-course-name {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    h4 {
      margin: 0;
      font-size: 1.3em;
    }
    span {
      font-size: 0.9em;
      padding: 4px 8px;
      border-radius: 12px;
      background: #fff;
    }
  }
  .dodo-course-panorama {
    position: absolute;
    z-index: -1;
    pointer-events: none;
    display: flex;
    gap: 12px;
    top: 40px;
    left: 50%;
    transform: translateX(-50%) rotate(-8deg);
    width: max-content;
    opacity: 0.35;
    mask-image: linear-gradient(
      to bottom,
      transparent,
      #000 20%,
      #000 65%,
      transparent
    );
    img {
      width: 200px;
      height: 114px;
      object-fit: contain;
      border-radius: 8px;
    }
  }
  .dodo-stage-character {
    display: block;
    width: 100%;
    height: 160px;
    object-fit: contain;
    margin-bottom: 24px;
  }
  @media (prefers-reduced-motion: reduce) {
    .dodo-stage-track {
      transition: none;
    }
  }
  @media (max-width: 768px) {
    .dodo-level-slider {
      padding: 24px 16px;
    }
    .dodo-stage-courses {
      grid-auto-flow: row;
      grid-template-columns: minmax(0, 1fr);
    }
    .dodo-stage-courses > .dodo-stage-course:only-child {
      max-width: 100%;
    }
    .dodo-stage-course {
      width: 100%;
    }
    .dodo-stage-nav button {
      padding: 8px 12px;
      font-size: 0.9em;
    }
    .dodo-stage-slide[aria-hidden='true'] {
      max-height: 0;
      overflow: hidden;
    }
  }

  .dodo-content-intro {
    padding: 40px;
  }

  .dodo-content-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    aspect-ratio: 16 / 9;
    margin-bottom: 24px;
    border-radius: 28px;
    background: #fff;
  }

  .dodo-content-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  .dodo-content-card {
    padding: 24px 24px 48px;
    border-radius: 28px;
    background-color: #d9e8f4;
    color: #365f80;
    background-image: url(${GlossyPoint.src}), url(${GlossyBackground.src});
    background-position:
      12px 12px,
      center;
    background-size:
      16px 16px,
      cover;
    background-repeat: no-repeat;
    &:nth-child(2) {
      background-color: #f7e8ad;
      color: #70551e;
    }
    &:nth-child(3) {
      background-color: #c5e8e3;
      color: #286660;
    }
    p {
      margin: 0;
      font-size: 1.1em;
      font-weight: 500;
      line-height: 1.2;
      word-break: keep-all;
    }
  }

  .dodo-content-label {
    margin: 0 0 12px;
    font-size: 1.3em;
    line-height: 1.5;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .dodo-content-intro {
      padding: 24px;
    }
    .dodo-content-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .dodo-logo {
    display: block;
    width: auto;
    max-width: 100%;
    height: 34px;
    margin-bottom: 32px;
  }

  .dodo-stage-course > strong {
    display: block;
    max-width: 360px;
    margin-inline: auto;
    word-break: keep-all;
  }
  .dodo-workbook-slider {
    padding: 32px;
    overflow: hidden;
    text-align: center;
    .dodo-workbook-count {
      font-size: 0.7em;
      font-weight: 600;
    }
  }
  .dodo-workbook-art {
    color: #70551e;
    border-radius: 28px;
    padding: 28px 16px;
    background-color: #fff6d6;
    background-image: url(${GlossyPoint.src}), url(${GlossyBackground.src});
    background-position:
      12px 12px,
      center;
    background-size:
      16px 16px,
      cover;
    background-repeat: no-repeat;
    img {
      display: block;
      width: 100%;
      height: 340px;
      object-fit: contain;
    }
  }
  .dodo-workbook-volumes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin: 0 0 20px;
    padding: 0;
    list-style: none;
    li {
      padding: 10px 18px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.55);
      font-size: 18px;
      font-weight: 700;
    }
  }
  .dodo-workbook-descriptions {
    display: grid;
    gap: 14px;
    max-width: 760px;
    margin: 24px auto 8px;
    padding: 0 24px;
    list-style: none;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.6;
    word-break: keep-all;
    li {
      text-align: center;
    }
    span {
      margin-right: 12px;
      font-weight: 800;
    }
  }
  .dodo-workbook-art-2 {
    background-color: #fbe4e9;
    color: #813b5c;
  }
  .dodo-workbook-art-3 {
    background-color: #e9e5f5;
    color: #5c4e80;
  }
  .dodo-workbook-art-4 {
    background-color: #e0f1e0;
    color: #35623b;
  }
  @media (max-width: 768px) {
    .dodo-workbook-slider {
      padding: 24px;
    }
    .dodo-workbook-art {
      padding: 24px 8px;
    }
    .dodo-workbook-art img {
      height: 200px;
    }
    .dodo-workbook-volumes {
      gap: 8px;
    }
    .dodo-workbook-volumes li {
      padding: 8px 12px;
      font-size: 14px;
    }
    .dodo-workbook-descriptions {
      padding: 0 12px;
      font-size: 15px;
      gap: 12px;
    }
  }

  @media (max-width: 1024px) {
    .hero-visual {
      height: auto;
      aspect-ratio: 16 / 9;
      width: 100%;
    }
    .hero-copy.dodo-hero-copy .dodo-logo {
      width: min(100%, 400px);
    }
    .dodo-hero-character {
      right: -16px;
    }
    .dodo-hero-character-left {
      right: auto;
      left: -16px;
    }
  }
  @media (max-width: 480px) {
    .hero {
      padding: 24px 16px 32px;
      gap: 24px;
    }
    .hero-copy.dodo-hero-copy .dodo-logo {
      width: min(100%, 240px);
    }
    .hero-copy.dodo-hero-copy .dodo-tagline {
      font-size: 18px;
      margin-bottom: 12px;
    }
    .hero-copy p:not(.eyebrow) {
      margin: 20px 0;
      font-size: 15px;
    }
    .dodo-stage-heading h3 {
      font-size: 22px;
    }
    .dodo-stage-heading strong {
      font-size: 14px;
    }
    .dodo-stage-course > strong {
      font-size: 15px;
      line-height: 1.5;
    }
    .dodo-stage-course-name h4 {
      font-size: 18px;
    }
    .dodo-stage-character {
      height: 140px;
      margin-bottom: 16px;
    }
    .dodo-content-card {
      padding: 20px 20px 28px;
    }
    .dodo-content-card h3 {
      font-size: 17px;
    }
    .dodo-content-card p {
      font-size: 15px;
      line-height: 1.5;
    }
    .dodo-content-intro,
    .dodo-workbook-slider {
      padding: 16px;
    }
    .dodo-stage-nav {
      gap: 6px;
    }
    .dodo-stage-nav button {
      min-height: 44px;
    }
    .dodo-level-controls button {
      padding: 0;
      font-size: 28px;
    }
    .dodo-workbook-art img {
      height: auto;
      min-height: 140px;
    }
    .dodo-workbook-volumes li {
      max-width: 100%;
      overflow-wrap: anywhere;
    }
    .dodo-workbook-descriptions {
      padding: 0 4px;
      word-break: normal;
    }
  }

  ${tabletL(`
    .dodo-logo { margin-inline: auto; }
  `)}

  @media (max-width: 768px) {
    /* HpMainStyled already supplies the page gutter; avoid nesting it. */
    padding-inline: 0;
    .dodo-level-slider,
    .dodo-workbook-slider {
      padding: 20px 12px;
    }
    .dodo-content-intro {
      padding: 12px;
    }
    .dodo-content-card {
      padding: 16px 16px 24px;
    }
    .dodo-content-image {
      margin-bottom: 16px;
    }
    .dodo-workbook-art {
      padding-inline: 0;
    }
    .dodo-stage-heading,
    .dodo-stage-nav {
      padding-inline: 12px;
    }
    .dodo-workbook-descriptions {
      padding-inline: 16px;
    }
  }
  @media (min-width: 600px) and (max-width: 1400px) {
    .dodo-desktop-only {
      display: block;
    }
    .dodo-mobile-only {
      display: none;
    }
    .hero-copy.dodo-hero-copy .dodo-logo {
      width: min(100%, 280px);
    }
    .dodo-content-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .dodo-content-intro {
      padding: 20px;
    }
    .dodo-content-card {
      padding: 14px 14px 24px;
    }
    .dodo-content-card h3 {
      font-size: 16px;
    }
    .dodo-content-card p {
      font-size: 14px;
      line-height: 1.5;
    }
    .dodo-stage-courses {
      grid-auto-flow: column;
      grid-template-columns: none;
      grid-auto-columns: minmax(0, 1fr);
    }
    .dodo-stage-course:only-child {
      max-width: 50%;
    }
    .dodo-stage-course {
      padding: 20px 14px;
    }
    .dodo-stage-course > strong {
      font-size: 14px;
    }
    .dodo-stage-course-name h4 {
      font-size: 18px;
    }
    .dodo-stage-heading h3 {
      font-size: 24px;
    }
    .dodo-stage-heading strong {
      font-size: 16px;
    }
    .dodo-stage-nav button {
      padding: 10px 14px;
      font-size: 13px;
    }
    .dodo-workbook-descriptions {
      font-size: 16px;
    }
  }
  @media (min-width: 600px) and (max-width: 1023px) and (orientation: portrait) {
    .dodo-desktop-only {
      display: none;
    }
    .dodo-mobile-only {
      display: block;
    }
    .dodo-content-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    .dodo-stage-courses {
      grid-auto-flow: row;
      grid-template-columns: minmax(0, 1fr);
    }
    .dodo-stage-course:only-child {
      max-width: 100%;
    }
    .dodo-stage-nav.dodo-level-controls button {
      padding: 0;
    }
    .dodo-level-waves {
      width: 1100px;
      max-width: none;
      height: 180px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

const hpNewsContentWidth = css`
  width: min(100%, 1080px);
  margin-inline: auto;
  padding-inline: 24px;
`

export const HpNewsStyled = styled.div`
  min-height: 70vh;
  background: #fff;

  .tabs-wrap {
    ${hpNewsContentWidth}
    padding-top: 12px;
    isolation: isolate;

    .tab.active {
      position: relative;
      z-index: 1;
    }
  }

  .board {
    ${hpNewsContentWidth}
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding-top: 40px;
    padding-bottom: 80px;
  }

  .board-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .news-list {
    margin: 0;
    padding: 12px 24px;
    border: 1px solid var(--line-color-primary);
    border-radius: 20px;
    background: #fff;
    list-style: none;
  }

  .news-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 40px;
    padding: 8px 4px;
    color: var(--font-color-primary);

    .title {
      min-width: 0;
      overflow: hidden;
      font-size: 0.9em;
      font-weight: 600;
      line-height: 1.4;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .date {
      flex-shrink: 0;
      color: var(--font-color-secondary);
      font-size: 0.8em;
      font-weight: 500;
    }

    &:hover .title,
    &.is-current .title {
      color: #00b4d8;
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0;
  }

  .page-button {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: var(--font-color-secondary);
    background: transparent;
    font-size: 0.9em;
    font-weight: 700;
    cursor: pointer;

    img {
      display: block;
      width: 16px;
      height: 16px;
    }

    &:hover,
    &:focus-visible {
      color: var(--font-color-primary);
      background: #f4f7fb;
    }

    &.is-active {
      color: #fff;
      background: var(--font-color-primary);
    }

    &:disabled {
      cursor: default;
      opacity: 0.28;
    }
  }

  .article {
    margin: 0;
    padding: 28px 32px 32px;
    border: 1px solid var(--line-color-primary);
    border-radius: 20px;
    background: #fff;
    overflow: hidden;
    scroll-margin-top: 92px;
  }

  .article-head {
    padding-bottom: 16px;
    border-bottom: 1px solid #e6ebf1;

    h1 {
      margin: 0;
      font-size: 1.8em;
      font-weight: 600;
      line-height: 1.4;
    }

    time {
      display: block;
      margin-top: 8px;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
    }
  }

  .article-file {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    color: var(--font-color-primary);
    font-size: 0.9em;
    font-weight: 500;
    text-decoration: none;

    .file-icon {
      flex-shrink: 0;
    }

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  .article-body {
    padding: 36px 0 12px;
    font-size: 1em;
    line-height: 1.8;

    img {
      max-width: 100%;
      height: auto;
    }

    &:has(.article-frame) {
      padding: 24px 0 0;
    }
  }

  .article-frame {
    width: 100%;
    border: 0;
    display: block;
    background: transparent;
  }

  .empty,
  .skeleton-row {
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--font-color-secondary);
  }

  .empty {
    margin: 0;
    padding: 20px 24px;
    border: 1px solid var(--line-color-primary);
    border-radius: 20px;
    font-size: 0.9em;
  }

  .skeleton-row span {
    display: block;
    border-radius: 6px;
    background: ${thumbnailSkeletonGradient};
    background-size: 200% 100%;
    animation: ${thumbnailShimmer} 1.4s linear infinite;
  }

  .skeleton-row .title {
    width: min(72%, 420px);
    height: 16px;
  }

  .skeleton-row .date {
    width: 92px;
    height: 14px;
  }

  ${tabletS(`
    .board { gap: 32px; padding-top: 32px; padding-bottom: 56px; }
    .news-item {
      min-height: 36px;
      gap: 10px;
      padding: 8px 0;
      .title { font-size: 0.8em; white-space: normal; }
      .date { font-size: 0.7em; }
    }
    .article { padding: 24px 20px; }
    .article-head h1 { font-size: 1.4em; }
  `)}

  ${phone(`
    .tabs-wrap,
    .board { padding-inline: 16px; }
  `)}
`

export const HpLeaderboardStyled = styled.div`
  min-height: 70vh;
  background: #fff;

  .tabs-wrap {
    ${hpNewsContentWidth}
    padding-top: 12px;
    isolation: isolate;

    .tab.active {
      position: relative;
      z-index: 1;
    }
  }

  .board {
    ${hpNewsContentWidth}
    display: flex;
    flex-direction: column;
    gap: 36px;
    padding-top: 32px;
    padding-bottom: 80px;
  }

  .page-title {
    margin: 0;
    color: var(--font-color-primary);
    font-size: 1.3em;
    font-weight: 800;
    line-height: 1.45;
  }

  .page-title.race-title,
  .page-title.review-title,
  .board.hof .page-title {
    font-weight: 500;
  }

  .stage-carousel {
    position: relative;
  }

  .stage-row {
    display: flex;
    gap: 12px;
    padding: 4px 52px 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-padding-inline: 52px;
    overscroll-behavior-x: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .stage-card {
    position: relative;
    width: 140px;
    min-height: 174px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 8px;
    border: 1px solid var(--line-color-gray);
    border-radius: 18px;
    background: #fff;
    color: var(--font-color-secondary);
    cursor: pointer;

    &:nth-child(n + 1):nth-child(-n + 4) {
      background-color: #eef8f2;
    }

    &:nth-child(n + 5):nth-child(-n + 8) {
      background-color: #eef5ff;
    }

    &:nth-child(n + 9):nth-child(-n + 12) {
      background-color: #fff0f5;
    }

    &:nth-child(n + 13):nth-child(-n + 16) {
      background-color: #f6effb;
    }

    &.is-locked > img,
    &.is-locked > strong,
    &.is-locked > span {
      opacity: 0.4;
    }

    .stage-number {
      position: absolute;
      top: 8px;
      left: 10px;
      font-family: var(--font-family-secondary);
      font-size: 0.8em;
      font-weight: 600;
      line-height: 1;
    }

    strong {
      color: var(--font-color-primary);
      font-size: 1em;
      font-weight: 800;
    }

    span:last-child {
      font-size: 1em;
      font-weight: 600;
    }

    &.is-active {
      border-color: #00b4d8;
      box-shadow: 0 0 0 1px #00b4d8;
      color: #00b4d8;

      strong {
        color: var(--font-color-primary);
      }
    }
  }

  .stage-placeholder {
    width: 82px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border: 1px dashed #cbd5df;
    border-radius: 14px;
    color: #b6c1cc;
    background:
      linear-gradient(135deg, rgb(255 255 255 / 45%), transparent),
      var(--color-gray-light);

    span {
      font-size: 0.6em !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em;
    }
  }

  .stage-card.is-active .stage-placeholder {
    border-color: #8fd7e8;
    color: #6cbfd3;
    background: #f1fbfd;
  }

  .stage-scroll-button {
    position: absolute;
    top: 50%;
    z-index: 2;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 1px solid var(--line-color-gray);
    border-radius: 50%;
    color: var(--font-color-primary);
    background: rgb(255 255 255 / 94%);
    cursor: pointer;
    transform: translateY(-50%);
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &.is-prev {
      left: 4px;
    }

    &.is-next {
      right: 4px;

      svg {
        transform: rotate(180deg);
      }
    }

    &:hover,
    &:focus-visible {
      border-color: #8fd7e8;
      background: #f1fbfd;
    }
  }

  .my-info {
    h2 {
      margin: 0 0 8px;
      font-size: 1em;
      font-weight: 800;
    }
  }

  .my-progress {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 12px;
    color: var(--font-color-primary);
    font-size: 0.9em;
    font-weight: 700;

    .my-progress-icon,
    .hof-progress-icon {
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }
  }

  .my-card,
  .leader-row {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }

  .my-card {
    min-height: 88px;
    padding: 16px 24px;
    border-radius: 22px;
    background: #e8f7fc;
  }

  .rank {
    color: var(--font-color-primary);
    font-size: 1.4em;
    font-weight: 800;
  }

  .who {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;

    img {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      object-fit: cover;
    }

    strong {
      display: block;
      overflow: hidden;
      font-size: 1em;
      font-weight: 800;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      display: block;
      color: var(--font-color-secondary);
      font-size: 0.8em;
      font-weight: 500;
    }
  }

  .points {
    color: #00b4d8;
    font-size: 1.1em;
    font-weight: 800;
    white-space: nowrap;
  }

  .leader-list {
    ol {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  }

  .list-head {
    margin-bottom: 8px;

    h2 {
      margin: 0;
      font-size: 1.3em;
      font-weight: 800;
    }

    p {
      margin: 8px 0 0;
      color: var(--font-color-secondary);
      font-size: 0.8em;
      font-weight: 500;
    }
  }

  .table-head {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) auto;
    gap: 12px;
    padding: 8px;
    color: var(--font-color-secondary);
    font-size: 0.8em;
    font-weight: 600;
  }

  .leader-row {
    padding: 16px 8px;
    border-top: 1px solid #eef2f6;
    overflow: visible;

    .rank {
      font-size: 1em;
    }

    .points {
      font-size: 1em;
    }
  }

  .avatar-wrap {
    position: relative;
    width: 52px;
    height: 52px;
    flex-shrink: 0;

    .crown {
      position: absolute;
      top: -8px;
      left: 50%;
      z-index: 1;
      transform: translateX(-50%);
    }
  }

  .more-button {
    width: 120px;
    min-height: 44px;
    display: grid;
    place-items: center;
    margin: 20px auto 0;
    border: 0;
    border-radius: 999px;
    color: #7a8ea3;
    background: #edf3f8;
    font-size: 0.9em;
    font-weight: 700;
    cursor: pointer;
  }

  .empty {
    margin: 24px 0 0;
    color: var(--font-color-secondary);
    font-size: 0.9em;
    text-align: center;
  }

  .hof-hero {
    position: relative;
    display: grid;
    place-items: center;
    height: 240px;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid #d4af37;
    background: #050505;

    &::before,
    &::after {
      content: '';
      position: absolute;
      pointer-events: none;
    }

    &::before {
      inset: -8%;
      z-index: 0;
      background: radial-gradient(
        ellipse 58% 72% at 50% 46%,
        rgba(255, 214, 110, 0.5) 0%,
        rgba(140, 78, 12, 0.22) 40%,
        transparent 70%
      );
      animation: ${hofHeroPulse} 5.6s ease-in-out infinite;
    }

    &::after {
      inset: 0;
      z-index: 0;
      background:
        radial-gradient(
          circle at 22% 38%,
          rgba(255, 186, 80, 0.22) 0%,
          transparent 42%
        ),
        linear-gradient(
          180deg,
          rgba(42, 24, 8, 0.55) 0%,
          rgba(8, 6, 4, 0.15) 100%
        );
      animation: ${hofHeroPulseAlt} 8.4s ease-in-out infinite;
    }

    img {
      position: relative;
      z-index: 2;
      width: auto;
      height: 180px;
      max-width: 90%;
      object-fit: contain;
      filter: drop-shadow(0 0 22px rgba(255, 206, 96, 0.35));
    }
  }

  .hof-waves {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    z-index: 1;
    width: 100%;
    height: 90px;
    pointer-events: none;
  }

  .hof-parallax > use {
    animation: ${hofHeroWaveDrift} 25s cubic-bezier(0.55, 0.5, 0.45, 0.5)
      infinite;
  }

  .hof-parallax > use:nth-child(1) {
    fill: rgba(232, 195, 90, 0.55);
    animation-delay: -2s;
    animation-duration: 7s;
  }

  .hof-parallax > use:nth-child(2) {
    fill: rgba(240, 204, 106, 0.4);
    animation-delay: -3s;
    animation-duration: 10s;
  }

  .hof-parallax > use:nth-child(3) {
    fill: rgba(246, 213, 107, 0.28);
    animation-delay: -4s;
    animation-duration: 13s;
  }

  .hof-parallax > use:nth-child(4) {
    fill: rgba(212, 175, 55, 0.72);
    animation-delay: -5s;
    animation-duration: 20s;
  }

  .hof-grade-label {
    color: #b8962e;
    font-weight: 700;
  }

  .hof-tiers {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
  }

  .hof-tier {
    position: relative;
    min-height: 148px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 8px;
    border: 1.5px solid;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;

    > * {
      position: relative;
      z-index: 1;
    }

    img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }

    strong {
      color: inherit;
      font-size: 0.8em;
      font-weight: 800;
    }

    span:last-child {
      font-size: 0.8em;
      font-weight: 600;
    }

    &.is-active {
      box-shadow:
        0 0 0 1px currentColor,
        0 8px 18px rgba(0, 0, 0, 0.12);

      &::before {
        content: '';
        position: absolute;
        inset: -70%;
        z-index: 0;
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          rgb(255 255 255 / 8%) 70deg,
          currentColor 145deg,
          rgb(255 255 255 / 42%) 205deg,
          transparent 285deg,
          transparent 360deg
        );
        opacity: 0.24;
        pointer-events: none;
        animation: ${hofTierGradientSpin} 4.5s linear infinite;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hof-tier.is-active::before {
      animation: none;
    }
  }

  .hof-tier-bronze {
    color: #5c4034;
    border-color: #886050;
    background: #f7efeb;

    &.is-active {
      background: linear-gradient(180deg, #f3e4dc 0%, #c9a090 100%);
      box-shadow:
        0 0 0 1px #886050,
        0 8px 18px rgba(136, 96, 80, 0.28);
    }
  }

  .hof-tier-silver {
    color: #4d555c;
    border-color: #98a0a8;
    background: #f1f3f5;

    &.is-active {
      background: linear-gradient(180deg, #eef1f4 0%, #b8c2cc 100%);
      box-shadow:
        0 0 0 1px #98a0a8,
        0 8px 18px rgba(152, 160, 168, 0.32);
    }
  }

  .hof-tier-gold {
    color: #7a5318;
    border-color: #d8a058;
    background: #faf2df;

    &.is-active {
      background: linear-gradient(180deg, #f8e8c4 0%, #e0b066 100%);
      box-shadow:
        0 0 0 1px #d8a058,
        0 8px 18px rgba(216, 160, 88, 0.32);
    }
  }

  .hof-tier-platinum {
    color: #3a4f5a;
    border-color: #688090;
    background: #edf3f5;

    &.is-active {
      background: linear-gradient(180deg, #e4eef2 0%, #9eb6c2 100%);
      box-shadow:
        0 0 0 1px #688090,
        0 8px 18px rgba(104, 128, 144, 0.3);
    }
  }

  .hof-tier-titanium {
    color: #45456a;
    border-color: #8080a8;
    background: #f0f0f7;

    &.is-active {
      background: linear-gradient(180deg, #e8e8f2 0%, #b0b0d0 100%);
      box-shadow:
        0 0 0 1px #8080a8,
        0 8px 18px rgba(128, 128, 168, 0.3);
    }
  }

  .hof-intro {
    padding: 28px 32px;
    border: 1px solid #d4af37;
    border-radius: 20px;
    background: #fff;

    h2 {
      margin: 0;
      font-size: 1.3em;
      font-weight: 800;
    }

    p {
      margin: 12px 0 0;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      line-height: 1.7;
    }

    h3 {
      margin: 24px 0 8px;
      font-size: 1em;
      font-weight: 800;
    }

    ol {
      margin: 0;
      padding-left: 20px;
      color: var(--font-color-primary);
      font-size: 0.9em;
      line-height: 1.8;
    }
  }

  .hof-note {
    color: var(--font-color-secondary) !important;
    font-size: 0.8em !important;
  }

  .hof-apply {
    display: inline-flex;
    margin-top: 16px;
    padding: 0;
    border: 0;
    color: #b8962e;
    background: none;
    font-size: 0.9em;
    font-weight: 700;
    cursor: pointer;
  }

  .hof .more-button {
    color: #8a7340;
    background: #f4ead0;
  }

  .hof-table-head,
  .hof-row {
    display: grid;
    grid-template-columns: 72px minmax(0, 1.6fr) 1fr 0.8fr auto;
    align-items: center;
    gap: 12px;
  }

  .hof-table-head {
    padding: 8px 16px;
    color: var(--font-color-secondary);
    font-size: 0.8em;
    font-weight: 600;
  }

  .hof-row {
    padding: 16px;
    border-top: 1px solid #efe4c4;

    .rank {
      display: grid;
      place-items: center;
      font-size: 1em;

      img {
        width: 36px;
        height: 36px;
        object-fit: contain;
      }
    }

    .points {
      color: #c9a227;
      font-size: 1em;
    }

    &.is-me {
      min-height: 88px;
      border: 1px solid #d4af37;
      border-radius: 22px;
      background: #fff;
    }
  }

  .hof-date,
  .hof-books {
    color: var(--font-color-primary);
    font-size: 0.9em;
    font-weight: 600;
    white-space: nowrap;
  }

  .hof-overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(15, 23, 32, 0.45);
  }

  .hof-dialog {
    width: min(720px, 100%);
    max-height: 86vh;
    overflow: auto;
    border: 1px solid #d4af37;
    border-radius: 20px;
    background: linear-gradient(180deg, #fffdf8 0%, #f7eed6 100%);

    iframe {
      width: 100%;
      height: 870px;
      border: 0;
    }
  }

  .hof-dialog-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px;
    border-bottom: 1px solid var(--line-color-primary);

    strong {
      font-size: 1em;
    }

    button {
      border: 0;
      color: var(--font-color-secondary);
      background: none;
      font-size: 0.9em;
      font-weight: 700;
      cursor: pointer;
    }
  }

  .review-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;
  }

  .review-card {
    width: 100%;
    padding: 24px;
    border: 1px solid var(--line-color-primary);
    border-radius: 20px;
    background: #fff;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;

    h2 {
      margin: 0;
      font-size: 1.1em;
      font-weight: 800;
    }

    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin: 8px 0 0;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      line-height: 1.6;
    }
  }

  .review-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 16px;
    color: var(--font-color-secondary);
    font-size: 0.8em;
    font-weight: 600;
  }

  .review-status {
    margin: 0;
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
  }

  .review-overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(0, 0, 0, 0.5);
  }

  .review-dialog {
    width: 100%;
    max-width: 600px;
    min-height: 300px;
    max-height: calc(100svh - 20px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 20px;
    background: #fff;
    box-sizing: border-box;
  }

  .review-dialog-head {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px;
    border-bottom: 1px solid var(--line-color-primary);

    .title {
      min-width: 120px;
      color: var(--font-color-primary);
      font-family: var(--font-family-secondary);
      font-size: 1.2em;
      font-weight: 800;
    }

    .btn-close {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background-color: var(--color-gray-light);
      cursor: pointer;
    }
  }

  .review-dialog-body {
    flex: 1 1 auto;
    min-height: 0;
    padding: 24px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .review-article-title {
    margin: 0;
    color: var(--font-color-primary);
    font-family: var(--font-family-secondary);
    font-size: 1.1em;
    font-weight: 800;
    line-height: 1.45;
  }

  .review-article-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    color: var(--font-color-secondary);
    font-size: 0.8em;
    font-weight: 600;
  }

  .review-article-sub {
    margin: 8px 0 0;
    color: var(--font-color-secondary);
    font-size: 0.8em;
    font-weight: 600;
  }

  .review-html {
    margin-top: 20px;
    color: var(--font-color-primary);
    font-size: 0.9em;
    line-height: 1.75;
    word-break: break-word;

    p {
      margin: 0 0 12px;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }

  ${tabletS(`
    .page-title { font-size: 1.1em; }
    .board { gap: 28px; padding-top: 24px; padding-bottom: 56px; }
    .stage-row { padding-inline: 44px; scroll-padding-inline: 44px; }
    .stage-card { width: 126px; min-height: 160px; }
    .stage-placeholder { width: 72px; }
    .stage-scroll-button {
      width: 36px;
      height: 36px;
      &.is-prev { left: 0; }
      &.is-next { right: 0; }
    }
    .my-card,
    .leader-row,
    .table-head { grid-template-columns: 48px minmax(0, 1fr) auto; }
    .rank { font-size: 1em; }
    .points { font-size: 0.9em; }
    .who {
      gap: 12px;
      > div:first-child {
        width: 44px !important;
        height: 44px !important;
        flex: 0 0 44px;
      }
      > div:last-child { min-width: 0; }
      img { width: 44px; height: 44px; }
      strong { font-size: 0.9em; }
    }
    .avatar-wrap {
      width: 44px;
      height: 44px;
      > div {
        width: 100% !important;
        height: 100% !important;
      }
    }
    .review-card { padding: 16px; }
    .hof-hero {
      height: 240px;
      border-radius: 16px;

      img { height: 180px; }
    }
    .hof-tiers { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .hof-intro { padding: 24px 20px; }
    .hof-table-head,
    .hof-row { grid-template-columns: 48px minmax(0, 1fr) auto; }
    .hof-table-head span:nth-child(3),
    .hof-table-head span:nth-child(4),
    .hof-date,
    .hof-books { display: none; }
    .hof-dialog iframe { height: 70vh; }
  `)}

  ${phone(`
    .tabs-wrap,
    .board { padding-inline: 16px; }
    .review-dialog {
      width: 100%;
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      min-height: unset;
      border-radius: 0;
    }
    .review-dialog-body {
      padding: 20px 20px calc(20px + env(safe-area-inset-bottom, 0px));
    }
  `)}
`

export const HpMembershipStyled = styled.div`
  min-height: 70vh;
  background: #fff;
  font-family: var(--font-family-secondary);

  .tabs-wrap {
    ${hpNewsContentWidth}
    padding-top: 12px;
    isolation: isolate;

    .tab.active {
      position: relative;
      z-index: 1;
    }
  }

  .board {
    ${hpNewsContentWidth}
    display: flex;
    flex-direction: column;
    gap: 48px;
    padding-top: 36px;
    padding-bottom: 80px;
  }

  .back-nav {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    border: 0;
    padding: 0;
    color: var(--font-color-secondary);
    background: none;
    font-size: 1.2em;
    font-weight: 600;
    cursor: pointer;

    img {
      display: block;
    }
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    color: var(--font-color-primary);
    font-size: 1.1em;
    font-weight: 800;

    &::before {
      content: '· ';
    }
  }

  .member-box {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px 28px;
    border-radius: 20px;
    background: var(--color-gray-light);
  }

  .member-row {
    display: grid;
    grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
    gap: 12px 24px;
    align-items: baseline;

    span,
    strong {
      color: var(--font-color-primary);
      font-size: 0.9em;
    }

    span {
      font-weight: 800;
    }

    strong {
      font-weight: 600;
    }
  }

  .product-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .product-card {
    position: relative;
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 28px 32px 24px;
    border: 1px solid var(--line-color-gray);
    border-radius: 20px;
    background: #fff;

    &.is-featured,
    &.is-selected {
      border-width: 2px;
      border-color: var(--font-color-primary);
    }

    h3 {
      margin: 0;
      color: var(--font-color-primary);
      font-size: 1.5em;
      font-weight: 800;
      line-height: 1.35;
      letter-spacing: -0.025em;
    }

    dl {
      display: flex;
      flex-direction: column;
      gap: 13px;
      margin: 20px 0 0;
      padding: 20px;
      border-radius: 14px;
      background: var(--color-gray-light);

      div {
        display: grid;
        grid-template-columns: 88px minmax(0, 1fr);
        gap: 12px;
        align-items: baseline;
      }

      dt {
        color: var(--font-color-secondary);
        font-size: 1em;
        font-weight: 800;
      }

      dd {
        margin: 0;
        color: var(--font-color-primary);
        font-size: 1.1em;
        font-weight: 800;
        letter-spacing: -0.015em;
      }

      div:last-child dd {
        font-size: 1.2em;
      }
    }
  }

  .discount {
    color: var(--color-red-medium);
    font-style: normal;
    font-weight: 800;
  }

  .product-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 44px;

    h3 {
      min-width: 0;
    }
  }

  .product-card.has-event .product-title-row {
    padding-left: 72px;
  }

  .best-badge {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    color: #e39b20;
    font-size: 1em;
    font-weight: 800;

    &::before {
      content: '👍';
    }
  }

  .gift-label {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 1.25em;
    margin: 16px 0 0;
    color: #e39b20;
    font-size: 1em;
    font-weight: 800;
  }

  .product-event-badge {
    position: absolute;
    top: -14px;
    left: -14px;
    z-index: 1;
    width: 112px;
    height: 90px;
    pointer-events: none;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .product-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: auto;
    padding-top: 24px;
  }

  .detail-link {
    border: 0;
    color: var(--font-color-light-blue);
    background: none;
    font-size: 1em;
    font-weight: 800;
    cursor: pointer;
  }

  .select-button {
    min-width: 126px;
    height: 46px;
    padding: 0 24px;
    border: 0;
    border-radius: 12px;
    color: #fff;
    background: var(--color-red-medium);
    font-size: 1em;
    font-weight: 800;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: var(--color-red-strong);
    }
  }

  .status {
    margin: 0 0 16px;
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
  }

  .section-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 16px;
    margin-bottom: 16px;

    .section-title {
      margin: 0;
    }
  }

  .section-help {
    margin: 0;
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
  }

  .ticket-input-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: fit-content;
    max-width: 100%;
  }

  .ticket-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ticket-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .ticket-field {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .ticket-input {
    width: 88px;
    height: 48px;
    border: 1px solid var(--line-color-gray);
    border-radius: 12px;
    color: var(--font-color-primary);
    background: #fff;
    font-size: 1em;
    font-weight: 700;
    text-align: center;

    &::placeholder {
      color: var(--font-color-secondary);
      font-weight: 600;
    }
  }

  .ticket-dash {
    color: var(--font-color-secondary);
    font-size: 1.1em;
    font-weight: 700;
  }

  .ticket-add {
    display: flex;
    justify-content: center;

    button {
      border: 0;
      padding: 0;
      color: var(--font-color-light-blue);
      background: none;
      font-size: 0.9em;
      font-weight: 700;
      cursor: pointer;
    }
  }

  .ticket-notes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 8px 0 0;
    padding: 0;
    color: var(--font-color-secondary);
    font-size: 0.8em;
    font-weight: 600;
    list-style: none;

    li {
      padding-left: 12px;
      position: relative;

      &::before {
        position: absolute;
        left: 0;
        content: '•';
      }
    }
  }

  .ticket-actions {
    display: flex;
    justify-content: center;

    .pay-button {
      min-width: 200px;
    }

    .pay-button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .history-table {
    border: 1px solid var(--line-color-primary);
    border-radius: 20px;
    overflow: hidden;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li,
    .history-head {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) 0.9fr 0.9fr 0.8fr;
      gap: 12px;
      padding: 16px 20px;
    }

    .history-head {
      color: var(--font-color-secondary);
      background: var(--color-gray-light);
      font-size: 0.8em;
      font-weight: 700;
    }

    li {
      border-top: 1px solid var(--line-color-primary);
      font-size: 0.9em;
      font-weight: 600;
    }

    &.is-unpaid {
      li,
      .history-head {
        grid-template-columns:
          minmax(0, 1.5fr) minmax(0, 0.9fr) minmax(0, 0.9fr)
          minmax(0, 0.9fr) auto;
        align-items: center;
      }

      li span:last-child {
        justify-self: end;
      }
    }
  }

  .history-pay {
    min-width: 72px;
    height: 36px;
    padding: 0 16px;
    border: 0;
    border-radius: 10px;
    color: #fff;
    background: var(--color-red-medium);
    font-size: 0.85em;
    font-weight: 800;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: var(--color-red-strong);
    }
  }

  .unpaid-pay {
    .pay-methods {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .pay-method {
      min-width: 0;
      height: auto;
      padding: 12px 16px;
      line-height: 1.3;
      white-space: normal;

      &.is-active {
        padding-right: 36px;
      }
    }

    .unpaid-pay-help {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 0;
      color: var(--font-color-secondary);
      font-size: 0.85em;
      font-weight: 600;
      line-height: 1.5;

      strong {
        color: var(--font-color-primary);
        font-weight: 700;
      }
    }

    .unpaid-pay-fields {
      display: flex;
      flex-direction: column;
      gap: 10px;

      input {
        width: 100%;
        height: 52px;
        padding: 0 16px;
        border: 1px solid var(--line-color-gray);
        border-radius: 14px;
        color: var(--font-color-primary);
        background: #fff;
        font-size: 0.9em;
        font-weight: 700;
      }
    }

    .pay-button {
      align-self: center;
    }
  }

  .refund-frame {
    width: 100%;
    overflow: hidden;
    border-radius: 20px;
    background: #fff;

    iframe {
      width: 100%;
    }
  }

  .hp-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: rgb(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .hp-modal {
    width: 100%;
    max-width: 600px;
    min-height: 300px;
    max-height: calc(100svh - 20px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 24px 70px rgb(0 0 0 / 22%);
  }

  .hp-modal-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px;
    border-bottom: 1px solid var(--line-color-primary);

    h2 {
      min-width: 120px;
      margin: 0;
      color: var(--font-color-primary);
      font-size: 1.2em;
      font-weight: 800;
    }
  }

  .hp-modal-close {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: var(--font-color-primary);
    background: var(--color-gray-light);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;

    svg {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }

    &:hover,
    &:focus-visible {
      background: var(--color-gray-medium);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .hp-modal-body {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 24px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .ticket-result {
    gap: 32px;
  }

  .ticket-result-title {
    margin: 0;
    color: var(--font-color-primary);
    font-size: 1.05em;
    font-weight: 800;
    line-height: 1.45;
  }

  .ticket-result-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      flex-direction: column;
      gap: 6px;

      h4 {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0;
        color: var(--color-red-medium);
        font-size: 0.9em;
        font-weight: 800;
        line-height: 1.4;
      }

      .ticket-result-mark {
        width: 15px;
        height: 15px;
        flex-shrink: 0;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      &.is-success h4 {
        color: #02ba26;
      }
    }
  }

  .ticket-result-code {
    margin: 0;
    color: var(--font-color-primary);
    font-size: 1em;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .ticket-result-note {
    display: flex;
    flex-direction: column;
    gap: 4px;

    p {
      margin: 0;
      color: var(--font-color-primary);
      font-size: 0.85em;
      font-weight: 400;
      line-height: 1.6;
    }
  }

  .product-detail-hero {
    position: relative;
    padding: 24px;
    overflow: hidden;
    border: 1px solid #dce8ff;
    border-radius: 18px;
    background: linear-gradient(135deg, #f3f7ff 0%, #eef8ff 100%);

    &::after {
      content: '';
      position: absolute;
      top: -45px;
      right: -35px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgb(77 139 255 / 10%);
    }

    .product-detail-eyebrow {
      position: relative;
      z-index: 1;
      display: block;
      margin-bottom: 8px;
      color: var(--font-color-dark-blue);
      font-size: 0.7em;
      font-weight: 800;
      letter-spacing: 0.08em;
    }

    h3 {
      position: relative;
      z-index: 1;
      margin: 0;
      padding-right: 88px;
      color: var(--font-color-primary);
      font-size: 1.3em;
      font-weight: 800;
      line-height: 1.4;
    }

    .product-detail-period {
      position: relative;
      z-index: 1;
      display: inline-flex;
      margin-top: 16px;
      padding: 8px 12px;
      border-radius: 999px;
      color: #315fae;
      background: #fff;
      font-size: 0.8em;
      font-weight: 800;
      box-shadow: 0 4px 12px rgb(56 102 180 / 10%);
    }
  }

  .product-detail-price {
    padding: 20px;
    border: 1px solid var(--line-color-primary);
    border-radius: 18px;
    background: #fff;

    .price-section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      strong {
        font-size: 1em;
        font-weight: 800;
      }

      span {
        padding: 4px 8px;
        border-radius: 999px;
        color: var(--color-red-medium);
        background: #fff1f1;
        font-size: 0.7em;
        font-weight: 800;
      }
    }

    dl {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0 0;

      div {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
      }

      dt {
        color: var(--font-color-secondary);
        font-size: 0.8em;
        font-weight: 600;
      }

      dd {
        margin: 0;
        color: var(--font-color-primary);
        font-size: 0.9em;
        font-weight: 700;
        text-align: right;
      }

      .original-price {
        color: var(--font-color-secondary);
        text-decoration: line-through;
      }

      .discount-price {
        color: var(--color-red-medium);
      }

      .total-price-row {
        margin-top: 4px;
        padding-top: 16px;
        border-top: 1px dashed var(--line-color-primary);

        dt {
          color: var(--font-color-primary);
          font-weight: 800;
        }

        dd {
          color: var(--color-red-medium);
          font-size: 1.2em;
          font-weight: 800;
        }
      }
    }
  }

  .product-detail-benefit,
  .product-detail-notice {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: 14px;

    > span {
      flex-shrink: 0;
    }

    strong {
      display: block;
      margin-bottom: 4px;
      font-size: 0.8em;
      font-weight: 800;
    }

    p {
      margin: 0;
      color: var(--font-color-secondary);
      font-size: 0.8em;
      font-weight: 600;
      line-height: 1.55;
    }
  }

  .product-detail-benefit {
    border: 1px solid #ffe4b8;
    background: #fff9ef;
  }

  .product-detail-notice {
    background: var(--color-gray-light);

    > span {
      width: 20px;
      height: 20px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #fff;
      background: var(--font-color-dark-blue);
      font-size: 0.7em;
      font-weight: 800;
    }
  }

  .hp-modal-footer {
    flex-shrink: 0;
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    gap: 10px;
    padding: 16px 20px calc(16px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid var(--line-color-primary);
    background: #fff;

    button {
      min-height: 50px;
      padding: 0 16px;
      border-radius: 999px;
      font-size: 0.9em;
      font-weight: 800;
      cursor: pointer;
    }

    .modal-secondary-button {
      border: 1px solid var(--line-color-primary);
      color: var(--font-color-primary);
      background: #fff;
    }

    .modal-primary-button {
      border: 0;
      color: #fff;
      background: var(--color-red-medium);

      &:hover,
      &:focus-visible {
        background: var(--color-red-strong);
      }
    }
  }

  .checkout-board {
    gap: 36px;
  }

  .phone-value {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .phone-change {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 4px;
  }

  .phone-change-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .phone-change-title {
    margin: 0;
    color: var(--font-color-light-blue);
    font-size: 0.9em;
    font-weight: 700;
  }

  .phone-pill {
    display: flex;
    align-items: center;
    min-height: 52px;
    padding: 0 8px 0 20px;
    border-radius: 999px;
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--line-color-gray);

    input {
      flex: 1;
      min-width: 0;
      height: 52px;
      border: 0;
      background: transparent;
      color: var(--font-color-primary);
      font-size: 0.9em;
      font-weight: 600;
      outline: none;

      &::placeholder {
        color: var(--font-color-secondary);
        font-weight: 500;
      }
    }

    button {
      flex-shrink: 0;
      min-width: 40px;
      height: 40px;
      padding: 0 16px;
      border: 0;
      background: none;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        color: var(--font-color-light-blue);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }

  .phone-note {
    margin: 0;
    color: var(--font-color-secondary);
    font-size: 0.8em;
    font-weight: 600;

    &.is-error {
      color: var(--color-red-medium);
    }
  }

  .buyer-split {
    height: 1px;
    margin: 4px 0;
    background: var(--line-color-primary);
  }

  .period-group {
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      margin: 0;
      font-size: 0.9em;
      font-weight: 800;
    }
  }

  .agree-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .agree-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--font-color-primary);
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;

    input {
      appearance: none;
      width: 20px;
      height: 20px;
      position: relative;
      flex-shrink: 0;
      border: 1px solid var(--line-color-gray);
      border-radius: 6px;
      background: #fff;
    }

    &.is-checked input {
      border-color: var(--font-color-light-blue);
      background: var(--font-color-light-blue);

      &::after {
        position: absolute;
        top: 2px;
        left: 6px;
        width: 5px;
        height: 10px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        content: '';
      }
    }
  }

  .pay-methods {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .pay-method {
    position: relative;
    min-height: 56px;
    border: 1px solid var(--line-color-gray);
    border-radius: 16px;
    color: var(--font-color-primary);
    background: #fff;
    font-size: 0.9em;
    font-weight: 800;
    cursor: pointer;

    &.is-active {
      border-color: var(--font-color-light-blue);
      color: var(--font-color-dark-blue);
      background: var(--color-light-blue-opacity-10);
      box-shadow: inset 0 0 0 1px var(--font-color-light-blue);

      &::after {
        position: absolute;
        top: 50%;
        right: 16px;
        width: 7px;
        height: 12px;
        border: solid var(--font-color-light-blue);
        border-width: 0 2px 2px 0;
        transform: translateY(-60%) rotate(45deg);
        content: '';
      }
    }
  }

  .coupon-field {
    position: relative;
    max-width: 100%;

    &.is-valid::after {
      position: absolute;
      top: 50%;
      right: 18px;
      width: 7px;
      height: 12px;
      border: solid var(--font-color-light-blue);
      border-width: 0 2px 2px 0;
      transform: translateY(-60%) rotate(45deg);
      content: '';
    }
  }

  .coupon-input {
    width: 100%;
    height: 52px;
    padding: 0 48px 0 16px;
    border: 1px solid var(--line-color-gray);
    border-radius: 14px;
    color: var(--font-color-primary);
    background: #fff;
    font-size: 0.9em;
    font-weight: 700;
  }

  .coupon-message {
    margin: 8px 0 0;
    color: #e39b20;
    font-size: 0.8em;
    font-weight: 700;
  }

  .checkout-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    text-align: right;

    .status {
      margin: 0;
    }
  }

  .checkout-total {
    margin: 0;
    color: var(--font-color-primary);
    font-size: 1.3em;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .checkout-bill {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    min-width: 220px;

    p {
      margin: 0;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
    }
  }

  .checkout-summary-line {
    height: 1px;
    margin: 4px 0;
    background: var(--line-color-gray);
  }

  .pay-button {
    min-width: 168px;
    height: 52px;
    margin-top: 8px;
    padding: 0 40px;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: var(--color-red-medium);
    font-size: 1em;
    font-weight: 700;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: var(--color-red-strong);
    }
  }

  ${tabletS(`
    .board { gap: 36px; padding-top: 24px; padding-bottom: 56px; }
    .member-row { grid-template-columns: 1fr; gap: 4px; }
    .product-list { grid-template-columns: 1fr; }
    .product-event-badge {
      top: -10px;
      left: -10px;
      width: 84px;
      height: 68px;
    }
    .product-card.has-event .product-title-row { padding-left: 58px; }
    .product-card {
      padding: 20px;
      h3 { font-size: 1.3em; }
      dl {
        gap: 11px;
        padding: 16px;
        dt { font-size: 0.9em; }
        dd { font-size: 1em; }
        div:last-child dd { font-size: 1.1em; }
      }
      dl div { grid-template-columns: 72px minmax(0, 1fr); }
    }
    .history-table {
      li,
      .history-head {
        grid-template-columns: minmax(0, 1.2fr) 0.8fr 0.8fr 0.7fr;
        padding: 16px 12px;
        font-size: 0.8em;
      }

      &.is-unpaid {
        li,
        .history-head {
          grid-template-columns: minmax(0, 1.2fr) 0.7fr 0.8fr 0.8fr auto;
        }
      }
    }
    .pay-methods { grid-template-columns: 1fr; }
    .phone-pill {
      min-height: 48px;
      padding: 0 8px 0 16px;

      input { height: 48px; font-size: 0.8em; }
      button { height: 40px; font-size: 0.8em; }
    }
  `)}

  ${phone(`
    .tabs-wrap,
    .board { padding-inline: 16px; }
    .history-head { display: none; }
    .history-table li,
    .history-table.is-unpaid li {
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .history-table.is-unpaid li span:last-child { justify-self: start; }
    .ticket-input-block { width: 100%; }
    .ticket-row { flex-wrap: nowrap; }
    .ticket-field { flex: 1; min-width: 0; }
    .ticket-input { width: 100%; height: 44px; font-size: 0.9em; }
    .checkout-total { font-size: 1.1em; }
    .hp-modal-overlay { padding: 0; }
    .hp-modal {
      width: 100%;
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      min-height: unset;
      border-radius: 0;
    }
    .hp-modal-header {
      padding: calc(16px + env(safe-area-inset-top, 0px)) 16px 16px;
      h2 { font-size: 1.2em; }
    }
    .hp-modal-body { padding: 20px 16px; }
    .product-detail-hero {
      padding: 20px;
      h3 { padding-right: 40px; font-size: 1.1em; }
    }
    .product-detail-price { padding: 16px; }
    .hp-modal-footer {
      grid-template-columns: 0.8fr 1.2fr;
      padding-inline: 16px;
    }
  `)}
`

export const HpAccountSelectStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;

  .chrome {
    width: 100%;
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
  }

  .chrome.is-dedicated {
    justify-content: flex-end;
  }

  .home-button {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    color: var(--font-color-primary);
    background: transparent;
    cursor: pointer;

    img {
      display: block;
    }
  }

  .language-select {
    position: relative;
  }

  .language-button {
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 4px;
    border: 0;
    color: var(--font-color-primary);
    background: transparent;
    font-size: 1em;
    font-weight: 700;
    cursor: pointer;

    img {
      display: block;
    }
  }

  .language-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 20;
    min-width: 148px;
    margin: 0;
    padding: 8px;
    border: 1px solid var(--line-color-primary);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 12px 28px rgb(32 48 72 / 12%);
    list-style: none;

    button {
      width: 100%;
      min-height: 40px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      border: 0;
      border-radius: 10px;
      color: var(--font-color-primary);
      background: transparent;
      font-size: 0.9em;
      font-weight: 700;
      text-align: left;
      cursor: pointer;

      &:hover,
      &:focus-visible,
      &.is-active {
        background: var(--color-gray-light);
      }
    }
  }

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
    width: min(100%, 800px);
    margin: 0 auto;
    padding: 24px 24px 48px;
  }

  h1 {
    color: var(--font-color-primary);
    font-size: 2em;
    font-weight: 800;
    line-height: 1.35;
    text-align: center;
    letter-spacing: -0.03em;
  }

  .grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .card {
    min-height: 124px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border: 1px solid var(--line-color-gray);
    border-radius: 28px;
    color: inherit;
    background: #fff;
    font-family: inherit;
    font-size: 1em;
    text-align: left;
    text-decoration: none;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      border-color: var(--color-gray-opacity-70);
    }
  }

  .card-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    font-family: inherit;
    font-size: 1em;
    text-align: left;
    cursor: pointer;
  }

  .avatar {
    flex-shrink: 0;
    width: 88px;
    height: 88px;
    overflow: hidden;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--color-gray-light);

    img {
      width: 88px;
      height: 88px;
      object-fit: cover;
    }

    &.user {
      position: relative;
      width: 88px;
      height: 88px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }

    &.trial {
      position: relative;
      padding: 0;
      border-radius: 20px;
      background: transparent;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &.plus {
      background: #eceff3;

      svg {
        width: 28px;
        height: 28px;
        fill: none;
        stroke: var(--color-gray-strong);
        stroke-linecap: round;
        stroke-width: 2.4;
      }
    }
  }

  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .school {
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
      line-height: 1.3;
    }

    strong {
      color: var(--font-color-primary);
      font-size: 1.3em;
      font-weight: 800;
      line-height: 1.35;
    }

    .sub {
      overflow: hidden;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
      line-height: 1.4;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .card-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 2px;
    color: var(--font-color-secondary);
  }

  .more {
    position: relative;
  }

  .icon-button {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .more-menu {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: 12;
    min-width: 280px;
    margin: 0;
    padding: 8px 0;
    border: 1px solid var(--line-color-primary);
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 12px 28px rgb(32 48 72 / 12%);
    list-style: none;

    li + li {
      border-top: 1px solid var(--line-color-primary);
    }

    button {
      width: 100%;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 8px 16px;
      border: 0;
      color: var(--font-color-primary);
      background: transparent;
      font-size: 0.9em;
      font-weight: 700;
      text-align: left;
      cursor: pointer;

      img {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
      }

      &:hover,
      &:focus-visible {
        background: var(--color-gray-light);
      }

      &.is-muted {
        color: #b3b9c2;
      }
    }
  }

  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px 16px 32px;
    text-align: center;

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 4px 16px;

      a {
        color: var(--font-color-secondary);
        font-size: 0.8em;
        font-weight: 500;
      }
    }

    p {
      color: var(--font-color-secondary);
      font-size: 0.8em;
      font-weight: 500;
    }
  }

  .body.is-enter {
    width: min(100%, 420px);
    gap: 0;
  }

  .enter {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;

    h1 {
      font-size: 2em;
    }
  }

  .enter-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    strong {
      margin-top: 8px;
      color: var(--font-color-primary);
      font-size: 1.8em;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .enter-id {
      color: var(--font-color-secondary);
      font-size: 1.2em;
      font-weight: 600;
    }
  }

  .enter-avatar {
    position: relative;
    width: 128px;
    height: 128px;
    overflow: hidden;
    border-radius: 50%;
    background: #f3f5f8;

    img {
      object-fit: cover;
    }
  }

  .enter-field {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 4px 8px 4px 24px;
    border: 1px solid var(--line-color-gray);
    border-radius: 999px;
    background: #fff;

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--font-color-primary);
      font-size: 1em;
      font-weight: 700;
      letter-spacing: 0.18em;

      &::placeholder {
        color: var(--font-color-secondary);
        font-size: 1em;
        font-weight: 600;
        letter-spacing: 0;
        opacity: 1;
      }
    }
  }

  .enter-go {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: var(--color-red-medium);
    cursor: pointer;

    svg {
      display: block;
    }
  }

  .enter-options {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 12px 28px;

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 700;
      cursor: pointer;

      &.is-on {
        color: var(--font-color-primary);
      }

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }

      img {
        display: block;
        pointer-events: none;
      }
    }
  }

  .enter-find {
    color: var(--font-color-light-blue);
    font-size: 0.9em;
    font-weight: 700;
  }

  .enter-status {
    color: var(--font-color-secondary);
    font-size: 1em;
    font-weight: 700;
  }

  .body.is-add {
    width: min(100%, 600px);
    gap: 20px;
  }

  .add-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .country-select {
    position: relative;
    align-self: center;
  }

  .country-button {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 4px;
    border: 0;
    color: var(--font-color-secondary);
    background: transparent;
    font-family: inherit;
    font-size: 1em;
    font-weight: 700;
    cursor: pointer;

    img {
      display: block;
      transition: transform 0.15s ease;
    }
  }

  .country-select.is-open .country-button img {
    transform: rotate(180deg);
  }

  .country-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    z-index: 20;
    min-width: 180px;
    margin: 0;
    padding: 8px;
    border: 1px solid var(--line-color-primary);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 12px 28px rgb(32 48 72 / 12%);
    list-style: none;
    transform: translateX(-50%);

    button {
      width: 100%;
      min-height: 40px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      border: 0;
      border-radius: 10px;
      color: var(--font-color-primary);
      background: transparent;
      font-family: inherit;
      font-size: 0.9em;
      font-weight: 700;
      text-align: left;
      cursor: pointer;

      &:hover,
      &:focus-visible,
      &.is-active {
        background: #f4f7fb;
      }
    }
  }

  .add-panel {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 28px 28px 24px;
    border: 1px solid var(--line-color-gray);
    border-radius: 24px;
    background: #fff;
    text-align: left;
    text-decoration: none;

    h2 {
      color: var(--font-color-primary);
      font-size: 1.3em;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    p {
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
      line-height: 1.55;
    }
  }

  .add-hint {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    margin-top: 8px;
    padding: 4px 24px;
    color: var(--font-color-primary);
    font-size: 0.9em;
    font-weight: 600;
    line-height: 1.55;
    .required {
      margin-right: 4px;
      color: var(--color-red-medium);
    }
  }

  .add-field {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    margin-top: 8px;
    padding: 4px 8px 4px 24px;
    border: 1px solid var(--line-color-gray);
    border-radius: 999px;
    background: #fff;

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--font-color-primary);
      font-size: 1em;
      font-weight: 700;

      &::placeholder {
        color: var(--font-color-secondary);
        font-weight: 600;
      }
    }

    .add-timer {
      flex-shrink: 0;
      margin-right: 8px;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 700;
      white-space: nowrap;
    }

    &.is-plain {
      padding-right: 24px;
    }
  }

  .add-fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;

    .add-field {
      margin-top: 0;
    }
  }

  .add-go {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: var(--color-gray-strong);
    cursor: pointer;
    transition: background 0.15s ease;

    &.is-ready {
      background: var(--color-red-medium);
    }

    svg {
      display: block;
    }

    &:disabled {
      cursor: wait;
      opacity: 0.7;
    }
  }

  .add-continue {
    align-self: center;
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    padding: 4px 4px 4px 16px;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: var(--color-gray-strong);
    font-family: inherit;
    font-size: 0.95em;
    font-weight: 800;
    cursor: pointer;

    &.is-ready {
      background: var(--color-red-medium);
    }
  }

  .add-continue-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgb(255 255 255 / 18%);

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .add-find {
    align-self: center;
    margin-top: 12px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--font-color-light-blue);
    font-family: inherit;
    font-size: 0.9em;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;

    &:disabled,
    &.is-disabled {
      color: var(--font-color-secondary);
      cursor: default;
    }
  }

  .recovery-panel {
    .recovery-digits {
      width: 100%;
      min-width: 0;
      border: 0;
      padding: 0;
      margin: 4px 0 12px;
    }
    .recovery-digits legend {
      width: 100%;
      margin-bottom: 12px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
    }
    .recovery-digit-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 52px));
      justify-content: center;
      gap: 10px;
    }
    .recovery-digit-row input {
      width: 100%;
      min-width: 0;
      height: 56px;
      padding: 0;
      border: 1px solid #d6dfea;
      border-radius: 12px;
      background: white;
      color: var(--font-color-primary);
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      caret-color: var(--font-color-light-blue);
    }
    .recovery-digit-row input:focus {
      outline: 2px solid var(--font-color-light-blue);
      outline-offset: 3px;
      border-color: var(--font-color-light-blue);
    }
    .recovery-digit-row input[aria-invalid='true'] {
      border-color: var(--color-red-medium);
    }
    padding: 32px;
    .recovery-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    h2,
    p {
      margin: 0;
    }
    h2 {
      line-height: 1.4;
    }
    .add-fields {
      margin-top: 4px;
      gap: 12px;
    }
    .add-field:focus-within {
      border-color: var(--font-color-light-blue);
    }
    .recovery-error {
      color: var(--color-red-medium);
    }
    .recovery-help {
      text-align: center;
      font-size: 13px;
      line-height: 1.6;
    }
    .recovery-submit {
      width: 100%;
      min-height: 52px;
      margin-top: 4px;
      padding: 12px 20px;
      border: 0;
      border-radius: 999px;
      background: var(--color-red-medium);
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      &:disabled {
        background: var(--color-gray-strong);
        cursor: default;
      }
    }
    .recovery-submit:focus-visible {
      outline: 2px solid var(--font-color-primary);
      outline-offset: 3px;
    }
    @media (max-width: 480px) {
      padding: 24px 20px;
    }
  }

  .add-check-msg {
    width: 100%;
    margin: 8px 0 0;
    color: var(--color-red-medium);
    font-size: 0.9em;
    font-weight: 600;
    text-align: center;
  }

  .add-or {
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
  }

  .add-group {
    font-size: inherit;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;

    .add-group-copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    img {
      margin-top: 4px;
      flex-shrink: 0;
    }
  }

  .pick-copy {
    margin: 0;
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
    line-height: 1.55;
    text-align: center;
  }

  .welcome-panel {
    align-items: stretch;
    gap: 20px;

    h2,
    p {
      margin: 0;
    }

    .add-find {
      margin-top: 0;
    }
  }

  .welcome-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 16px 20px;
    border-radius: 16px;
    background: var(--color-gray-light);

    div {
      display: grid;
      grid-template-columns: 8em minmax(0, 1fr);
      gap: 12px;
      align-items: baseline;
    }

    dt {
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 700;
    }

    dd {
      min-height: 1.2em;
      margin: 0;
      color: var(--font-color-primary);
      font-size: 1em;
      font-weight: 800;
    }
  }

  .welcome-note {
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
    line-height: 1.55;
  }

  .welcome-tail {
    white-space: nowrap;
  }

  .welcome-inline {
    display: inline;
    margin: 0 0 0 8px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--font-color-light-blue);
    font: inherit;
    font-weight: 800;
    line-height: inherit;
    cursor: pointer;
  }

  .welcome-primary {
    width: 100%;
    height: 52px;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: var(--color-red-medium);
    font-family: inherit;
    font-size: 1em;
    font-weight: 800;
    cursor: pointer;
  }

  .member-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .member-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 20px 24px;
    border: 1px solid var(--line-color-gray);
    border-radius: 24px;
    background: #fff;
    font-family: inherit;
    text-align: left;
    cursor: pointer;

    strong {
      color: var(--font-color-primary);
      font-size: 1.3em;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    span {
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
    }

    &:hover,
    &:focus-visible {
      border-color: var(--color-gray-opacity-70);
    }
  }

  .review-consent {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
    line-height: 1.5;
    cursor: pointer;

    input {
      appearance: none;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      position: relative;
      border: 1px solid var(--line-color-gray);
      border-radius: 6px;
      background: #fff;
    }

    &.is-on input {
      border-color: var(--font-color-light-blue);
      background: var(--font-color-light-blue);

      &::after {
        position: absolute;
        top: 2px;
        left: 6px;
        width: 5px;
        height: 10px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        content: '';
      }
    }
  }

  .review-detail {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 4px;
    color: var(--font-color-primary);
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;

    img {
      display: block;
      flex-shrink: 0;
    }
  }

  .body.is-group {
    width: min(100%, 600px);
    justify-content: flex-start;
    gap: 24px;
    padding-top: 8px;
    padding-bottom: 16px;
  }

  .group-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 28px 28px 24px;
    border: 1px solid var(--line-color-gray);
    border-radius: 24px;
    background: #fff;

    p {
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
      line-height: 1.55;
      text-align: left;
    }
  }

  .group-field {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    padding-right: 8px;
    border: 1px solid var(--line-color-gray);
    border-radius: 999px;
    background: #fff;

    img {
      flex-shrink: 0;
      opacity: 0.55;
    }

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--font-color-primary);
      font-size: 1em;
      font-weight: 700;

      &::placeholder {
        color: var(--font-color-secondary);
        font-weight: 600;
      }

      &::-webkit-search-cancel-button {
        opacity: 0.45;
        filter: grayscale(1);
        cursor: pointer;
      }
    }

    .group-search-button {
      min-width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      border-radius: 999px;
      background: #00b4d8;
      color: #fff;
      font-size: 0.9em;
      font-weight: 800;
      cursor: pointer;

      img {
        opacity: 1;
        filter: brightness(0) invert(1);
      }

      &:disabled {
        background: #d8e1e8;
        cursor: default;
      }
    }
  }

  .group-schools {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px 14px;
  }

  .group-school {
    min-height: 65px;
    padding: 8px;
    border: 0;
    border-radius: 100px;
    background: #e8f3ff;
    color: var(--font-color-primary);
    font-size: 1em;
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: -0.02em;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: #d7ebff;
    }
  }

  .group-empty {
    width: 100%;
    color: var(--font-color-secondary);
    font-size: 0.9em;
    font-weight: 600;
    text-align: center;
  }

  .body.is-group-enter {
    width: min(100%, 420px);
    gap: 0;
  }

  .group-enter {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;

    h1 {
      font-size: 2em;
    }
  }

  .group-enter-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    p {
      margin: 0;
      color: var(--font-color-secondary);
      font-size: 1.1em;
      font-weight: 700;
      user-select: none;
      touch-action: manipulation;
    }
  }

  .group-enter-fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .group-enter-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .group-enter-select {
    width: 100%;
    height: 56px;
    padding: 0 20px;
    border: 1px solid var(--line-color-gray);
    border-radius: 999px;
    color: var(--font-color-primary);
    background: #fff;
    font-family: inherit;
    font-size: 1em;
    font-weight: 700;
    outline: none;
    appearance: none;
  }

  .group-enter-field {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 4px 8px 4px 24px;
    border: 1px solid var(--line-color-gray);
    border-radius: 999px;
    background: #fff;

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--font-color-primary);
      font-size: 1em;
      font-weight: 700;

      &::placeholder {
        color: var(--font-color-secondary);
        font-size: 1em;
        font-weight: 600;
        letter-spacing: 0;
        opacity: 1;
      }
    }
  }

  .group-enter-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px 24px;

    a,
    button {
      border: 0;
      padding: 0;
      color: var(--font-color-light-blue);
      background: none;
      font-family: inherit;
      font-size: 0.9em;
      font-weight: 700;
      cursor: pointer;
    }
  }

  &.trial-page {
    min-height: 100%;

    .trial-body {
      width: min(100%, 1440px);
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;
    }

    h1 {
      margin: 0;
      font-size: 2.3em;
    }

    .trial-intro {
      margin: 48px 0;
      padding: 20px 24px;
      border-radius: 999px;
      color: var(--font-color-primary);
      background: #e8f7fc;
      font-size: 0.9em;
      font-weight: 600;
      line-height: 1.55;
      text-align: center;

      a {
        color: #00b4d8;
        font-weight: 800;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
    }

    .trial-level-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 44px 64px;
      padding: 48px 60px;
      border: 1px solid var(--line-color-gray);
      border-radius: 34px;
    }

    .trial-level-card {
      min-width: 0;
      display: grid;
      grid-template-columns: minmax(190px, 0.9fr) minmax(190px, 1fr);
      align-items: center;
      gap: 28px;
    }

    .trial-level-image {
      position: relative;
      height: 250px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .trial-level-copy {
      min-width: 0;

      p {
        margin: 0 0 16px;
        color: var(--font-color-secondary);
        font-size: 1em;
        font-weight: 700;
        line-height: 1.5;
      }

      h2 {
        margin: 0;
        color: var(--font-color-primary);
        font-size: 2em;
        font-weight: 800;
        line-height: 1.2;
      }

      strong {
        display: block;
        margin-top: 8px;
        color: var(--font-color-secondary);
        font-size: 1.2em;
        font-weight: 700;
      }

      a {
        display: inline-flex;
        margin-top: 20px;
        color: #00b4d8;
        font-size: 1.1em;
        font-weight: 800;
      }
    }
  }

  ${labtopS(`
    h1 { font-size: 1.8em; }
    .body { gap: 28px; }
    &.trial-page {
      h1 { font-size: 2em; }
      .trial-level-grid { gap: 36px; padding: 40px 36px; }
      .trial-level-card { grid-template-columns: minmax(160px, 0.85fr) 1fr; gap: 22px; }
      .trial-level-image { height: 220px; }
    }
  `)}

  ${tabletL(`
    .body { padding-inline: 20px; }
    h1 { font-size: 1.6em; }
    .card { min-height: 120px; padding: 16px; gap: 12px; }
  `)}

  ${tabletS(`
    .chrome { padding-inline: 16px; }
    .body { width: 100%; padding: 12px 16px 40px; }
    .grid { grid-template-columns: 1fr; }
    h1 { font-size: 1.5em; }
    .group-schools { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .group-box { padding: 24px 20px; }
    &.trial-page {
      .trial-body { padding: 28px 16px 56px; }
      h1 { font-size: 1.6em; }
      .trial-intro { margin: 32px 0; border-radius: 18px; }
      .trial-level-grid { grid-template-columns: 1fr; gap: 34px; padding: 32px 24px; border-radius: 24px; }
      .trial-level-card { grid-template-columns: minmax(150px, 0.8fr) 1fr; }
    }
  `)}

  ${phone(`
    .chrome { min-height: 60px; padding-inline: 12px; }
    h1 { font-size: 1.4em; }
    .card {
      min-height: 100px;
      padding: 16px 12px;
    }
    .avatar.user,
    .avatar.trial,
    .avatar.plus {
      width: 72px;
      height: 72px;
    }
    .group-schools { grid-template-columns: 1fr; }
    .footer-links { gap: 6px 12px; }
    &.trial-page {
      .trial-body { padding-top: 20px; }
      h1 { font-size: 1.5em; }
      .trial-intro { margin: 24px 0; padding: 16px; font-size: 0.9em; }
      .trial-level-grid { gap: 38px; padding: 24px 16px; }
      .trial-level-card { grid-template-columns: 1fr; gap: 14px; text-align: center; }
      .trial-level-image { height: 210px; }
      .trial-level-copy {
        p { margin-bottom: 8px; }
        h2 { font-size: 1.7em; }
        strong { font-size: 1em; }
        a { margin-top: 16px; }
      }
    }
  `)}
`

export const HpTrialContentStyled = styled(HpAccountSelectStyled).attrs({
  className: 'trial-page trial-content-page',
})`
  .trial-content-body {
    width: min(100%, 880px);
    padding: 40px 24px 96px;
  }

  .trial-tabs {
    width: 100%;
    margin-bottom: 40px;
    isolation: isolate;
  }

  .trial-catalog {
    width: 100%;
  }

  .trial-catalog-head {
    margin-bottom: 40px;

    h2 {
      margin: 0;
      font-size: 1.4em;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    p {
      margin: 8px 0 0;
      color: var(--font-color-secondary);
      font-size: 1em;
      font-weight: 700;
    }
  }

  .prek-groups {
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  .level-book-groups {
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  .prek-group h3,
  .level-book-group h3 {
    margin: 0 0 16px;
    font-size: 1.2em;
    font-weight: 800;
  }

  .prek-list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 40px 24px;
  }

  .trial-book-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 40px 24px;
  }

  .trial-book-card {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
    border: 0;
    color: var(--font-color-primary);
    background: transparent;
    text-align: left;
    cursor: pointer;

    strong {
      margin-top: 12px;
      padding-inline: 12px;
      overflow: hidden;
      font-size: 1.1em;
      font-weight: 800;
      line-height: 1.4;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    > span:last-child {
      margin-top: 4px;
      padding-inline: 12px;
      color: var(--font-color-secondary);
      font-size: 0.9em;
      font-weight: 600;
    }

    &:hover .trial-book-cover,
    &:focus-visible .trial-book-cover {
      border-color: #8fd7e8;
      transform: translateY(-4px);
    }
  }

  .trial-book-card.is-prek .trial-book-cover {
    aspect-ratio: 16 / 9;
  }

  .trial-book-cover {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 1px solid var(--line-color-gray);
    border-radius: 28px;
    display: grid;
    place-items: center;
    color: #9aa8b8;
    background: #edf2f6;
    transition:
      border-color 160ms ease,
      transform 160ms ease;

    .trial-book-backdrop {
      object-fit: cover;
      filter: blur(14px) brightness(0.75);
      transform: scale(1.15);
      pointer-events: none;
    }

    span {
      font-size: 1em;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
  }

  ${tabletS(`
    .trial-content-body { padding: 32px 16px 72px; }
    .trial-tabs { margin-bottom: 32px; overflow-x: auto; scrollbar-width: none; }
    .trial-tabs::-webkit-scrollbar { display: none; }
    .trial-catalog-head { margin-bottom: 32px; }
    .level-book-groups { gap: 40px; }
    .prek-list { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px 16px; }
    .trial-book-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px 16px; }
  `)}

  ${phone(`
    .trial-content-body { padding-top: 24px; }
    .trial-catalog-head h2 { font-size: 1.2em; }
    .prek-groups { gap: 40px; }
    .level-book-groups { gap: 40px; }
    .prek-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .trial-book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  `)}
`
