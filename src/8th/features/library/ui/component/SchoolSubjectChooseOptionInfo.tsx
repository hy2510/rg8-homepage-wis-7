import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'

export default function SchoolSubjectChooseOptionInfo() {
  return (
    <BoxStyle width="100%">
      <BoxStyle
        height="60dvh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={20}>
        {/* <Image
          src={Assets.Image.SchoolSubjectChooseOptionInfo}
          alt="school-subject-choose-option-info"
          width={105}
          height={101}
        /> */}
        <TextStyle fontFamily="sans" fontSize="medium" fontWeight={500}>
          조회할 학년과 교과서, 단원을 선택해 주세요.
        </TextStyle>
      </BoxStyle>
    </BoxStyle>
  )
}
