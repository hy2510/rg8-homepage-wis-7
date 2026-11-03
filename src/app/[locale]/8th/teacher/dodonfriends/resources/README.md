# Resources 인수인계

## 화면과 데이터 책임

주소: `/{locale}/8th/teacher/dodonfriends/resources`. 수업 목록의 Resources 버튼으로 진입하고 All Lessons 또는 로고로 복귀한다. 기존 1024px 고정 너비와 80px GNB를 재사용한다.

첨부 기획 PDF rev4 - 2 resource 기준: 학습 자료 4개 분류/13개 항목, 정답지 30개. Sheila는 PDF 표기대로 4–6권이다. 실제 기획 변경은 fixture 또는 서버 데이터에서 수정한다.

- `page.tsx`: 서버 로더 호출 및 locale 경로 구성
- `ResourcesView.tsx`: 데이터 표시, 링크 및 준비 중 상태
- `resources.module.css`: 이 페이지 전용 스타일
- `_data/types.ts`: 데이터 계약
- `_data/fixture.ts`: URL 미제공 상태의 기획 샘플
- `_data/parseResources.ts`: 외부 JSON 검증, 필드 경로를 포함한 오류
- `_data/catalog.ts`: 서버 전용 로더
- `loading.tsx`, `error.tsx`: 로딩 및 실패/재시도
- `_tests/resources.test.cjs`: 데이터 계약 회귀 검사

## 서버 연동

`TEACHER_RESOURCES_URL` 미설정 시 샘플을 사용한다. 설정 시 해당 API를 서버에서 호출한다. 선택적 `TEACHER_RESOURCES_TOKEN`은 Bearer 토큰이다. 둘 다 NEXT_PUBLIC로 노출하지 않는다. 서버 응답은 JSON 객체여야 한다. 10초 시간 제한, no-store이며 실패 시 샘플로 대체하지 않고 재시도 화면을 표시한다. 운영 캐시 정책은 데이터 갱신 주기와 권한에 맞춰 별도 결정한다.

기존 수업 카탈로그의 `resources` 배열은 이전 팝업의 레거시 필드로 유지하지만 새 페이지는 사용하지 않는다. 새 API 계약을 별도로 두어 기존 수업 API를 변경하지 않고 자료 페이지를 연동할 수 있다.

```json
{
  "schemaVersion": 1,
  "materialGroups": [
    {
      "id": "alphabet",
      "title": "알파벳 학습 자료",
      "subtitle": "Baro",
      "color": "#d58a12",
      "items": [
        { "id": "letter-large", "title": "알파벳 레터 카드 (L)", "url": null }
      ]
    }
  ],
  "answerKeyGroups": [
    {
      "id": "alphabet",
      "title": "Alphabet",
      "color": "#d58a12",
      "items": [{ "id": "baro-1", "title": "Baro 1", "url": null }]
    }
  ]
}
```

배열 순서가 화면 순서다. 그룹 ID는 해당 그룹 목록 내, 항목 ID는 소속 그룹 내 고유해야 한다. ID는 이름 변경 시에도 유지한다. title은 표시 문구, subtitle은 선택 사항, color는 6자리 HEX다. items와 두 그룹 목록은 빈 배열을 허용한다.

url은 생략 또는 null이면 준비 중이다. 제공되면 HTTP(S) 또는 루트 상대경로(`/...`)만 허용한다. 실제 Google Drive 보기 링크나 기존 정답지 페이지 링크를 그대로 제공하면 새 탭에서 열린다. 임의의 파일 주소를 생성하거나 다운로드를 가장하지 않는다. 로그인·권한·저장·인쇄는 링크 대상 서비스에서 처리한다. 기존 정답지 서비스 URL 규칙이 아직 제공되지 않아 자동 URL 조립이나 해당 서비스 API 연동은 구현하지 않았다.

## 검증

프로젝트 루트:

```sh
node 'src/app/[locale]/8th/teacher/dodonfriends/resources/_tests/resources.test.cjs'
./node_modules/.bin/eslint 'src/app/[locale]/8th/teacher/dodonfriends'
```

인수 확인: 수업 목록 → Resources → 4개 분류/30개 정답지 → 미등록 링크 비활성화 → 서버 URL 제공 시 새 탭 열기 → 로고/All Lessons 복귀. API의 빈 배열, 오류 상태, 잘못된 JSON 응답도 확인한다. 운영 링크가 제공되면 Google Drive 접근 권한과 정답지 페이지가 실제로 열리는지 추가 확인한다.
