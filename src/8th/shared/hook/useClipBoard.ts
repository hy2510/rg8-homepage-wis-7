'use client'

import { useState } from 'react'

export const useClipBoard = () => {
  const [isCopied, setIsCopied] = useState(false)

  const doCopyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {}
    } else {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.left = '-999999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)

        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {}
    }
  }

  return {
    isCopied,
    doCopyToClipboard,
  }
}
