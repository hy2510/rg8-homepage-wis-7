'use client'

import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import { ModalContainer } from '@/8th/shared/ui/Modal'

export default function SchoolSubjectLessonInfoModal({
  title,
  subject,
  lessons,
  onClickClose,
}: {
  title: string
  subject: string
  lessons: string[]
  onClickClose: () => void
}) {
  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="title">소개</div>
        <div className="btn-close" onClick={onClickClose} />
      </ModalHeaderStyle>
      <ModalBodyStyle>
        <BoxStyle>
          <LessonInfoTitle title={title} />
          <LessonInfoItem title="학습 내용" contents={[subject]} />
          <LessonInfoItem title="학습 목표" contents={lessons} />
        </BoxStyle>
      </ModalBodyStyle>
    </ModalContainer>
  )
}

const defaultFontFamily = 'var(--font-family-secondary)'
function LessonInfoTitle({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontFamily: defaultFontFamily,
        fontWeight: '700',
      }}>
      {title}
    </h2>
  )
}
function LessonInfoItem({
  title,
  contents,
}: {
  title: string
  contents: string[]
}) {
  return (
    <BoxStyle margin="32px 0">
      <h3
        style={{
          fontFamily: defaultFontFamily,
          fontWeight: 'bold',
          marginBottom: '8px',
        }}>
        {`[ ${title} ]`}
      </h3>
      {contents.map((content, index) => {
        const fontStyle = {
          fontFamily: defaultFontFamily,
          fontWeight: '400',
          paddingLeft: '20px',
          textIndent: '-20px',
          lineHeight: '1.6',
        }
        return (
          <BoxStyle
            key={index}
            display="flex"
            alignItems="baseline"
            margin="8px 0">
            <span style={fontStyle}>{`▪ ${content}`}</span>
          </BoxStyle>
        )
      })}
    </BoxStyle>
  )
}
