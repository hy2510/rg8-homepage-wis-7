'use client'

import { VideoButtonStyle } from '@/8th/shared/styled/FeaturesStyled'
import Image, { StaticImageData } from 'next/image'

export default function VideoButton({
  color = 'green',
  label,
  icon,
  onClick,
}: {
  color: 'green' | 'red'
  label: string
  icon?: string | StaticImageData
  onClick?: () => void
}) {
  return (
    <VideoButtonStyle color={color}>
      <button className="video-button" onClick={onClick}>
        <span className="video-button__shine">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 3C9.35324 3 2.99944 9.35293 3 15"
              stroke="white"
              stroke-width="6"
              stroke-linecap="round"
            />
          </svg>
        </span>

        {icon && <Icon src={icon} />}
        <span className="video-button__label">{label}</span>
      </button>
    </VideoButtonStyle>
  )
}

function Icon({ src }: { src: string | StaticImageData }) {
  return (
    <Image
      className="video-button__icon"
      src={src}
      alt="icon"
      width={70}
      height={70}
    />
  )
}
