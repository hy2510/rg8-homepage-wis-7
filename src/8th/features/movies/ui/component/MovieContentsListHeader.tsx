import { MovieContentsListHeaderStyle } from '@/8th/shared/styled/FeaturesStyled'
import Image from 'next/image'

export default function MovieContentsListHeader({
  title,
  description,
  imagePath,
}: {
  title: string
  description: string
  imagePath: string
}) {
  return (
    <MovieContentsListHeaderStyle>
      <div className="movie-contents-list-header-left">
        <Image src={imagePath} alt={title} width={150} height={100} />
      </div>
      <div className="movie-contents-list-header-right">
        <div className="movie-contents-list-header-right-title">{title}</div>
        <div className="movie-contents-list-header-right-subtitle">
          {description}
        </div>
      </div>
    </MovieContentsListHeaderStyle>
  )
}
