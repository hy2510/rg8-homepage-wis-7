import { openWindow } from '@/8th/shared/utils/open-window'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export default function ArticleHtmlViewer({
  html,
  image,
  isImageFirst,
}: {
  html?: string
  image?: string
  isImageFirst?: boolean
}) {
  const router = useRouter()

  const previewRef = useRef<HTMLDivElement>(null)

  const onOpenLink = (
    target: Element | null,
    e: { preventDefault: () => void },
  ) => {
    if (previewRef.current) {
      const anchorTag = findAnchorTag(previewRef.current, target)
      if (anchorTag !== null) {
        const href = anchorTag.getAttribute('href')
        if (!!href) {
          const isExternal =
            href.startsWith('http:') || href.startsWith('https:')
          e.preventDefault()
          if (isExternal) {
            openWindow(href, {
              target: '_blank',
              external: true,
            })
          } else {
            router.push(href)
          }
        }
      }
    }
  }

  const content = html ? (
    <div
      id="preview"
      ref={previewRef}
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={(event) => onOpenLink(event.target as Element, event)}
    />
  ) : null
  const picture = image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="" />
  ) : null
  const body = isImageFirst ? [picture, content] : [content, picture]

  return <div className="article-body">{body}</div>
}

function findAnchorTag(
  root: Element,
  target: Element | null,
): HTMLAnchorElement | null {
  let cur: Element | null = target

  while (cur && cur !== root) {
    // 오직 a 태그만 탐색
    if (cur.tagName === 'A') {
      const anchor = cur as HTMLAnchorElement
      if (anchor.href && !anchor.href.startsWith('javascript:')) {
        return anchor
      }
    }
    cur = cur.parentElement
  }
  return null
}
