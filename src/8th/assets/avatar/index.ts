import type { StaticImageData } from 'next/image'
import { Bori } from './bori/images'
import { DoDoExtra, Dodo } from './dodo/images'
import { Dori } from './dori/images'
import { Elika } from './elika/images'
import { Ella } from './ella/images'
import { Juju } from './juju/images'
import { Koon } from './koon/images'
import { Momo } from './momo/images'
import { Pang } from './pang/images'
import { Poika } from './poika/images'
import { Poppy } from './poppy/images'
import { Robo } from './robo/images'

type AvatarType =
  | 'Dodo'
  | 'Koon'
  | 'Juju'
  | 'Bori'
  | 'Pang'
  | 'Momo'
  | 'Poppy'
  | 'Robo'
  | 'Dori'
  | 'Elika'
  | 'Ella'
  | 'Poika'

const AVATAR_ID_MAP: Record<string, AvatarType> = {
  '097971': 'Dodo',
  '097972': 'Koon',
  '097973': 'Juju',
  '097974': 'Bori',
  '097975': 'Pang',
  '097976': 'Momo',
  '097977': 'Poppy',
  '097978': 'Robo',
  '097979': 'Dori',
  '097980': 'Elika',
  '097981': 'Ella',
  '097982': 'Poika',
}

const AvatarColor: Record<AvatarType | 'Default', string> = {
  Dodo: '#529D66',
  Koon: '#F17159',
  Juju: '#2D70BB',
  Bori: '#F5AA0A',
  Pang: '#F28396',
  Momo: '#FBEA06',
  Poppy: '#93D3F4',
  Robo: '#C2D963',
  Dori: '#FADE73',
  Elika: '#8F9BD9',
  Ella: '#B293CE',
  Poika: '#ECA6E2',
  Default: '#63C9E3',
}

export enum AvatarExpression {
  DEFAULT = 'default',
  DISAPPOINTED = 'disappointed',
  EXCITED = 'excited',
  ANGRY = 'angry',
  FURIOUS = 'furious',
  SURPRISED = 'surprised',
  CHEERFUL = 'cheerful',
}

type SizeableImage = {
  large: string | StaticImageData
  normal: string | StaticImageData
  small: string | StaticImageData
}

type AvatarImages = {
  [value in AvatarExpression]: SizeableImage
}

const AVATAR_IMAGES: Record<AvatarType, AvatarImages> = {
  Bori,
  Dodo,
  Dori,
  Elika,
  Ella,
  Juju,
  Koon,
  Momo,
  Pang,
  Poika,
  Poppy,
  Robo,
}

export type Avatar = {
  avatarId: string
  name: AvatarType
  color: string
  images: AvatarImages
}

export function getAvatar(
  avatarId?: string,
  fallbackCommonImage?: boolean,
): Avatar {
  const avatarType = avatarId ? (AVATAR_ID_MAP[avatarId] ?? 'error') : 'error'

  // if (fallbackCommonImage && avatarType === 'error') {
  //   const images = AVATAR_IMAGES['Dodo']
  //   return {
  //     avatarId: '097971',
  //     name: 'Dodo',
  //     color: AvatarColor['Robo'],
  //     images: {
  //       ...images,
  //       ...DoDoExtra,
  //     },
  //   }
  // }

  const targetAvatarId = avatarType === 'error' ? '097971' : avatarId!
  const targetAvatarType = avatarType === 'error' ? 'Dodo' : avatarType

  let targetColor = AvatarColor[targetAvatarType]
  let targetImages = AVATAR_IMAGES[targetAvatarType]
  if (fallbackCommonImage && avatarType === 'error') {
    targetColor = AvatarColor['Default']
    targetImages = {
      ...AVATAR_IMAGES[targetAvatarType],
      ...DoDoExtra,
    }
  }

  return {
    avatarId: targetAvatarId,
    name: targetAvatarType,
    color: targetColor,
    images: targetImages,
  }
}
