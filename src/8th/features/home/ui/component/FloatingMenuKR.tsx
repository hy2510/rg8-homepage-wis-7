'use client'

import { HpFloatingMenuStyled } from '@/8th/shared/styled/HpFeaturesStyled'
import { openWindow } from '@/8th/shared/utils/open-window'
import {
  useChannelTalkChatbotController,
  useConnectChannelTalk,
} from '@/external/channel-talk/component/ChannelTalkContext'

export default function FloatingMenuKR({
  items,
  customer,
  user,
}: {
  items: { action: string; icon: string; name: string }[]
  customer?: {
    customerId: string
    customerName: string
    customerUse: string
  }
  user?: {
    loginId: string
    studentId: string
    studentName: string
  }
}) {
  useConnectChannelTalk({ customer, user })
  const chatbot = useChannelTalkChatbotController()

  if (!items.length) return null

  return (
    <HpFloatingMenuStyled aria-label="퀵메뉴">
      {items.map((item, index) => (
        <button
          key={`${item.action}-${index}`}
          type="button"
          aria-label={item.name}
          style={{ backgroundImage: `url('${item.icon}')` }}
          onClick={() => {
            if (item.action === '@click#chatbot') chatbot.showChat()
            else openWindow(item.action, { external: true, target: '_blank' })
          }}
        />
      ))}
    </HpFloatingMenuStyled>
  )
}
