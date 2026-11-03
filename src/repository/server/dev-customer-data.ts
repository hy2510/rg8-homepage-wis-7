/* ========================================================
 * 개발서버 API 응답결과 하드코딩 (개발 DB 전용)
 *
 * [Customer 상세 데이터] DEV_ALL_CUSTOMERS
 * ┌────────┬─────────────────────────────────────┬─────────┬──────────┬───────────────────────────┐
 * │ Id     │ Name                                │ Use     │ UseCode  │ 변수명                    │
 * ├────────┼─────────────────────────────────────┼─────────┼──────────┼───────────────────────────┤
 * │ 001104 │ 개인회원(dev)                       │ Private │ 008005   │ customer                  │
 * │ 001089 │ 개인회원(testpri)                   │ Private │ 008005   │ customerPrivateN2         │
 * │ 001895 │ 사립초(testschool)                  │ School  │ 008004   │ customerPrivateSchool     │
 * │ 001896 │ 어학원(testacademy)                 │ Academy │ 008002   │ customerAcademy           │
 * │ 999981 │ 도도앤프랜즈(testd)                 │ Academy │ 008002   │ customerDnf               │
 * │ 999982 │ 도도앤프랜즈(testrgd)               │ Academy │ 008002   │ customerRgDnf             │
 * └────────┴─────────────────────────────────────┴─────────┴──────────┴───────────────────────────┘
 *
 * [Customer 검색 데이터] DEV_ALL_CUSTOMERS_SEARCH
 * ┌────────┬────────────────────────────────────┬─────────┬─────────────────────────────────┬─────────────────────────────────┐
 * │ Id     │ Name                               │ UseCode │ HomepageUrl                     │ 변수명                          │
 * ├────────┼────────────────────────────────────┼─────────┼─────────────────────────────────┼─────────────────────────────────┤
 * │ 001104 │ 개인회원(dev)                      │ 008005  │ dev.readinggate.com             │ customerSearch                  │
 * │ 001089 │ 개인회원(testpri)                  │ 008005  │ testpri.readinggate.com         │ customerSearchPrivateN2         │
 * │ 001895 │ 사립초(testschool)                 │ 008004  │ testschool.readinggate.com      │ customerSearchPrivateSchool     │
 * │ 001896 │ 어학원(testacademy)                │ 008002  │ testacademy.readinggate.com     │ customerSearchAcademy           │
 * │ 999981 │ 도도앤프랜즈(testd)                │ 008002  │ testd.dodonfriends.com          │ customerSearchDnf               │
 * │ 999982 │ 도도앤프랜즈(testrgd)              │ 008002  │ testrgd.dodonfriends.com        │ customerSearchRgDnf             │
 * └────────┴────────────────────────────────────┴─────────┴─────────────────────────────────┴─────────────────────────────────┘
 * ======================================================== */

/** 개발 DB용 Customer 상세 객체 (selfCustomer / findCustomer 응답의 Customer 필드) */
export type DevCustomerInfo = {
  CustomerId: string
  Name: string
  AreaCode: string
  CustomerGroupCode: string
  CustomerGroupName: string
  CustomerUseCode: string
  CustomerTypeCode: string
  Round: string
  CustomerOldId: string
  Postcode: string
  Address: string
  DetailAddress: string
  CellPhone: string
  Telephone: string
  Fax: string
  PayTypeCode: string
  CeoName: string
  BusinessNo: string
  LogoFilename: string
  BankCode: string
  AccountNo: string
  Memo: string
  ExpiredDate: string
  UseYn: boolean
  DeleteYn: boolean
  SchoolYn: boolean
  ViewPopupYn: boolean
  ReportYn: boolean
  StudyReportYn: boolean
  MonthReportYn: boolean
  YearReportYn: boolean
  TeacherEvaluation: string
  AutoLevelUpYn: boolean
  ViewVocaYn: boolean
  ViewAssessmentYn: boolean
  ViewLevelUpYn: boolean
  LimitLevelYn: boolean
  MinLevel: number
  MaxLevel: number
  UrlCode1: string
  UrlCode2: string
  ServiceYn: boolean
  IniKeyCode: string
  CustomerUse: string
  SelfStudyYn: boolean
  WholeSchoolYn: boolean
  LanguageCode: string
  ViewPbTypeSetupYn: boolean
  ViewFullEasyYn: boolean
  CountryCode: string
  MainBannerViewYn: boolean
  UseEbookAniYn: boolean
  StudentWorkSheetYn: boolean
  ManagerWorkSheetYn: boolean
  ViewRecommendBooksYn: boolean
  NeedPayment: string
  StudyEBUseYn: boolean
  StudyPBUseYn: boolean
  StudyLCUseYn: boolean
  StudyMSUseYn: boolean
  StudyPDUseYn: boolean
  StudyJNUseYn: boolean
  StudyESUseYn: boolean
  UseDodoAbcYn: string
  UseSpeakYn: boolean
  UseStudentNoYn: boolean
  PreKMode: string
  ProgramModelCode: string
  ProgramModelName: string
}

/** 개발 DB용 Customer 응답 객체 (Token + Customer) */
export type DevCustomer = {
  Token: string
  Customer: DevCustomerInfo
}

/** 개발 DB용 Customer 검색 객체 (searchCustomer 응답의 Customers 항목) */
export type DevCustomerSearch = {
  Name: string
  CustomerId: string
  HomepageUrl: string
  CustomerUseCode: string
  LogoFilename: string
  AppSvrUrl: string
  UseStudentNoYn: string
  CountryCode: string
}

export const customer: DevCustomer = {
  Token:
    '3fbc5fddff318735f24fdd855d6bd420ff7105e046d8929e0f256149733dc790892757729c0310ad5bb0c34aa26d74d17f31e56c0c739a12965effc9ccad64084aa075d7db7500c2b04524b7d133e45e',
  Customer: {
    CustomerId: '001104',
    Name: '개인회원(DEV)',
    AreaCode: '003001',
    CustomerGroupCode: '002008',
    CustomerGroupName: '리딩게이트',
    CustomerUseCode: '008005',
    CustomerTypeCode: '',
    Round: '087',
    CustomerOldId: '100220',
    Postcode: '0-     ',
    Address: '경기도 성남시 수정구',
    DetailAddress: '창업로 43, A동 807~810호(글로벌비즈센터)',
    CellPhone: '',
    Telephone: '1599-0533',
    Fax: '',
    PayTypeCode: '',
    CeoName: '김용환',
    BusinessNo: '',
    LogoFilename:
      'https://wcfresource.a1edu.com/newsystem/image/acalogo/100220_top.png',
    BankCode: '',
    AccountNo: '0',
    Memo: '',
    ExpiredDate: '',
    UseYn: true,
    DeleteYn: false,
    SchoolYn: false,
    ViewPopupYn: true,
    ReportYn: true,
    StudyReportYn: true,
    MonthReportYn: true,
    YearReportYn: true,
    TeacherEvaluation: 'Fluency',
    AutoLevelUpYn: true,
    ViewVocaYn: true,
    ViewAssessmentYn: true,
    ViewLevelUpYn: true,
    LimitLevelYn: false,
    MinLevel: 0,
    MaxLevel: 0,
    UrlCode1: '',
    UrlCode2: '',
    ServiceYn: false,
    IniKeyCode: 'aoneedu001',
    CustomerUse: 'Private',
    SelfStudyYn: false,
    WholeSchoolYn: false,
    LanguageCode: 'ko-KR',
    ViewPbTypeSetupYn: true,
    ViewFullEasyYn: true,
    CountryCode: 'KR',
    MainBannerViewYn: true,
    UseEbookAniYn: true,
    StudentWorkSheetYn: true,
    ManagerWorkSheetYn: true,
    ViewRecommendBooksYn: true,
    NeedPayment: 'Y',
    StudyEBUseYn: true,
    StudyPBUseYn: true,
    StudyLCUseYn: false,
    StudyMSUseYn: false,
    StudyPDUseYn: false,
    StudyJNUseYn: false,
    StudyESUseYn: false,
    UseDodoAbcYn: 'A',
    UseSpeakYn: true,
    UseStudentNoYn: false,
    PreKMode: 'DP',
    ProgramModelCode: '107001',
    ProgramModelName: 'RG',
  },
}

export const customerPrivateN2: DevCustomer = {
  Token:
    '3fbc5fddff318735f24fdd855d6bd420b8dfb706ca0739576164ff2fbc35fc093cd37f0b71b4e7f5f6239bf8cda2b11b218d84cec10805eb484801575322e24841d2c09fa10fdf6fc247b4d8701dca3f',
  Customer: {
    CustomerId: '001089',
    Name: '개인회원(testpri)',
    AreaCode: '003001',
    CustomerGroupCode: '002008',
    CustomerGroupName: '리딩게이트',
    CustomerUseCode: '008005',
    CustomerTypeCode: '',
    Round: '087',
    CustomerOldId: '100220',
    Postcode: '0-     ',
    Address: '경기도 성남시 수정구',
    DetailAddress: '창업로 43, A동 807~810호(글로벌비즈센터)',
    CellPhone: '',
    Telephone: '1599-0533',
    Fax: '',
    PayTypeCode: '',
    CeoName: '김용환',
    BusinessNo: '',
    LogoFilename:
      'https://wcfresource.a1edu.com/newsystem/image/acalogo/100220_top.png',
    BankCode: '',
    AccountNo: '0',
    Memo: '',
    ExpiredDate: '',
    UseYn: true,
    DeleteYn: false,
    SchoolYn: false,
    ViewPopupYn: true,
    ReportYn: true,
    StudyReportYn: true,
    MonthReportYn: true,
    YearReportYn: true,
    TeacherEvaluation: 'Fluency',
    AutoLevelUpYn: true,
    ViewVocaYn: true,
    ViewAssessmentYn: true,
    ViewLevelUpYn: true,
    LimitLevelYn: false,
    MinLevel: 0,
    MaxLevel: 0,
    UrlCode1: '041001',
    UrlCode2: '',
    ServiceYn: false,
    IniKeyCode: 'aoneedu001',
    CustomerUse: 'Private',
    SelfStudyYn: false,
    WholeSchoolYn: false,
    LanguageCode: 'ko-KR',
    ViewPbTypeSetupYn: true,
    ViewFullEasyYn: true,
    CountryCode: 'KR',
    MainBannerViewYn: true,
    UseEbookAniYn: true,
    StudentWorkSheetYn: true,
    ManagerWorkSheetYn: true,
    ViewRecommendBooksYn: true,
    NeedPayment: 'Y',
    StudyEBUseYn: true,
    StudyPBUseYn: true,
    StudyLCUseYn: false,
    StudyMSUseYn: false,
    StudyPDUseYn: false,
    StudyJNUseYn: false,
    StudyESUseYn: false,
    UseDodoAbcYn: 'Y',
    UseSpeakYn: true,
    UseStudentNoYn: false,
    PreKMode: 'D',
    ProgramModelCode: '107001',
    ProgramModelName: 'RG',
  },
}

export const customerPrivateSchool: DevCustomer = {
  Token:
    '3fbc5fddff318735f24fdd855d6bd4208f5570f7f3d3ebfeacc77efb8d39f5a6cefefc46db0ca7a7536cac312ad349ce47ddda78f0732e89ebd5835ba259cf350584a67fd22d03a4b4288f9cfdff5591',
  Customer: {
    CustomerId: '001895',
    Name: '사립초(testschool)',
    AreaCode: '003001',
    CustomerGroupCode: '002001',
    CustomerGroupName: '초등학교',
    CustomerUseCode: '008004',
    CustomerTypeCode: '',
    Round: '113',
    CustomerOldId: '100262',
    Postcode: '136-831',
    Address: '서울 성북구 한천로 694',
    DetailAddress: '',
    CellPhone: '',
    Telephone: '02-915-7312',
    Fax: '02-915-7515',
    PayTypeCode: '',
    CeoName: '김광배',
    BusinessNo: '',
    LogoFilename:
      'https://wcfresource.a1edu.com/newsystem/image/acalogo/100262_top.png',
    BankCode: '',
    AccountNo: '0',
    Memo: '',
    ExpiredDate: '29990228',
    UseYn: true,
    DeleteYn: false,
    SchoolYn: true,
    ViewPopupYn: true,
    ReportYn: true,
    StudyReportYn: true,
    MonthReportYn: true,
    YearReportYn: true,
    TeacherEvaluation: 'Fluency',
    AutoLevelUpYn: true,
    ViewVocaYn: true,
    ViewAssessmentYn: true,
    ViewLevelUpYn: true,
    LimitLevelYn: false,
    MinLevel: 0,
    MaxLevel: 0,
    UrlCode1: '',
    UrlCode2: '',
    ServiceYn: true,
    IniKeyCode: 'aoneedu014',
    CustomerUse: 'School',
    SelfStudyYn: true,
    WholeSchoolYn: true,
    LanguageCode: 'ko-KR',
    ViewPbTypeSetupYn: false,
    ViewFullEasyYn: true,
    CountryCode: 'KR',
    MainBannerViewYn: true,
    UseEbookAniYn: true,
    StudentWorkSheetYn: false,
    ManagerWorkSheetYn: false,
    ViewRecommendBooksYn: true,
    NeedPayment: 'Y',
    StudyEBUseYn: true,
    StudyPBUseYn: true,
    StudyLCUseYn: false,
    StudyMSUseYn: false,
    StudyPDUseYn: false,
    StudyJNUseYn: false,
    StudyESUseYn: false,
    UseDodoAbcYn: 'Y',
    UseSpeakYn: true,
    UseStudentNoYn: true,
    PreKMode: 'D',
    ProgramModelCode: '107001',
    ProgramModelName: 'RG',
  },
}

export const customerAcademy: DevCustomer = {
  Token:
    '3fbc5fddff318735f24fdd855d6bd4206a1589ae409523b6e37c080ee9343e34e21feef31801342b6ed2a749ac9a1231863e5bd58efb0ab000e95ce841c5f66e935105e62cd324e10d62d9eb3c3f0c5c',
  Customer: {
    CustomerId: '001896',
    Name: '어학원(testacademy)',
    AreaCode: '003010',
    CustomerGroupCode: '002006',
    CustomerGroupName: '학원',
    CustomerUseCode: '008002',
    CustomerTypeCode: '',
    Round: '   ',
    CustomerOldId: '100803',
    Postcode: '42187',
    Address: '대구시 수성구 지범로1길 10',
    DetailAddress: '(두산동)',
    CellPhone: '',
    Telephone: '053-761-6700',
    Fax: '',
    PayTypeCode: '005003',
    CeoName: '유영주',
    BusinessNo: '',
    LogoFilename:
      'https://wcfresource.a1edu.com/newsystem/image/acalogo/100803_top.png',
    BankCode: '',
    AccountNo: '',
    Memo: '',
    ExpiredDate: '21000412',
    UseYn: true,
    DeleteYn: false,
    SchoolYn: false,
    ViewPopupYn: false,
    ReportYn: true,
    StudyReportYn: true,
    MonthReportYn: true,
    YearReportYn: true,
    TeacherEvaluation: 'Fluency',
    AutoLevelUpYn: true,
    ViewVocaYn: true,
    ViewAssessmentYn: false,
    ViewLevelUpYn: false,
    LimitLevelYn: false,
    MinLevel: 0,
    MaxLevel: 0,
    UrlCode1: '',
    UrlCode2: '',
    ServiceYn: true,
    IniKeyCode: '',
    CustomerUse: 'Academy',
    SelfStudyYn: false,
    WholeSchoolYn: false,
    LanguageCode: 'ko-KR',
    ViewPbTypeSetupYn: false,
    ViewFullEasyYn: false,
    CountryCode: 'KR',
    MainBannerViewYn: true,
    UseEbookAniYn: true,
    StudentWorkSheetYn: true,
    ManagerWorkSheetYn: true,
    ViewRecommendBooksYn: true,
    NeedPayment: 'N',
    StudyEBUseYn: true,
    StudyPBUseYn: true,
    StudyLCUseYn: true,
    StudyMSUseYn: true,
    StudyPDUseYn: true,
    StudyJNUseYn: true,
    StudyESUseYn: true,
    UseDodoAbcYn: 'A',
    UseSpeakYn: true,
    UseStudentNoYn: false,
    PreKMode: 'DP',
    ProgramModelCode: '107001',
    ProgramModelName: 'RG',
  },
}

export const customerDnf: DevCustomer = {
  Token:
    '3fbc5fddff318735f24fdd855d6bd420d0c9408bac81e1fd0574d48630f672f86e07d3625cef964ad4a76a6a4582e2aa315d48209bfc52511c7b23732867b8d5d1d9328e2d8383e96ab08e0203f1fb3a',
  Customer: {
    CustomerId: '999981',
    Name: '도도앤프랜즈(testd)',
    AreaCode: '003017',
    CustomerGroupCode: '002006',
    CustomerGroupName: '학원',
    CustomerUseCode: '008002',
    CustomerTypeCode: '',
    Round: '043',
    CustomerOldId: '100341',
    Postcode: '611-803',
    Address: '부산광역시 연제구 거제동 1474',
    DetailAddress: '',
    CellPhone: '',
    Telephone: '1599-0533',
    Fax: '',
    PayTypeCode: '',
    CeoName: '김용환',
    BusinessNo: '',
    LogoFilename:
      'https://wcfresource.a1edu.com/newsystem/image/acalogo/999981_top.png',
    BankCode: '',
    AccountNo: '',
    Memo: '',
    ExpiredDate: '29991231',
    UseYn: true,
    DeleteYn: false,
    SchoolYn: false,
    ViewPopupYn: true,
    ReportYn: true,
    StudyReportYn: true,
    MonthReportYn: true,
    YearReportYn: true,
    TeacherEvaluation: 'Fluency',
    AutoLevelUpYn: true,
    ViewVocaYn: true,
    ViewAssessmentYn: true,
    ViewLevelUpYn: true,
    LimitLevelYn: false,
    MinLevel: 0,
    MaxLevel: 0,
    UrlCode1: '',
    UrlCode2: '',
    ServiceYn: true,
    IniKeyCode: '',
    CustomerUse: 'Academy',
    SelfStudyYn: false,
    WholeSchoolYn: true,
    LanguageCode: 'vi-VN',
    ViewPbTypeSetupYn: false,
    ViewFullEasyYn: true,
    CountryCode: 'VN',
    MainBannerViewYn: true,
    UseEbookAniYn: true,
    StudentWorkSheetYn: false,
    ManagerWorkSheetYn: false,
    ViewRecommendBooksYn: true,
    NeedPayment: 'N',
    StudyEBUseYn: true,
    StudyPBUseYn: true,
    StudyLCUseYn: false,
    StudyMSUseYn: false,
    StudyPDUseYn: false,
    StudyJNUseYn: false,
    StudyESUseYn: false,
    UseDodoAbcYn: 'A',
    UseSpeakYn: true,
    UseStudentNoYn: true,
    PreKMode: 'DP',
    ProgramModelCode: '107003',
    ProgramModelName: '',
  },
}

export const customerRgDnf: DevCustomer = {
  Token:
    '3fbc5fddff318735f24fdd855d6bd4206ba50bb319917c5132f2b48a6e95f62e820caf522e5afccc7bb1bb5901e0d93189e30fb3d34340aea76a8ae1b320caf1183c329bfeca04fe27b562e79a2bb986',
  Customer: {
    CustomerId: '999982',
    Name: 'RG + 도도앤프랜즈(testrgd)',
    AreaCode: '003017',
    CustomerGroupCode: '002006',
    CustomerGroupName: '학원',
    CustomerUseCode: '008002',
    CustomerTypeCode: '',
    Round: '043',
    CustomerOldId: '100341',
    Postcode: '611-803',
    Address: '부산광역시 연제구 거제동 1474',
    DetailAddress: '',
    CellPhone: '',
    Telephone: '1599-0533',
    Fax: '',
    PayTypeCode: '',
    CeoName: '김용환',
    BusinessNo: '',
    LogoFilename:
      'https://wcfresource.a1edu.com/newsystem/image/acalogo/999981_top.png',
    BankCode: '',
    AccountNo: '',
    Memo: '',
    ExpiredDate: '29991231',
    UseYn: true,
    DeleteYn: false,
    SchoolYn: false,
    ViewPopupYn: true,
    ReportYn: true,
    StudyReportYn: true,
    MonthReportYn: true,
    YearReportYn: true,
    TeacherEvaluation: 'Fluency',
    AutoLevelUpYn: true,
    ViewVocaYn: true,
    ViewAssessmentYn: true,
    ViewLevelUpYn: true,
    LimitLevelYn: false,
    MinLevel: 0,
    MaxLevel: 0,
    UrlCode1: '',
    UrlCode2: '',
    ServiceYn: true,
    IniKeyCode: '',
    CustomerUse: 'Academy',
    SelfStudyYn: false,
    WholeSchoolYn: true,
    LanguageCode: 'vi-VN',
    ViewPbTypeSetupYn: false,
    ViewFullEasyYn: true,
    CountryCode: 'VN',
    MainBannerViewYn: true,
    UseEbookAniYn: true,
    StudentWorkSheetYn: false,
    ManagerWorkSheetYn: false,
    ViewRecommendBooksYn: true,
    NeedPayment: 'N',
    StudyEBUseYn: true,
    StudyPBUseYn: true,
    StudyLCUseYn: false,
    StudyMSUseYn: false,
    StudyPDUseYn: false,
    StudyJNUseYn: false,
    StudyESUseYn: false,
    UseDodoAbcYn: 'A',
    UseSpeakYn: true,
    UseStudentNoYn: true,
    PreKMode: 'DP',
    ProgramModelCode: '107004',
    ProgramModelName: '',
  },
}

export const customerSearch: DevCustomerSearch = {
  Name: '개인회원(Dev)',
  CustomerId: '001104',
  HomepageUrl: 'https://dev.readinggate.com',
  CustomerUseCode: '008005',
  LogoFilename:
    'https://wcfresource.a1edu.com/newsystem/image/acalogo/100220_top.png',
  AppSvrUrl: 'http://app.readinggate.com',
  UseStudentNoYn: 'N',
  CountryCode: 'KR',
}

export const customerSearchPrivateN2: DevCustomerSearch = {
  Name: '개인회원(testpri)',
  CustomerId: '001089',
  HomepageUrl: 'https://testpri.readinggate.com',
  CustomerUseCode: '008005',
  LogoFilename:
    'https://wcfresource.a1edu.com/newsystem/image/acalogo/100220_top.png',
  AppSvrUrl: 'https://app.readinggate.com',
  UseStudentNoYn: 'N',
  CountryCode: 'KR',
}

export const customerSearchPrivateSchool: DevCustomerSearch = {
  Name: '사립초(testschool)',
  CustomerId: '001895',
  HomepageUrl: 'https://testschool.readinggate.com',
  CustomerUseCode: '008004',
  LogoFilename:
    'https://wcfresource.a1edu.com/newsystem/image/acalogo/100262_top.png',
  AppSvrUrl: 'https://app.readinggate.com',
  UseStudentNoYn: 'Y',
  CountryCode: 'KR',
}

export const customerSearchAcademy: DevCustomerSearch = {
  Name: '어학원(testacademy)',
  CustomerId: '001896',
  HomepageUrl: 'https://testacademy.readinggate.com',
  CustomerUseCode: '008002',
  LogoFilename:
    'https://wcfresource.a1edu.com/newsystem/image/acalogo/100803_top.png',
  AppSvrUrl: 'https://app.readinggate.com',
  UseStudentNoYn: 'N',
  CountryCode: 'KR',
}

export const customerSearchDnf: DevCustomerSearch = {
  Name: '도도앤프랜즈(testd)',
  CustomerId: '999981',
  HomepageUrl: 'https://testd.dodonfriends.com',
  CustomerUseCode: '008002',
  LogoFilename:
    'https://wcfresource.a1edu.com/newsystem/image/acalogo/999981_top.png',
  AppSvrUrl: 'https://app.readinggate.com',
  UseStudentNoYn: 'N',
  CountryCode: 'KR',
}

export const customerSearchRgDnf: DevCustomerSearch = {
  Name: 'RG+도도앤프랜즈(testrgd)',
  CustomerId: '999982',
  HomepageUrl: 'https://testrgd.dodonfriends.com',
  CustomerUseCode: '008002',
  LogoFilename:
    'https://wcfresource.a1edu.com/newsystem/image/acalogo/999981_top.png',
  AppSvrUrl: 'https://app.readinggate.com',
  UseStudentNoYn: 'N',
  CountryCode: 'KR',
}

/** 개발 DB용 전체 Customer 테스트 데이터 목록 */
export const DEV_ALL_CUSTOMERS: DevCustomer[] = [
  customer,
  customerPrivateN2,
  customerPrivateSchool,
  customerAcademy,
  customerDnf,
  customerRgDnf,
]

/** 개발 DB용 전체 Customer 검색 테스트 데이터 목록 */
export const DEV_ALL_CUSTOMERS_SEARCH: DevCustomerSearch[] = [
  customerSearch,
  customerSearchPrivateN2,
  customerSearchPrivateSchool,
  customerSearchAcademy,
  customerSearchDnf,
  customerSearchRgDnf,
]

/* ========================================================
 * 개발용 조회 함수 (common.ts의 IS_DEV_DB 분기에서 사용)
 * ======================================================== */

/** token으로 Customer 조회 (없으면 기본 customer) */
export const getDevCustomerByToken = (token: string): DevCustomer => {
  let customerId: string | undefined = undefined
  try {
    const tokenDiv = token.split('.')
    const decoded = atob(tokenDiv[1])
    const tokenPayload = JSON.parse(decoded)
    customerId = tokenPayload.cid
  } catch (e) {}

  let targetCustomer: DevCustomer | undefined = undefined
  if (customerId) {
    targetCustomer = DEV_ALL_CUSTOMERS.find(
      (item) => item.Customer.CustomerId === customerId,
    )
  }
  if (!targetCustomer) {
    targetCustomer = customer
  }
  return targetCustomer
}

/** customerId로 Customer 조회 (customerId가 없으면 기본 customer) */
export const getDevCustomer = (input: {
  homepageUrl?: string
  customerId?: string
}): DevCustomer => {
  if (!!input.homepageUrl) {
    const findDevDomain = DEV_ALL_CUSTOMERS_SEARCH.find(
      (item) => item.HomepageUrl === input.homepageUrl,
    )
    if (!!findDevDomain) {
      const findCustomer = DEV_ALL_CUSTOMERS.find(
        (item) => item.Customer.CustomerId === findDevDomain.CustomerId,
      )
      if (!!findCustomer) {
        return findCustomer
      }
    }
  }
  if (!input.customerId) {
    return customer
  }
  return (
    DEV_ALL_CUSTOMERS.find(
      (item) => item.Customer.CustomerId === input.customerId,
    ) ?? customer
  )
}

/** 전체 Customer 검색 데이터 반환 (개발용) */
export const getDevCustomerSearch = (): { Customers: DevCustomerSearch[] } => ({
  Customers: DEV_ALL_CUSTOMERS_SEARCH,
})
