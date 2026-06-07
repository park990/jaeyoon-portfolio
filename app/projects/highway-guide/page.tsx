import type { Metadata } from "next";
import { Section, Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  ProjectHeader,
  ProjectFooter,
} from "@/components/project-detail/layout";
import {
  TechStackGrid,
  TroubleCards,
  LessonsList,
  type Trouble,
} from "@/components/project-detail/blocks";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "highway-guide";
const ACCENT = "#EF4444";
const REPO =
  "https://github.com/CodeGlove/-SIST-Project2-HighwayRestInfo/tree/jaeyoon";

// 메인 랜딩 — 가로형, 풀폭. 페이지 진입 hero.
function HeroShot() {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/hero-landing.png"
        alt="HighwayGuide 메인 랜딩 — 로고 + 네비 + 출발지/목적지 입력 + 길찾기 CTA"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-border/60 bg-background/40 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
        메인 랜딩 — 출발지·목적지를 입력해 경로 내 휴게시설을 한 번에 검색.
      </figcaption>
    </figure>
  );
}

// 휴게소 상세 모달 — portrait. 다대다 role 카드 우측 grid에 박힘.
function BookmarkShot() {
  return (
    <figure className="mx-auto max-w-[220px] overflow-hidden rounded-lg border border-border bg-background/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/favorite-modal.png"
        alt="휴게소 상세 모달 — 우상단 빨간 하트(즐겨찾기 상태)"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-border/60 bg-background/40 px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground">
        빨간 하트 = BookMark 토글
      </figcaption>
    </figure>
  );
}

// Action Controller 설계도 — 직관적 흐름 (URL → 매핑 테이블 → 분기)
function ActionFlowShot() {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border/60 bg-background/40 px-3 py-2 text-[11px] text-muted-foreground">
        MVC Model 2 — Action Controller
      </div>

      <div className="space-y-3 p-4">
        {/* 1. 요청 */}
        <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-center text-xs">
          <span className="text-muted-foreground">Browser</span>
          <span className="ml-2 font-mono text-[var(--accent)]">GET /login.do</span>
        </div>
        <div className="text-center text-sm text-muted-foreground" aria-hidden>
          ▼
        </div>

        {/* 2. FrontController + 라우팅 테이블 (핵심) */}
        <div className="rounded-md border-2 border-[var(--accent)]/50 bg-[var(--accent)]/5">
          <div className="border-b border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-2 text-center text-xs font-semibold text-foreground">
            FrontController
            <span className="ml-1 font-normal text-muted-foreground">
              (URL → Action 매핑)
            </span>
          </div>
          <div className="space-y-1 px-3 py-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--accent)]">/login.do</span>
              <span className="text-muted-foreground">→</span>
              <span className="flex-1 text-right text-foreground">LoginAction</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--accent)]">/list.do</span>
              <span className="text-muted-foreground">→</span>
              <span className="flex-1 text-right text-foreground">RestAreaListAction</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--accent)]">/favor.do</span>
              <span className="text-muted-foreground">→</span>
              <span className="flex-1 text-right text-foreground">FavoriteAction</span>
            </div>
          </div>
        </div>

        {/* 3. Action 실행 */}
        <div className="text-center text-sm text-muted-foreground" aria-hidden>
          ▼
        </div>
        <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-center text-xs text-foreground">
          Action.<span className="font-mono text-foreground">execute()</span>
        </div>

        {/* 4. 두 갈래 응답 분기 */}
        <div className="text-center text-sm text-muted-foreground" aria-hidden>
          ▼
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border bg-card px-3 py-2 text-center">
            <p className="font-semibold text-foreground">JSP 화면</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">페이지 이동</p>
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2 text-center">
            <p className="font-semibold text-foreground">JSON 응답</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">AJAX</p>
          </div>
        </div>

        {/* 5. 강결합 경고 */}
        <div className="flex items-start gap-2 rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-2 text-xs">
          <span className="text-[var(--accent)]">⚠</span>
          <span className="flex-1 text-foreground/85">
            한 Action 안에 두 응답 방식이 섞임 → <span className="text-[var(--accent)]">강결합</span>
          </span>
        </div>
      </div>
    </figure>
  );
}

// MySQL users 테이블 — 2번 role 우측. 실제 MySQL 클라이언트 캡처.
function UserTableShot() {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/users-table.png"
        alt="MySQL users 테이블 — user_idx, user_id, user_pw 컬럼에 BCrypt 해시 저장"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-border/60 bg-background/40 px-3 py-2 text-[11px] leading-snug text-muted-foreground">
        실제 <span className="text-foreground">UserVO</span> 테이블 — user_pw 컬럼 = BCrypt hash (평문 저장 X)
      </figcaption>
    </figure>
  );
}

// slide 7 흐름: 입력 위젯(image9) → ↓ → 경로상 휴게시설 결과(image8)
// 다른 figure와 100% 동일 패턴: figure overflow-hidden + img 직접 + figcaption
function SearchResultShot() {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/search-input.png"
        alt="출발지·도착지 입력 위젯 — 서울 종로구 사직로 161 / 대전 서구 둔산대로 169 / 길찾기 버튼"
        loading="lazy"
        className="block h-auto w-full"
      />
      <div
        className="flex justify-center border-y border-border/60 bg-background/40 py-2 text-xl text-muted-foreground"
        aria-hidden
      >
        ↓
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/search-result.png"
        alt="경로상 휴게시설 결과 카드 리스트 (편의시설·주유비·평점·대표메뉴)"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-border/60 bg-background/40 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
        출발지·도착지 입력 → 경로상 휴게시설을 카드로 표출 (편의시설 · 주유비 · 평점 · 대표메뉴).
      </figcaption>
    </figure>
  );
}

// 좌측 텍스트 + 우측 시각자료 카드. wide=true면 우측 visual을 더 넓게.
// description(prose 한 단락) 또는 bullets(존댓말 항목) 중 하나를 받음.
function RoleGridCard({
  n,
  title,
  bullets,
  description,
  visual,
  wide = false,
}: {
  n: number;
  title: string;
  bullets?: string[];
  description?: string;
  visual: React.ReactNode;
  wide?: boolean;
}) {
  const textSpan = wide ? "sm:col-span-2" : "sm:col-span-3";
  const visualSpan = wide ? "sm:col-span-3" : "sm:col-span-2";

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-5 sm:items-start">
        <div className={textSpan}>
          <div className="mb-3 flex items-start gap-3">
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-xs font-semibold"
              style={{ color: ACCENT }}
            >
              {n}
            </span>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>
          </div>
          {description ? (
            <p className="ml-10 text-sm leading-[1.8] text-foreground/85">
              {description}
            </p>
          ) : (
            <ul className="ml-10 space-y-2 text-sm leading-[1.8] text-foreground/85">
              {bullets?.map((b) => (
                <li key={b} className="relative pl-4">
                  <span
                    className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden="true"
                  />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={visualSpan}>{visual}</div>
      </div>
    </div>
  );
}


export const metadata: Metadata = {
  title: "HighWay Guide · Jaeyoon Park",
  description:
    "첫 풀스택 — BCrypt + HttpSession 인증, 다대다 관계 첫 설계, Action 강결합의 한계를 직접 체감.",
};

const techStack = [
  { category: "Frontend", items: ["JSP", "JavaScript", "AJAX", "Kakao Map · Mobility API", "Naver Geocoding API"] },
  {
    category: "Backend",
    items: [
      "Java Servlet (MVC Model 2)",
      "MyBatis",
      "BCrypt",
      "HttpSession",
      "OAuth 2.0 (Kakao · Naver)",
      "JavaMail (Gmail SMTP)",
    ],
  },
  { category: "Database", items: ["MySQL"] },
];

// 3개 role을 한 객체로 묶음 — 모두 좌측 텍스트 + 우측 시각자료 grid 카드로 렌더.
// actionRole만 description(prose 한 단락), 나머지는 bullets(존댓말 항목).
const actionRole = {
  title: "MVC Model 2 Front Controller 설계 (Action 라우팅 전체)",
  description:
    "MVC Model 2를 직접 설계해 흐름을 이해했지만, 하나의 Action에서 request.setAttribute(JSP용)와 PrintWriter JSON 직조립(AJAX용)이 뒤섞이는 강결합 구조가 발생했습니다. 사소한 UI 수정에도 자바 코드와 서버 재빌드가 필요했고, 이 한계가 다음 프로젝트 HirePicker에서 Next.js + Spring REST 분리 결정의 근거가 되었습니다.",
};

const authRole = {
  title: "BCrypt 비밀번호 해시 + HttpSession 기반 사용자 인증",
  bullets: [
    "회원가입 시 BCrypt로 비밀번호를 해시해 DB에 저장했습니다 (토큰 개념 없이 평문 비교만 차단).",
    "로그인 성공 시 HttpSession에 loginUser(UserVO)를 적재해 이후 마이페이지·즐겨찾기에서 재사용했습니다.",
    "이때는 JWT를 도입하지 않고, 단일 서버 가정 하의 가장 단순한 형태로 출발했습니다.",
  ],
};

// Part 1 — "What I built": 단순 구현 작업 망라 (발전 narrative와 분리)
const builtItems = [
  "BCrypt 비밀번호 해시 + HttpSession 사용자 인증",
  "OAuth 2.0 소셜 로그인 (Kakao · Naver)",
  "Google SMTP 기반 이메일 인증 + 비밀번호 재발급",
  "Kakao Map · Mobility API 지도/경로 시각화",
  "Naver Geocoding API 좌표 변환",
  "AJAX 비동기 통신 (즐겨찾기 실시간 토글 등)",
  "MVC Model 2 Front Controller (Action 라우팅 설계)",
];

const bookmarkRole = {
  title: "휴게소-사용자 다대다 관계 첫 설계 (BookMark 테이블)",
  bullets: [
    "한 사용자가 여러 휴게소를 좋아요할 수 있고, 한 휴게소도 여러 사용자에게 좋아요 받을 수 있는 다대다(N:M) 관계를 BookMark 연결 테이블로 처음 모델링했습니다.",
    "AJAX로 하트를 토글했고, add/delete 액션과 휴게소 PK(saKey) + 사용자 PK 조합으로 복합 PK를 구성했습니다.",
    "지도·경로·마이페이지 세 페이지에서 같은 상태를 봐야 했지만 모달이 페이지마다 복사되어 데이터 불일치가 발생해, modal.jsp 분리와 공통 JS로 정리했습니다.",
  ],
};

const troubles: Trouble[] = [
  {
    title: "HttpSession Stateful 한계 — 토큰 없는 단일 서버 의존",
    star: true,
    problem:
      "첫 풀스택이라 가장 직관적인 HttpSession + 평문 비밀번호 → BCrypt 해시 구조로 출발했습니다. 단일 서버에서는 문제가 없었지만, Scale-out 가정에서는 세션 불일치와 메모리 부하라는 Stateful의 근본 한계가 보였습니다. 이때는 토큰(JWT)을 아예 도입하지 않았습니다.",
    solve:
      "이 프로젝트 안에서는 해결하지 않고 한계를 그대로 인정하며 마무리했습니다. 다음 프로젝트 HirePicker에서 무상태(Stateless) JWT 도입의 결정 근거가 되었습니다.",
    lesson:
      "처음엔 ‘JWT가 더 좋다던데’ 정도만 알고 도입을 고민했는데, 단일 서버 가정에 가장 잘 맞는 HttpSession으로 끝까지 가봤습니다. 그렇게 한 번 깔끔하게 마무리한 한계가 다음 프로젝트(HirePicker)에서 JWT로 옮길 때 ‘왜 옮기는지’의 직접 근거가 됐습니다.",
  },
  {
    title: "Action 클래스 한 곳에서 JSP Forward + JSON 응답 동시 처리",
    star: true,
    problem:
      "MVC Model 2 자체는 직접 설계해 흐름을 이해했지만, 한 Action 안에서 request.setAttribute(뷰용)와 PrintWriter JSON 직조립(AJAX용)이 뒤섞였습니다. 사소한 UI 수정에도 자바 코드 수정과 서버 재빌드가 필요한 강결합이었습니다.",
    solve:
      "이 프로젝트에서는 구조를 그대로 유지했고, 다음 프로젝트 HirePicker에서 Next.js(렌더링) + Spring Boot REST(순수 JSON)로 완전 분리하는 결정 근거가 되었습니다.",
    lesson:
      "버튼 위치 하나 옮기는 정도의 UI 수정에도 Action 자바 코드를 고치고 서버 재빌드를 기다려야 했습니다. 며칠 반복하고 나니 다음 프로젝트(HirePicker)에선 Next.js + Spring REST로 프론트/백을 분리한 게 자연스러운 결정이었습니다.",
  },
];

const bookmarkCode = `-- 다대다 관계 첫 설계 — BookMark 연결 테이블
CREATE TABLE bookmark (
  user_idx   BIGINT NOT NULL,
  sa_key     VARCHAR(50) NOT NULL,
  PRIMARY KEY (user_idx, sa_key),
  FOREIGN KEY (user_idx) REFERENCES users(idx),
  FOREIGN KEY (sa_key)   REFERENCES rest_area(sa_key)
);

-- AJAX 토글: action="add" or "delete" + saKey + 세션 loginUser
-- 다음 프로젝트(HirePicker)에서는 같은 패턴을 공고-사용자 관계로 재설계
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
        oneLiner="가장 단순한 형태(BCrypt + HttpSession + Action Forward)로 출발해, 그 한계를 다음 프로젝트의 결정 근거로 들고 갈 수 있게 만든 출발점."
        period="2025.07 ~ 2025.08"
        team="5명"
        links={[{ label: "GitHub", href: REPO }]}
      />

      {/* Hero — 메인 랜딩 */}
      <div className="-mt-2 mb-12">
        <HeroShot />
      </div>

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            JSP/Servlet 기반의 첫 풀스택 프로젝트입니다. 아는 것이 별로
            없어서{" "}
            <span className="font-medium text-foreground">가장 단순한 형태</span>
            로 끝까지 가봤습니다. JWT 없이 BCrypt + HttpSession을 사용했고, JSP
            Forward와 AJAX JSON을 한 Action에서 같이 처리하는 구조였습니다. 그
            단순함이 만든 한계가 그대로 다음 프로젝트(HirePicker)의 기술 선택
            근거가 되었기에, 이 프로젝트의 가치는 결과물보다{" "}
            <span className="font-medium text-foreground">
              학습 사이클의 출발점
            </span>
            에 있습니다.
          </p>
        </Prose>
        <div className="mt-6">
          <SearchResultShot />
        </div>
      </Section>

      <Section id="stack" title="Tech Stack">
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          ※ <span className="text-foreground">직접 다룬 영역</span>의 기술 세트.
        </p>
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        {/* Part 1 — What I built (보조 정보, 톤다운) */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold tracking-tight text-foreground/70">
            What I built
          </h3>
          <p className="mt-1 text-xs text-muted-foreground/80">
            이 프로젝트에서 직접 구현한 영역
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[13px] leading-[1.6] text-foreground/65 sm:grid-cols-2">
            {builtItems.map((b) => (
              <li key={b} className="relative pl-4">
                <span
                  className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full bg-muted-foreground/60"
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* 두 섹션 시각 구분 — 얇은 구분선 + 충분한 여백 */}
        <div className="my-12 border-t border-border/40 sm:my-16" />

        {/* Part 2 — What carried forward (핵심 정보, 강조) */}
        <div>
          {/* 헤딩만 감싸는 좌측 빨강 액센트 보더 — "이게 핵심" 시각 신호 */}
          <div className="border-l-[3px] border-[var(--accent)] pl-4 sm:pl-5">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What carried forward
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              다음 프로젝트의 결정 근거가 된 학습 사이클
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <RoleGridCard n={1} {...actionRole} visual={<ActionFlowShot />} />
            <RoleGridCard n={2} {...authRole} visual={<UserTableShot />} />
            <RoleGridCard n={3} {...bookmarkRole} visual={<BookmarkShot />} />
          </div>
        </div>
      </Section>

      <Section id="evolution" title="Evolution — 다음 프로젝트로의 발전">
        <Prose>
          <p>
            이 프로젝트의 세 가지 한계가 그대로 HirePicker의 결정으로 이어졌습니다.
          </p>
        </Prose>
        <div className="mt-5 space-y-3">
          <EvolutionRow
            from="BCrypt + HttpSession (Stateful)"
            to="JWT 도입 (Stateless) — Access Token + Refresh Token"
            note="단일 서버 가정의 세션이 Scale-out 가정에서 깨질 것을 체감 → 무상태 토큰 인증으로 전환"
          />
          <EvolutionRow
            from="Action 한 곳에서 JSP Forward + JSON 응답"
            to="Next.js(렌더링) + Spring Boot REST(순수 JSON) 분리"
            note="UI 수정에도 자바 + 재빌드가 필요한 강결합 고통 → 프론트/백 완전 분리"
          />
          <EvolutionRow
            from="휴게소-사용자 다대다 (BookMark, 첫 시도)"
            to="공고-사용자 즐겨찾기 다대다를 더 정확하게 재설계"
            note="3페이지 상태 불일치 + 모달 코드 중복으로 데이터 정합성 깨짐 → 다음 프로젝트에서 동일 패턴을 더 깔끔히"
          />
        </div>
      </Section>

      <Section id="code" title="Code Highlight">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            다대다 관계 첫 설계 — 다음 프로젝트에서 같은 패턴을 재사용할 토대가
            되었습니다.
          </p>
          <CodeBlock code={bookmarkCode} lang="sql" filename="BookMark 테이블 + 토글 패턴" />
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "아는 게 별로 없어서 단일 서버·HttpSession·MyBatis 같은 가장 단순한 형태로 끝까지 가봤습니다. 그러고 나니 '왜 분리하고 왜 무상태로 가는지'가 다음 라운드(HirePicker)에서 훨씬 또렷한 결정 근거로 남았습니다.",
            "'프론트/백 분리, 무상태 토큰, 연결 테이블 정합성' 같은 말은 책으로 읽을 땐 그냥 좋은 말이었는데, 빌드 사이클·세션 끊김·다대다 불일치를 며칠 겪고 나니 같은 문장이 다르게 읽혔습니다. 다음 프로젝트들의 결정 근거가 이 마찰들에서 그대로 나왔습니다.",
          ]}
        />
      </Section>

      {/* 마지막 프로젝트라 ProjectFooter의 "다음 프로젝트" 카드는 자동으로 숨겨짐 */}
      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}

// 전 → 후 비교 한 줄.
function EvolutionRow({ from, to, note }: { from: string; to: string; note: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
        <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-foreground/85">
          {from}
        </div>
        <span className="hidden text-muted-foreground sm:block" aria-hidden>
          →
        </span>
        <div className="rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/5 px-3 py-2 text-sm text-foreground">
          {to}
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}
