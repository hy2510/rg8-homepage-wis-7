# 도도앤프렌즈 교사용 페이지 인수인계

## 범위와 실행

- 경로: `/ko/8th/teacher/dodonfriends`
- 저장소 루트에서 `npm run dev` 실행. 기존 공통 인증·학생 API·프로젝트 설정은 이번 작업 범위에 포함하지 않는다.
- 목록은 1024px 고정 너비, GNB 높이 80px. 모바일 반응형 목록은 제공하지 않는다.
- 교사 가이드는 모달, Start는 화면 전체를 사용하는 수업 플레이어다. 브라우저가 허용하면 Start 진입 시 네이티브 전체화면도 요청한다.

## 파일별 역할

| 파일 | 역할 |
| --- | --- |
| `page.tsx`, `loading.tsx`, `error.tsx` | 서버 데이터 로딩, 대기, 실패 및 재시도 |
| `_data/types.ts` | 서버 JSON 계약 |
| `_data/courses.ts` | 현재 더미 카탈로그 |
| `_data/catalog.ts` | 서버 전용 API 요청 |
| `_data/parseCatalog.ts` | JSON 유효성 및 ID 검사 |
| `_data/playerEntries.ts` | 단계 데이터를 재생 순서로 변환, 중복 제목 처리 |
| `_components/TeacherHome.tsx` | 목록, 자료 모달, 교사 가이드와 탭 |
| `_components/LessonPlayer.tsx` | 수업 단계 선택, 이전/다음, 전체화면, 닫기 |
| `_components/LessonVideo.tsx` | Start용 수동 재생·탐색·음량·컨트롤 자동 숨김 |
| `_components/GuideVideo.tsx` | 교사 가이드용 수동 재생 영상 |
| `_components/WorkbookPages.tsx` | 이미지 페이지, 정답지, 페이지 번호와 빈 상태 |
| `_components/StableUnityFrame.tsx` | Unity 렌더링 크기 유지 및 화면 배율 조절 |
| `_components/useMediaLifecycle.ts` | 화면 비활성화 시 미디어 정지와 복귀 처리 |
| `_components/TeacherStyles.tsx`, `PlayerStyles.tsx` | 목록/가이드 스타일과 Start 플레이어 스타일 |
| `_components/TeacherStyleRegistry.tsx` | styled-components 서버 렌더링 지원 |

## 서버 연결

`TEACHER_CATALOG_URL`이 없으면 더미 데이터를 사용한다. 설정하면 해당 주소에서 JSON을 요청한다. 선택 사항인 `TEACHER_CATALOG_TOKEN`은 서버에서 Bearer 토큰으로 전송하며 `NEXT_PUBLIC` 변수로 공개하지 않는다.

요청은 캐시 없이 실행하며 제한 시간은 10초다. API 실패나 잘못된 데이터는 오류/재시도 화면을 표시한다. 서버 장애 시 더미로 조용히 대체하지 않는다.

최상위 계약은 `schemaVersion: 1`, `courses`, `resources`다. 과정 → 레벨 → 워크북 → 레슨/리뷰 → 가이드 단계 순서다. 실제 JSON 필드와 선택 여부는 `_data/types.ts`가 기준이다.

- 과정·레벨·워크북·레슨·자료 ID는 카탈로그 전체에서 고유해야 한다.
- 단계·영상·활동 그룹·소탭 ID는 각각 자신이 속한 목록 안에서 고유해야 한다.
- 색상은 6자리 HEX, URL은 HTTP(S) 또는 `/`로 시작하는 내부 경로다.
- `description`은 현재 화면에는 표시하지 않지만 schemaVersion 1에서 필수다.
- `videos`는 순서대로 영상 탭을 만든다. 비어 있으면 레거시 `videoUrl`을 사용한다.
- `activities`는 그룹 탭, `items`는 소탭이다. `url`은 iframe 콘텐츠, `images`는 이미지 목록이다. 둘 다 있으면 `images`가 우선한다.
- `images: []`는 빈 워크북이며 `0 / 0`으로 표시한다. Workbook과 Answer Key에는 각각 순서 있는 이미지 배열을 제공한다.
- 영상/활동의 `teacherGuide: { script, tip }`은 해당 탭의 교사 가이드다. 워크북 이미지에는 가이드를 표시하지 않는다.
- `startUrl`이 있으면 Start는 그 주소로 이동한다. 없으면 단계 콘텐츠로 플레이어를 구성한다. 둘 다 없으면 Start를 비활성화한다.
- 자료의 `url`이 없으면 준비 중 안내를 표시한다.

현재 영상은 A 글자 샘플, Bonus는 homebaking, racing, flowergarden 샘플을 순서대로 사용한다. 워크북 이미지는 비어 있다. 샘플 대사·팁·페이지 정보도 운영 데이터로 교체해야 한다. 서버 API 구현, 교사 권한 확인, 수업 배정과 콘텐츠 제공 서비스의 접근 제어는 별도 연동 작업이다.

## 재생과 전체화면 동작

- Start 영상은 자동 재생하지 않는다. 콘텐츠가 끝나도 다음으로 자동 이동하지 않는다.
- 교사 가이드 영상은 팝업 열기·단계 펼치기·탭 전환 시 자동 재생하지 않는다. 재생 버튼을 눌러 시작한다.
- Start 확대 버튼은 콘텐츠만 확대한다. 축소는 같은 미디어 DOM을 유지하여 전체화면 전환 때문에 Unity가 재생성되지 않게 한다.
- Unity는 내부 1280×720 렌더링 영역을 유지하고 바깥 배율만 변경한다.
- 다른 브라우저 탭으로 이동하면 영상은 일시정지한다. 돌아와도 위치를 유지하고 자동 재개하지 않는다.
- 외부 Unity에는 현재 신뢰할 수 있는 일시정지 API가 없다. 화면을 벗어났을 때 실행을 중단하기 위해 iframe을 비우므로 복귀 시 다시 로드한다. 진행 상태 보존은 제공 서비스의 pause/resume·저장 API 협의가 필요하다.
- 다른 콘텐츠 선택, 가이드 단계 접기, 플레이어 닫기는 해당 미디어를 제거한다.
- 네이티브 전체화면이 지원되지 않으면 화면을 채운 플레이어를 사용한다. 전체화면 종료가 실패해도 닫기는 수행한다.

## 검사

저장소 루트에서 실행한다. 경로의 대괄호 때문에 경로를 반드시 따옴표로 감싼다.

```sh
./node_modules/.bin/eslint 'src/app/[locale]/8th/teacher/dodonfriends'
node 'src/app/[locale]/8th/teacher/dodonfriends/_tests/catalog.test.cjs'
./node_modules/.bin/tsc --noEmit --incremental false
```

데이터 테스트는 중복 ID, 잘못된 URL/버전, 콘텐츠 순서, 워크북 빈 배열 및 중복 제목 처리를 확인한다. 프로젝트 전체 타입 검사에는 교사용 폴더 밖의 book-info 경로 매개변수, HpGroupSearch 타이머, ccc revalidateTag 오류가 남아 있다. 전체 빌드 통과를 의미하지 않는다.

브라우저 인수 테스트: Start 열기/닫기 → 영상 재생·±5초·음량·2초 자동 숨김 → 드래그를 영역 밖에서 종료 → 단계 변경 → 콘텐츠 확대/축소 → Unity 입력 → 워크북/정답지 페이지 이동 → 다른 브라우저 탭 방문 후 복귀. 네이티브 전체화면과 Unity 입력은 실제 운영 브라우저와 전자칠판에서 별도 확인해야 한다.

하단 바의 수업 제목 버튼과 중앙 페이지 번호 버튼은 같은 설정을 사용해 왼쪽 메뉴를 슬라이드로 접고 펼친다. 상태는 브라우저 localStorage의 `dnf:lesson-menu-open`에 저장하며 기본값은 펼침이다. 저장소 접근이 제한되면 현재 세션에서만 적용한다. 이전/다음과 페이지 번호는 하단 바 중앙에 표시한다. 수업 제목은 왼쪽, 확대·닫기는 오른쪽에 배치한다.

Activity 단계의 하위 그룹 표시명은 `Main`(5개)과 `Bonus`(3개)이다. 교사 가이드 탭과 Start 메뉴·콘텐츠 제목은 동일한 데이터의 title을 사용한다. 서버에서도 해당 title을 제공한다. 기존 연동 식별자 `activity`, `extra`는 유지한다.

단계에 영상과 활동이 함께 있으면 교사 가이드와 Start 모두 영상 → 활동 순서로 표시한다. 두 화면은 `getStepMedia`의 동일한 선택 규칙을 사용한다. 플레이어 내부 ID는 콘텐츠 종류와 각 계층 ID의 JSON 배열 문자열로 만들며, 서버 ID를 단순 구분자로 연결하지 않는다.

## Resources 페이지

Resources는 별도 `/resources` 경로로 제공한다. 데이터 계약과 인수인계는 `resources/README.md`를 참고한다. 기존 수업 카탈로그의 resources 필드는 호환성을 위해 유지하지만 화면은 새 Resources 카탈로그를 사용한다.


## 2026-10-12 연동 원복
Step별 eBook/PreK 실행기 및 테스트 세션 연결을 제거했습니다. Main 1~5와 eBook은 기존 homebaking 샘플 URL을 사용합니다. Bonus 1~3 및 Resources 변경은 유지합니다.
