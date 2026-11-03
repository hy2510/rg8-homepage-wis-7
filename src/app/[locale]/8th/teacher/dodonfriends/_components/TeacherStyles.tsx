'use client'

import glossy from '@/8th/assets/images/glossy-bg-small.svg'
import glossyPoint from '@/8th/assets/images/icons/glossy-point.svg'
import styled from 'styled-components'

// Explicit IDs keep SSR/client styles stable without changing shared Next config.
export const TeacherShell = styled.div.withConfig({
  componentId: 'dnf-teacher-shell',
})`
  width: 1024px;
  min-width: 1024px;
  margin-inline: auto;
  font-size: 16px;
  min-height: 100vh;
  background: #fff;
  color: var(--font-color-primary);
  button,
  input,
  select {
    font: inherit;
    color: inherit;
  }
  button {
    -webkit-appearance: none;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  summary:focus-visible {
    outline: 4px solid var(--line-color-light-blue);
    outline-offset: 4px;
  }
  .skip-link {
    position: fixed;
    top: -80px;
    left: 20px;
    padding: 16px;
    background: white;
    z-index: 10;
  }
  .skip-link:focus {
    top: 12px;
  }
  .topbar {
    position: relative;
  }
  .topbar::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc((1024px - max(1024px, 100vw)) / 2);
    width: max(1024px, 100vw);
    border-bottom: 1px solid var(--line-color-primary);
    pointer-events: none;
  }
  .topbar-inner {
    width: 1024px;
    height: 80px;
    padding: 12px 40px;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand img {
    display: block;
    width: 232px;
    height: auto;
  }
  .teacher-badge,
  .utility,
  .secondary-button {
    font-family: var(--font-family-secondary);
    font-weight: 400;
  }
  .teacher-badge {
    font-size: 0.8em;
    color: var(--font-color-dark-blue);
    background: var(--color-light-blue-opacity-10);
    border-radius: 1000px;
    padding: 8px 12px;
    white-space: nowrap;
  }
  .utilities {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .utility,
  .secondary-button {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9em;
    font-weight: 500;
    min-height: 40px;
    padding: 12px 16px;
    border: 1px solid var(--line-color-primary);
    border-radius: 12px;
    transition: background 0.15s;
  }
  .teacher-navigation .language-select { position: relative; }
  .teacher-navigation .language-button { display: grid; place-items: center; width: 42px; height: 42px; padding: 0; border: 0; border-radius: 50%; background: transparent; cursor: pointer; }
  .teacher-navigation .language-button > span { display: none; }
  .teacher-navigation .language-button:hover { background: #f4f7fb; }
  .teacher-navigation .language-menu { position: absolute; top: calc(100% + 8px); right: 0; z-index: 120; min-width: 148px; margin: 0; padding: 8px; list-style: none; border: 1px solid #e3eaf1; border-radius: 14px; background: #fff; box-shadow: 0 12px 28px rgb(32 48 72 / 12%); }
  .teacher-navigation .language-menu button { width: 100%; min-height: 40px; padding: 0 12px; border: 0; border-radius: 10px; background: transparent; color: var(--font-color-primary); text-align: left; font-family: var(--font-family-secondary); cursor: pointer; }
  .teacher-navigation .language-menu button:hover, .teacher-navigation .language-menu button:focus-visible, .teacher-navigation .language-menu .is-active { background: #f4f7fb; }
  .teacher-navigation .utility { border-radius: 999px; }
  .teacher-navigation .utility[aria-current="page"] { color: #128c9b; background: #ecf8fa; }
  .utility:hover,
  .secondary-button:hover {
    background: var(--color-gray-light);
  }
  main {
    width: 1024px;
    margin: auto;
    padding: 40px 40px 32px;
  }
  .primary-button {
    background: #1689ac;
    color: white;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 0.8em;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none !important;
      animation: none !important;
    }
  }
`

export const CourseSection = styled.section.withConfig({
  componentId: 'dnf-teacher-course',
})<{ $color: string; $background: string }>`
  --course-color: ${({ $color }) => $color};
  --course-background: ${({ $background }) => $background};
  position: relative;
  padding: 0 24px 24px;
  margin-bottom: 44px;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px dotted var(--course-color);
    border-radius: 24px;
    opacity: 0.23;
    pointer-events: none;
  }
  &:last-child {
    margin-bottom: 0;
  }
  .section-heading {
    position: relative;
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 0 8px;
    margin-left: -8px;
    background: #fff;
    transform: translateY(-50%);
  }
  h2 {
    font-size: 0.9em;
    font-weight: 400;
    border-radius: 20px;
    background: var(--course-color);
    color: #fff;
    padding: 8px 16px;
    white-space: nowrap;
  }

  #heading-alphabet {
    background: #e5a935;
  }

  #heading-sight-words {
    background: #2bb0bd;
  }

  #heading-readers-a {
    background: #244d7e;
  }

  .course-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .level-card {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 24px;
    min-height: 112px;
    background: var(--color-gray-light);
    border: 1px solid transparent;
    border-radius: 20px;
    text-align: left;
    isolation: isolate;
    transition:
      transform 0.18s,
      border-color 0.18s,
      background 0.18s;
  }
  .level-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url(${glossy.src}) no-repeat right 12px top / auto 100%;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
  }
  .level-card::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 12px;
    height: 12px;
    background: url(${glossyPoint.src}) center / contain no-repeat;
    pointer-events: none;
  }
  .level-card:hover {
    transform: translateY(-4px);
    background: var(--course-background);
    border-color: var(--course-color);
  }
  .level-card[aria-expanded='true'] {
    background: var(--course-background);
    border-color: var(--course-color);
  }
  .character {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    background: var(--course-background);
    border-radius: 50%;
  }
  .character img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
  .level-copy {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  .level-name {
    font-family: var(--font-family-rg-b);
    font-size: 1.5em;
    font-weight: 600;
  }
  .card-arrow {
    transform: rotate(90deg);
    color: #93a1b3;
    transition: transform 0.18s;
  }
  .level-card[aria-expanded='true'] .card-arrow {
    transform: rotate(-90deg);
    color: var(--course-color);
  }
  .course-detail {
    margin-top: 16px;
    padding: 24px;
    border: none;
    border-radius: 20px;
    background: var(--color-gray-light);
  }
  .book {
    background: #fff;
    border: 1px solid var(--line-color-primary);
    border-radius: 24px;
    overflow: hidden;
    margin-top: 12px;
  }
  .book:first-child {
    margin-top: 0;
  }
  .book summary {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    padding: 20px;
    font-weight: 400;
    list-style: none;
    font-size: 0.9em;
  }
  .book summary::-webkit-details-marker {
    display: none;
  }
  .book summary .count {
    margin-left: auto;
    color: var(--course-color);
    background: var(--course-background);
    padding: 4px 12px;
    border-radius: 1000px;
    font-weight: 400;
    font-size: 0.9em;
  }
  .book summary svg {
    transform: rotate(90deg);
    transition: transform 0.18s;
    flex-shrink: 0;
  }
  .book[open] {
    border-color: var(--line-color-primary);
  }
  .book[open] summary {
    background: #fff;
    color: var(--font-color-primary);
    border-bottom: 1px solid var(--line-color-primary);
  }
  .book[open] summary svg {
    transform: rotate(-90deg);
  }
  .lesson-list {
    display: grid;
    gap: 16px;
    padding: 16px;
    background: var(--color-gray-light);
  }
  .lesson {
    min-height: 84px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 16px 16px 32px;
    background: #fff;
    border-radius: 24px;
  }
  .lesson-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }
  .lesson-actions .secondary-button {
    font-weight: 600;
    min-height: 48px;
    justify-content: center;
    border: none;
    border-radius: 12px;
    background: #244d7e;
    color: #fff;
    --button-shadow-color: #173656;
  }
  .lesson-actions .secondary-button:active {
    transform: translateY(3px);
    box-shadow: none;
  }
  .start-button {
    cursor: pointer;
    min-width: 100px;
    min-height: 48px;
    padding: 12px 16px;
    border: none;
    border-radius: 12px;
    background: var(--color-red-medium);
    --button-shadow-color: var(--color-red-medium-shadow);
    color: #fff;
    font-size: 1.0em;
  }
  .start-button:active {
    transform: translateY(3px);
    box-shadow: none;
  }
  .review-start-button {
    background: #2bb0bd;
    --button-shadow-color: #19818b;
  }
  .lesson-actions .secondary-button,
  .lesson-actions .start-button {
    box-shadow: 0 3px 0 0 var(--button-shadow-color);
    background-image: url(${glossy.src});
    background-repeat: no-repeat;
    background-position: right center;
    background-size: auto 100%;
  }
  .lesson-actions .secondary-button:active,
  .lesson-actions .start-button:active {
    box-shadow: none;
  }
  .lesson-review .lesson-title img {
    flex-shrink: 0;
  }
  .lesson-review .lesson-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--font-color-secondary);
  }
  .lesson-title {
    font-family: var(--font-family-secondary);
    font-weight: 600;
    font-size: 1.1em;
    line-height: 1.6;
  }
  .lesson-review .lesson-title span {
    display: flex;
    flex-direction: column;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
  }
  .lesson-title small {
    display: block;
    font-family: var(--font-family-secondary);
    font-weight: 400;
    color: var(--font-color-secondary);
    font-size: 0.8em;
  }
  .unavailable {
    padding: 24px 12px;
    text-align: center;
    font-size: 0.8em;
    color: #77899e;
    line-height: 1.9;
  }
`

export const ResourceDialog = styled.dialog.withConfig({
  componentId: 'dnf-teacher-dialog',
})`
  position: fixed;
  inset: 0;
  margin: auto;
  width: 680px;
  max-width: none;
  font-size: 16px;
  max-height: calc(100dvh - 48px);
  overflow: auto;
  border: 1px solid var(--line-color-gray);
  border-radius: 32px;
  padding: 28px;
  color: var(--font-color-primary);
  background: white;
  box-shadow: 0 24px 92px #29344530;
  &::backdrop {
    background: #29344566;
    backdrop-filter: blur(4px);
  }
  .dialog-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
  }
  h2 {
    font-size: 1.4em;
    font-weight: 400;
  }
  .dialog-subtitle {
    margin-top: 4px;
    color: var(--font-color-secondary);
    font-family: var(--font-family-secondary);
    font-size: 0.8em;
    font-weight: 400;
  }
  .close-button {
    align-self: flex-start;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    background: var(--color-gray-light);
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dialog-lead {
    font-size: 0.8em;
    color: #77899e;
    line-height: 1.8;
    margin-bottom: 20px;
  }
  .step {
    border: 1px solid var(--line-color-primary);
    border-radius: 24px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .step summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    cursor: pointer;
    font-size: 0.9em;
    list-style: none;
  }
  .step summary::-webkit-details-marker {
    display: none;
  }
  .step summary span {
    font-family: var(--font-family-rg-b);
    color: #1689ac;
    background: #e2f6fc;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }
  .step:nth-of-type(1) summary span {
    color: #fff;
    background: #e5a935;
  }
  .step:nth-of-type(2) summary span {
    color: #fff;
    background: #d64d7c;
  }
  .step:nth-of-type(3) summary span {
    color: #fff;
    background: #2bb0bd;
  }
  .step:nth-of-type(4) summary span {
    color: #fff;
    background: #244d7e;
  }
  .step:nth-of-type(5) summary span {
    color: #fff;
    background: #218560;
  }
  .step summary svg {
    margin-left: auto;
  }
  .step[open] summary svg {
    transform: rotate(90deg);
  }
  .step-empty {
    padding: 8px 20px 24px;
    color: var(--font-color-secondary);
    font-family: var(--font-family-secondary);
    font-size: 0.9em;
    font-weight: 400;
    text-align: center;
  }
  .step-media {
    padding: 0 20px 20px;
  }
  .media-tabs {
    display: flex;
    gap: 8px;
    padding-top: 4px;
    border-bottom: 1px solid var(--line-color-primary);
    margin-bottom: 16px;
  }
  .media-tabs button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    padding: 12px 8px;
    border: 1px solid transparent;
    border-radius: 16px 16px 0 0;
    background: transparent;
    color: #a0aec0;
    font-family: var(--font-family-secondary);
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
  }
  .media-tabs button[aria-selected='true'] {
    color: #00b4d8;
    background: #fff;
    border-color: var(--line-color-primary);
    border-bottom-color: #fff;
    margin-bottom: -1px;
  }
  .media-tabs .media-tab-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #a0aec0;
    color: #fff;
    font-family: var(--font-family-secondary);
    font-size: 0.7em;
    font-weight: 600;
    line-height: 1;
  }
  .media-tabs button[aria-selected='true'] .media-tab-number {
    background: #00b4d8;
  }
  .media-tabs button:focus-visible {
    outline: 2px solid #00b4d8;
    outline-offset: -4px;
  }
  .activity-subtabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .activity-subtabs button {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    background: #f2f5f8;
    color: #77899e;
    font-family: var(--font-family-secondary);
    font-size: 0.9em;
  }
  .activity-subtabs button[aria-selected='true'] {
    background: #00b4d8;
    color: white;
  }
  .workbook-subtabs button {
    width: auto;
    padding: 0 16px;
  }
  .workbook-page-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .workbook-page {
    flex: 0 1 300px;
    height: 424px;
    min-width: 0;
    margin-inline: auto;
    background: #fff;
    border: 1px solid var(--line-color-primary);
  }
  .workbook-page img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .workbook-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--font-color-secondary);
    background: #f8fafb;
    font-family: var(--font-family-secondary);
    font-size: 0.9em;
  }
  .workbook-placeholder strong, .workbook-placeholder p { font: inherit; }
  .page-arrow {
    display: grid;
    place-items: center;
    flex: 0 0 32px;
    height: 32px;
    border-radius: 12px;
    background: #f2f5f8;
  }
  .page-arrow[aria-label='Previous page'] svg {
    transform: rotate(180deg);
  }
  .page-arrow:not(:disabled):hover {
    background: #e2f6fc;
    color: #1689ac;
  }
  .workbook-pagination {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .workbook-pagination button {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    background: #f2f5f8;
    font-size: 0.9em;
  }
  .workbook-pagination button[aria-current='page'] { background: #00b4d8; color: white; }
  .workbook-page-status {
    display: block;
    margin-top: 8px;
    text-align: center;
    font-family: var(--font-family-secondary);
    font-size: 0.8em;
    color: var(--font-color-secondary);
  }
  .activity-frame {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 0;
    background: #f5f7f9;
  }

  .step-media video {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0;
    background: #000;
  }
  .video-teacher-guide {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #e5f1ec;
    border-radius: 20px;
    background: #f2faf6;
    font-family: var(--font-family-secondary);
  }
  .video-teacher-guide h3 {
    margin-bottom: 16px;
    color: #214d45;
    font-family: inherit;
    font-size: 1.0em;
    font-weight: 700;
  }
  .video-teacher-guide p {
    padding: 16px;
    border: 1px solid #f6dfa0;
    border-radius: 12px;
    background: #fff7e5;
    color: #80631e;
    font-family: inherit;
    font-size: 0.9em;
    font-weight: 500;
    line-height: normal;
    white-space: pre-line;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .video-teacher-guide .teacher-guide-tip {
    margin-top: 12px;
  }
  .video-teacher-guide strong {
    font-family: inherit;
    font-weight: 700;
  }
  .resource-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .resource-item {
    border: 1px solid var(--line-color-primary);
    background: var(--color-gray-light);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.8em;
  }
  .resource-item svg {
    color: #1689ac;
  }
  .resource-item button {
    font-size: 0.9em;
    color: #77899e;
    background: transparent;
    padding: 0;
    min-height: 24px;
  }
  .curriculum-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 12px;
    background: var(--color-gray-light);
  }
  .curriculum-item strong {
    min-width: 104px;
    font-size: 0.9em;
    font-weight: 400;
  }
  .curriculum-item span {
    font-size: 0.8em;
    color: #77899e;
    line-height: 1.8;
  }
  .notice {
    padding: 16px;
    border-radius: 12px;
    background: var(--color-gray-light);
    color: #77899e;
    font-size: 0.8em;
    line-height: 1.9;
    margin-top: 20px;
  }
`


