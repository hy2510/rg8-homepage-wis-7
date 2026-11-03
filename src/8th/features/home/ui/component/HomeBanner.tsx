'use client'

import { Gap } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CarouselControls from './CarouselControls'

export default function HomeBanner({
  items,
}: {
  items: { image: string; link: string; self: boolean }[]
}) {
  // @language 'common'
  const { t } = useTranslation()

  const count = items.length
  const [index, setIndex] = useState(0)

  const goNext = () => {
    if (count < 2) return
    setIndex((current) => (current + 1) % count)
  }
  const goPrev = () => {
    if (count < 2) return
    setIndex((current) => (current - 1 + count) % count)
  }

  useEffect(() => {
    setIndex(0)
  }, [count])

  useEffect(() => {
    if (count < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [count, index])

  if (count === 0) return null

  const visibleSlides = Array.from(
    { length: Math.min(3, count) },
    (_, offset) => ({
      ...items[(index + offset) % count],
      offset,
    }),
  )

  return (
    <>
      <section className="section promotion" aria-label={t('t8th0318')}>
        <div className="promotion-grid">
          {visibleSlides.map((banner) => (
            <PromotionBannerCard
              key={banner.offset}
              image={banner.image}
              link={banner.link}
              self={banner.self}
            />
          ))}
        </div>
        <CarouselControls
          index={index}
          size={count}
          onPrev={goPrev}
          onNext={goNext}
        />
      </section>
      <Gap size={80} />
    </>
  )
}

const useThumbnailLoaded = (src: string) => {
  const [loaded, setLoaded] = useState(true)
  const markLoaded = () => {
    setLoaded(true)
  }
  return { loaded, markLoaded }
}

function PromotionBannerCard({
  image,
  link,
  self,
}: {
  image: string
  link?: string
  self?: boolean
}) {
  const src = image.trim()
  const href = link?.trim() || '#'
  const isExternal = !self
  const { loaded, markLoaded } = useThumbnailLoaded(src)
  const cardRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (loaded) return
    const card = cardRef.current
    if (!card) return

    let cancelled = false
    let img: HTMLImageElement | null = null
    let frame = 0
    let timer = 0

    const matchesSrc = (el: HTMLImageElement) => {
      const current = el.currentSrc || el.src || ''
      return current.includes(src) || current.includes(encodeURIComponent(src))
    }

    const onReady = () => {
      if (!cancelled) markLoaded()
    }

    const tryReveal = () => {
      img = card.querySelector('img')
      if (!img) return false
      img.addEventListener('load', onReady)
      img.addEventListener('error', onReady)
      if (img.complete && matchesSrc(img)) onReady()
      return true
    }

    if (!tryReveal()) {
      frame = window.requestAnimationFrame(() => {
        if (!tryReveal()) {
          timer = window.setTimeout(tryReveal, 50)
        }
      })
    }

    return () => {
      cancelled = true
      img?.removeEventListener('load', onReady)
      img?.removeEventListener('error', onReady)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [src, loaded, markLoaded])

  return (
    <Link
      ref={cardRef}
      className="promotion-card"
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}>
      <div
        className={`thumbnail-skeleton${loaded ? ' is-done' : ''}`}
        aria-hidden
      />
      <Image
        key={src}
        src={src}
        alt=""
        fill
        loading="eager"
        sizes="(max-width: 1024px) 100vw, 480px"
        className={`thumbnail-img${loaded ? ' is-loaded' : ''}`}
        onLoad={markLoaded}
        onError={markLoaded}
      />
    </Link>
  )
}
