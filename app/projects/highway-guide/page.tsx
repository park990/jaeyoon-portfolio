import type { Metadata } from "next";
import { Section, Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  ProjectHeader,
  ProjectFooter,
} from "@/components/project-detail/layout";
import {
  TechStackGrid,
  MyRoleCards,
  TroubleCards,
  LessonsList,
  type Role,
  type Trouble,
} from "@/components/project-detail/blocks";
import { getProjectBySlug } from "@/lib/projects";

// 본문 안 이미지 + 캡션 묶음.
function ProjectImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      {/* PNG 정적 자산. next/image보다 일반 img가 단순하고 같은 결과. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-border/60 bg-background/40 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

const SLUG = "highway-guide";
const ACCENT = "#EF4444";
const REPO =
  "https://github.com/CodeGlove/-SIST-Project2-HighwayRestInfo/tree/jaeyoon";

export const metadata: Metadata = {
  title: "HighWay Guide · Jaeyoon Park",
  description:
    "고속도로 통합 정보 플랫폼 — OAuth(Kakao·Naver), 이메일 인증, KakaoMap·CCTV·즐겨찾기 실시간 동기화, Selenium 리뷰 크롤러 담당",
};

const techStack = [
  {
    category: "Frontend",
    items: ["JSP", "JavaScript", "AJAX (Fetch API)", "Kakao Map JS API"],
  },
  {
    category: "Backend",
    items: [
      "Java Servlet (MVC Model 2)",
      "MyBatis",
      "HttpSession",
      "BCrypt",
      "Jakarta Mail (Google SMTP)",
    ],
  },
  {
    category: "External API",
    items: [
      "Kakao OAuth + Map · Mobility",
      "Naver OAuth + Geocoding",
      "ITS 국가교통정보 OpenAPI (CCTV)",
    ],
  },
  {
    category: "Database",
    items: ["MySQL", "BookMark N:M 테이블"],
  },
  {
    category: "Data Collection",
    items: ["Python Selenium", "Pandas DataFrame", "Batch Insert"],
  },
];

const roles: Role[] = [
  {
    title: "OAuth 2.0 소셜 로그인 (Kakao · Naver)",
    bullets: [
      "3단계 흐름 구현 — 인가코드 요청 → access_token 교환(POST kauth.kakao.com/oauth/token) → 사용자 정보 조회(kapi.kakao.com/v2/user/me)",
      "state 파라미터로 CSRF 방어 (request session 저장 + callback에서 비교)",
      "KakaoCallbackAction / NaverCallbackAction 두 액션으로 각 플랫폼 콜백 처리",
      "성공 시 HttpSession에 loginUser(UserVO) 적재 → 이후 마이페이지·즐겨찾기 등에서 재사용",
    ],
  },
  {
    title: "이메일 인증 (Google SMTP)",
    bullets: [
      "6자리 난수 코드 생성 후 HttpSession에 code + email 저장",
      "Jakarta Mail + Gmail SMTP(587/STARTTLS), Authenticator로 비밀번호 인증",
      "HTML 본문으로 큰 글씨 코드 + 안내 텍스트 발송",
      "회원가입 / 비밀번호 재설정 두 용도 분기 (purpose 파라미터)",
      "EmailConfirmAction에서 세션 코드와 사용자 입력 비교 → JSON 응답으로 다음 단계 활성화",
    ],
  },
  {
    title: "Kakao Map — 휴게소·CCTV 시각화",
    bullets: [
      "휴게소 키워드 검색: AJAX(searchText) → Servlet LIKE 쿼리 → JSON 응답 → 카카오맵 마커 + 첫 결과 위치로 setCenter/setLevel",
      "지역 드롭다운 + GeoJSON 행정구역 폴리곤 비동기 로드 → 선택 지역만 반투명 레이어로 시각화",
      "MarkerClusterer 라이브러리 — 줌 레벨별 그룹화, 클릭 시 확대, viewport 변경 시 AJAX로 해당 영역만 부분 갱신",
      "Drill-down 인터랙션 — 광역(클러스터) → 지역(줌인) → 상세(개별 마커 클릭) 끊김 없는 탐색 흐름",
    ],
  },
  {
    title: "CCTV 실시간 영상 — Bounding Box + Video.js 다중 플레이어",
    bullets: [
      "CctvAction: minX/minY/maxX/maxY 4좌표를 ITS OpenAPI(openapi.its.go.kr:9443/cctvInfo)에 전달해 해당 범위 CCTV만 선별",
      "Modal 동적 생성 — 응답받은 CCTV 개수만큼 Video.js 플레이어 인스턴스 생성 + 스트리밍 URL 바인딩",
      "Modal 닫을 때 모든 인스턴스 dispose() 호출 — 메모리 누수 방지 (페이지 이탈 후에도 영상이 백그라운드에서 살아있던 버그 해결)",
      "클라이언트 사이드 거리 계산 — 화면 내 휴게소-CCTV 1km 이내만 동적 표시, drag/zoom 이벤트 연동",
    ],
  },
  {
    title: "즐겨찾기 — N:M 관계 + 3페이지 실시간 동기화",
    bullets: [
      "User-RestArea N:M 관계를 BookMark 테이블로 분리 (PK는 두 외래키 조합)",
      "HeartBookmarkAction: HttpSession loginUser 확인 → action=add|delete + saKey로 BookmarkDAO 토글 → JSON 응답",
      "지도/경로 결과/마이페이지 3개 페이지에서 즐겨찾기 상태가 다르게 보이던 데이터 불일치 문제를 AJAX 실시간 동기화로 해결",
      "isFavorite Boolean에 따른 하트 채움/비움 조건부 렌더링",
    ],
  },
  {
    title: "마이페이지 + Python 리뷰 크롤러",
    bullets: [
      "마이페이지 전체(정보 수정 / 즐겨찾기 관리 / 회원 탈퇴) 단독 구현",
      "Python + Selenium + Pandas로 휴게소 리뷰 수집 — SPA·iframe 탐색, 무한 스크롤 처리, CSS Selector 정밀 파싱",
      "Pandas DataFrame → Excel 1차 저장 → REVIEWS 테이블 Batch Insert로 안전한 대량 적재",
      "리뷰 검색 API + 카드 형태 UI로 표출",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "전국 수백 개 마커 → 초기 로딩 폭주",
    star: true,
    problem:
      "전국 휴게소와 CCTV 마커를 지도에 한 번에 렌더링하니 브라우저 DOM 요소 수가 폭발해 초기 로딩이 매우 느려지고 드래그/줌도 끊김.",
    solve:
      "Kakao Map의 MarkerClusterer 라이브러리 도입. 줌 레벨에 따라 인접 마커를 자동 그룹핑 → 초기 렌더링 DOM 수를 한 자리수로 압축. 거기에 viewport 이벤트(drag/zoom)에 AJAX 부분 갱신을 연결해 보이는 영역만 비동기 로드 → 초기 로딩 + 상호작용 둘 다 체감 개선.",
    lesson:
      "성능 문제는 '데이터를 줄이는 것'보다 '한 번에 그리는 것을 줄이는 것'이 더 효과적일 때가 많다",
  },
  {
    title: "부정확한 휴게소 좌표 — 1차 지오코딩의 한계",
    problem:
      '공공데이터 휴게소 주소를 지오코딩하면 일부가 실제 위치와 다르게 잡힘. "(서울방향)" 같은 부가 텍스트나 외곽 산 지번이 원인.',
    solve:
      "1차로 변환된 좌표를 Kakao Map의 '키워드로 장소 검색하기' API로 교차 검증. 휴게소 이름으로 검색된 장소의 좌표와 비교해 차이가 크면 키워드 검색 결과로 보정 → 데이터 정제 단계에 일관 적용.",
    lesson:
      "외부 API 단일 결과를 신뢰하지 말고 같은 정답을 두 가지 경로로 확인하는 교차 검증이 안전",
  },
  {
    title: "CCTV 영상이 Modal 닫은 후에도 계속 살아있음",
    star: true,
    problem:
      "Modal 안에 Video.js 인스턴스를 여러 개 동적 생성하다 보니, Modal을 닫아도 인스턴스가 메모리에 남아 영상 디코딩 스레드가 계속 돌고 다른 페이지로 이동해도 자원 사용이 줄지 않음.",
    solve:
      "Modal 닫기 이벤트에서 생성했던 모든 Video.js 인스턴스를 순회하며 dispose() 호출. 인스턴스 배열을 별도 보관하다가 한 번에 정리하는 패턴으로 정착.",
    lesson:
      "동적으로 만든 자원은 동적으로 회수해야 한다 — '닫으면 사라지겠지'는 가비지 컬렉터의 일이 아니라 명시적 dispose의 일",
  },
  {
    title: "3개 페이지의 즐겨찾기 상태 불일치",
    star: true,
    problem:
      "마이페이지에서 즐겨찾기를 해제했는데 지도에서는 하트가 그대로 빨갛게 남아있는 등, 같은 사용자의 같은 데이터가 페이지마다 다르게 보임. 또한 동일한 모달 코드가 3개 페이지에 복사되어 작은 수정도 3번씩 해야 함.",
    solve:
      "모달을 별도 modal.jsp + 공통 JS로 분리하고 <jsp:include>로 각 페이지에 삽입. AJAX HeartBookmarkAction 응답이 오면 세 페이지가 공유하는 상태/하트 UI를 같이 갱신하는 흐름으로 통일.",
    lesson:
      "데이터 일관성은 백엔드의 책임이지만, 사용자가 느끼는 일관성은 프론트의 상태 동기화에서 결정된다",
  },
];

const oauthCode = `// KakaoCallbackAction.execute — 3단계 OAuth의 (2)번 token 교환
String returnedState = request.getParameter("state");
String storedState = (String) request.getSession().getAttribute("kakao_state");
// state 검증 (CSRF 방어)

String code = request.getParameter("code");
URL url = new URL("https://kauth.kakao.com/oauth/token");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("POST");
conn.setDoOutput(true);

try (BufferedWriter bw = new BufferedWriter(
        new OutputStreamWriter(conn.getOutputStream()))) {
    String body = "grant_type=authorization_code"
        + "&client_id="    + ConfigLoader.getProperty("KAKAO_CLIENT_ID")
        + "&redirect_uri=" + REDIRECT_URI
        + "&code="         + code;
    bw.write(body); bw.flush();
}

// access_token 파싱 후 kapi.kakao.com/v2/user/me 호출 → loginUser 세션 적재
JSONObject json = (JSONObject) new JSONParser().parse(readResponse(conn));
String accessToken = (String) json.get("access_token");
getUserInfo(accessToken, request);
`;

const emailCode = `// EmailSendAction — 6자리 난수 + Gmail SMTP + HTML 본문
int code = new Random().nextInt(899999) + 100000;   // 100000~999999
HttpSession session = request.getSession();
session.setAttribute("code", code);
session.setAttribute("email", email);

Properties props = new Properties();
props.put("mail.smtp.host", "smtp.gmail.com");
props.put("mail.smtp.port", "587");
props.put("mail.smtp.auth", "true");
props.put("mail.smtp.starttls.enable", "true");   // TLS 업그레이드

Authenticator auth = new Authenticator() {
    protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(fromEmail, password);
    }
};

MimeMessage msg = new MimeMessage(Session.getInstance(props, auth));
msg.setFrom(new InternetAddress(fromEmail, "HighwayGuide 관리자"));
msg.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
msg.setSubject("[HighwayGuide] 회원가입 이메일 인증번호입니다.");
msg.setContent(
    "<h2>안녕하세요, HighwayGuide 입니다.</h2>"
  + "<div style='font-size:100px; font-weight:bold;'>" + code + "</div>"
  + "<p>인증번호를 회원가입 창에 입력해주세요.</p>",
    "text/html; charset=utf-8");
Transport.send(msg);
`;

const cctvCode = `// CctvAction — 화면 가시 영역(Bounding Box)만 CCTV 조회
String minX = request.getParameter("minX");
String minY = request.getParameter("minY");
String maxX = request.getParameter("maxX");
String maxY = request.getParameter("maxY");

StringBuilder url = new StringBuilder("https://openapi.its.go.kr:9443/cctvInfo");
url.append("?apiKey=").append(URLEncoder.encode(apiKey, "UTF-8"))
   .append("&type=all")
   .append("&cctvType=4")            // 4 = HLS 영상 스트림
   .append("&minX=").append(minX).append("&maxX=").append(maxX)
   .append("&minY=").append(minY).append("&maxY=").append(maxY)
   .append("&getType=json");

// JSON 응답을 그대로 프론트로 전달 → Video.js 인스턴스 동적 생성
HttpURLConnection conn = (HttpURLConnection) new URL(url.toString()).openConnection();
conn.setRequestMethod("GET");
// ... 응답을 response.getWriter()에 그대로 write
`;

export default function HighwayGuidePage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="OAuth(Kakao·Naver) + Google SMTP 이메일 인증, Kakao Map·MarkerClusterer·GeoJSON 시각화, CCTV Bounding Box 조회 + Video.js dispose, 즐겨찾기 3페이지 실시간 동기화, Python 리뷰 크롤러까지 — 첫 풀스택 프로젝트에서 사용자 경험 가로축 담당."
        period="2025.07 ~ 2025.08"
        team="5명"
        links={[{ label: "GitHub", href: REPO }]}
      />

      {/* Hero — 메인 랜딩 화면. "이게 어떤 서비스인지"를 한 장에. */}
      <div className="-mt-2 mb-12">
        <ProjectImage
          src="/projects/highway-guide/hero-landing.png"
          alt="HighwayGuide 메인 랜딩 화면 — 로고 + 네비 + '경로내 휴게시설 검색' 타이틀 + 출발지/목적지 입력 + 길찾기 CTA"
          caption="메인 랜딩 화면 — 출발지·목적지를 입력하면 경로 내 휴게시설을 한 번에 검색."
        />
      </div>

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            JSP/Servlet 기반 고속도로 이용자를 위한 통합 정보(휴게소·CCTV·리뷰)
            제공 플랫폼. 첫 풀스택 프로젝트로 MVC Model 2 아키텍처 위에서, 사용자
            로그인부터 지도 위 정보 탐색·즐겨찾기 관리까지 가로축 사용자 경험
            전반을 담당했습니다.
          </p>
          <p>
            여러 앱을 오가며 고속도로 정보를 찾던 정보 파편화 문제를 원스톱
            플랫폼으로 풀고 싶었습니다. 외부 API 4종(Kakao OAuth·Map, Naver
            OAuth·Geocoding, ITS CCTV, Google SMTP)을 한 화면 안에 묶어내는 과정에서
            동기적 JSP가 가진 한계를 직접 체감한 것이, 다음 프로젝트
            HirePicker에서 Next.js + JWT + Redis로 전환하는 결정 근거가 되었습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />

        {/* 광역 클러스터러 ↔ 줌인 휴게소 카드 좌우 비교 (모바일은 세로) */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <ProjectImage
            src="/projects/highway-guide/map-overview.png"
            alt="Kakao Map 전국 광역 뷰 + MarkerClusterer 적용 (지역별 숫자 마커)"
            caption="MarkerClusterer 광역 뷰 — 전국 휴게소가 거리별로 그룹핑되어 숫자 마커로 표시됨. 휴게소 이름 검색·CCTV 검색·주변 CCTV 켜기 컨트롤 노출."
          />
          <ProjectImage
            src="/projects/highway-guide/map-zoom-detail.png"
            alt="지도 줌인 — 양주휴게소 마커 + 정보 카드 노출"
            caption="줌인 후 개별 휴게소 마커 클릭 → 사이드 정보 카드. 광역(클러스터) → 지역(줌인) → 상세(마커 클릭) 드릴다운 흐름."
          />
        </div>

        {/* CCTV 다중 플레이어 — 페이지에서 가장 임팩트 큰 장면 */}
        <div className="mt-5">
          <ProjectImage
            src="/projects/highway-guide/cctv-modal.png"
            alt="CCTV 다중 영상 모달 — Video.js 플레이어 3개가 동시 재생 중"
            caption="CCTV Bounding Box 조회 → Video.js 다중 인스턴스로 동시 재생. 모달 닫을 때 모든 인스턴스 dispose()로 메모리 누수 방지."
          />
        </div>

        {/* 즐겨찾기 모달 — portrait이라 좌측 콘텐츠 + 우측 이미지로 묶음 */}
        <div className="mt-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-5">
            {/* 좌측 텍스트: 모달의 핵심 요소를 짚어줌 */}
            <div className="sm:col-span-3 space-y-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                휴게소 상세 모달
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                지도 · 경로 결과 · 마이페이지에 공통 삽입되는 모달
              </h3>
              <ul className="space-y-2 text-sm leading-[1.7] text-foreground/85">
                <li className="relative pl-4">
                  <span
                    className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden="true"
                  />
                  우상단 <span className="font-medium text-foreground">빨간 하트</span> = 즐겨찾기 상태.
                  토글 시 AJAX로 BookMark 테이블에 add/delete.
                </li>
                <li className="relative pl-4">
                  <span
                    className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden="true"
                  />
                  3개 페이지에서 동일 모달 코드가 중복되던 문제를{" "}
                  <span className="font-medium text-foreground">modal.jsp + jsp:include</span>로
                  단일 컴포넌트화.
                </li>
                <li className="relative pl-4">
                  <span
                    className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden="true"
                  />
                  하트 토글 응답이 오면 세 페이지가 공유하는 상태와 UI를 동시 갱신 → 데이터 일관성 + 일관된 UX.
                </li>
              </ul>
            </div>

            {/* 우측 이미지: portrait 비율을 카드 안에 가둠 */}
            <div className="sm:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/highway-guide/favorite-modal.png"
                alt="휴게소 상세 모달 — 우상단 빨간 하트(즐겨찾기 삭제 툴팁) + 위치/연락처/AI 추천코멘트/주차/주유가격"
                loading="lazy"
                className="mx-auto block h-auto w-full max-w-[260px] rounded-lg border border-border sm:max-w-none"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Kakao OAuth 콜백에서 인가코드를 access_token으로 교환하는 부분.
              state 검증 + POST 토큰 요청 + 사용자 정보 조회.
            </p>
            <CodeBlock
              code={oauthCode}
              lang="java"
              filename="KakaoCallbackAction.java"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              6자리 난수 코드를 HttpSession에 저장하고 Gmail SMTP(587/STARTTLS)로
              HTML 메일 발송. 회원가입·비밀번호 재설정 모두 동일 패턴.
            </p>
            <CodeBlock
              code={emailCode}
              lang="java"
              filename="EmailSendAction.java"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              화면에 보이는 가시 영역(Bounding Box)만 CCTV 조회 — minX/maxX/minY/maxY
              4좌표로 ITS OpenAPI에 위임해 클라이언트가 받을 데이터량을 최소화.
            </p>
            <CodeBlock code={cctvCode} lang="java" filename="CctvAction.java" />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "성능 최적화는 '데이터를 줄이는 것'이 아니라 '한 번에 그리는 것을 줄이는 것'이라는 감각을 클러스터링과 viewport 부분 갱신을 통해 익혔다.",
            "동적으로 만든 자원(Video.js 인스턴스)은 명시적 dispose가 필요하다 — '닫으면 사라지겠지'는 가비지 컬렉터의 일이 아니다.",
            "데이터 일관성은 백엔드의 책임이지만, 사용자가 느끼는 일관성은 프론트의 상태 동기화에서 결정된다.",
            "JSP의 강결합 구조와 HttpSession 기반 인증의 한계를 직접 체감한 것이 다음 프로젝트 HirePicker의 JWT+Redis·Next.js 분리 결정 근거가 됐다.",
          ]}
        />
      </Section>

      {/* 마지막 프로젝트라 ProjectFooter의 "다음 프로젝트" 카드는 자동으로 숨겨짐 */}
      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
