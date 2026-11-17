import type { Metadata } from "next";
import { Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  TechStackGrid,
  ItemTitle,
  troubleItems,
  lessonItems,
  PlainList,
  type Trouble,
} from "@/components/project-detail/blocks";
import { CaseLayout } from "@/components/case/case-layout";
import { CaseSection, SubHead, type CaseSectionMeta } from "@/components/case/case-parts";
import { Graded } from "@/components/case/evidence";
import { LineText, type Line } from "@/components/project-detail/blocks";
import { getProjectBySlug, HIGHWAY_SERVICE_LINE } from "@/lib/projects";

const SLUG = "highway-guide";
const project = getProjectBySlug(SLUG)!;

// 시각 규칙: 무채색 · 한 열. 스크린샷은 리포의 실제 화면(public/projects/highway-guide).

// 메인 랜딩 — 가로형, 풀폭. 페이지 진입 hero.
function HeroShot() {
  return (
    <figure className="overflow-hidden border border-rule">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/hero-landing.png"
        alt="HighwayGuide 메인 랜딩 — 로고 + 네비 + 출발지/목적지 입력 + 길찾기 CTA"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-rule px-4 py-2.5 text-[14px] leading-[1.6] text-note">
        메인 랜딩, 출발지·목적지를 입력해 경로 내 휴게시설을 한 번에 검색.
      </figcaption>
    </figure>
  );
}

// 휴게소 상세 모달 — portrait.
function BookmarkShot() {
  return (
    <figure className="max-w-[220px] overflow-hidden border border-rule">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/favorite-modal.png"
        alt="휴게소 상세 모달 — 우상단 빨간 하트(즐겨찾기 상태)"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-rule px-2.5 py-1.5 text-[13px] leading-snug text-note">
        빨간 하트 = BookMark 토글
      </figcaption>
    </figure>
  );
}

// Action Controller 설계도 — 직관적 흐름 (URL → 매핑 테이블 → 분기)
function ActionFlowShot() {
  const routes = [
    ["/login.do", "LoginAction"],
    ["/list.do", "RestAreaListAction"],
    ["/favor.do", "FavoriteAction"],
  ];
  return (
    <figure className=" border border-rule">
      <div className="border-b border-rule px-3 py-2 text-[13px] text-note">
        MVC Model 2, Action Controller
      </div>

      <div className="space-y-2 p-4 text-[14px]">
        {/* 1. 요청 */}
        <div className=" border border-rule px-3 py-2 text-center">
          <span className="text-note">Browser</span>
          <span className="ml-2 font-mono text-ink">GET /login.do</span>
        </div>
        <div className="text-center text-note" aria-hidden>
          ↓
        </div>

        {/* 2. FrontController + 라우팅 테이블 (핵심) */}
        <div className=" border-2 border-ink">
          <div className="border-b border-rule px-3 py-2 text-center font-semibold text-ink">
            FrontController
            <span className="ml-1 font-normal text-note">(URL → Action 매핑)</span>
          </div>
          <div className="space-y-1 px-3 py-2.5 font-mono text-[13px]">
            {routes.map(([u, a]) => (
              <div key={u} className="flex items-center justify-between gap-2">
                <span className="text-ink">{u}</span>
                <span className="text-note">→</span>
                <span className="flex-1 text-right text-ink">{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Action 실행 */}
        <div className="text-center text-note" aria-hidden>
          ↓
        </div>
        <div className=" border border-rule px-3 py-2 text-center text-ink">
          Action.<span className="font-mono">execute()</span>
        </div>

        {/* 4. 두 갈래 응답 분기 */}
        <div className="text-center text-note" aria-hidden>
          ↓
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className=" border border-rule px-3 py-2 text-center">
            <p className="font-semibold text-ink">JSP 화면</p>
            <p className="mt-0.5 text-[13px] text-note">페이지 이동</p>
          </div>
          <div className=" border border-rule px-3 py-2 text-center">
            <p className="font-semibold text-ink">JSON 응답</p>
            <p className="mt-0.5 text-[13px] text-note">AJAX</p>
          </div>
        </div>

        {/* 5. 강결합 경고 */}
        {/* 아이콘(⚠) 없음 — 2단계 규칙 */}
        <div className="flex items-start gap-2 border-l-2 border-ink px-3 py-2">
          <span className="flex-1 text-ink">
            한 Action 안에 두 응답 방식이 섞임 → <span className="font-semibold">강결합</span>
          </span>
        </div>
      </div>
    </figure>
  );
}

// MySQL users 테이블 — 실제 MySQL 클라이언트 캡처.
function UserTableShot() {
  return (
    <figure className="overflow-hidden border border-rule">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/users-table.png"
        alt="MySQL users 테이블 — user_idx, user_id, user_pw 컬럼에 BCrypt 해시 저장"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-rule px-3 py-2 text-[13px] leading-snug text-note">
        실제 <span className="text-ink">UserVO</span> 테이블, user_pw 컬럼 = BCrypt hash (평문 저장 X)
      </figcaption>
    </figure>
  );
}

// slide 7 흐름: 입력 위젯(image9) → ↓ → 경로상 휴게시설 결과(image8)
function SearchResultShot() {
  return (
    <figure className="overflow-hidden border border-rule">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/search-input.png"
        alt="출발지·도착지 입력 위젯 — 서울 종로구 사직로 161 / 대전 서구 둔산대로 169 / 길찾기 버튼"
        loading="lazy"
        className="block h-auto w-full"
      />
      <div className="flex justify-center border-y border-rule py-2 text-xl text-note" aria-hidden>
        ↓
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/highway-guide/search-result.png"
        alt="경로상 휴게시설 결과 카드 리스트 (편의시설·주유비·평점·대표메뉴)"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-rule px-4 py-2.5 text-[14px] leading-[1.6] text-note">
        출발지·도착지 입력 → 경로상 휴게시설을 카드로 표출 (편의시설, 주유비, 평점, 대표메뉴).
      </figcaption>
    </figure>
  );
}

// 한 열: 번호 + 제목 → 설명(문단 또는 목록) → 시각자료
function RoleGridCard({
  n,
  title,
  bullets,
  description,
  visual,
}: {
  n: number;
  title: string;
  bullets?: Line[];
  description?: string;
  visual?: React.ReactNode;
}) {
  return (
    <div>
      <ItemTitle n={n}>{title}</ItemTitle>
      {description ? (
        <p className="mt-2 pl-9 text-ink">{description}</p>
      ) : (
        <ul className="dash-list mt-2 space-y-1.5 pl-9 text-[17px] leading-[1.8] text-ink">
          {bullets?.map((b) => (
            <li key={typeof b === "string" ? b : b.text}>
              <LineText line={b} />
            </li>
          ))}
        </ul>
      )}
      {visual && <div className="mt-4 pl-9">{visual}</div>}
    </div>
  );
}

export const metadata: Metadata = {
  title: project.title,
  description: project.description,
};

const techStack = [
  { category: "Frontend", items: ["JSP", "JavaScript", "AJAX", "Kakao Map, Mobility API", "Naver Geocoding API"] },
  {
    category: "Backend",
    items: [
      "Java Servlet (MVC Model 2)",
      "MyBatis",
      "BCrypt",
      "HttpSession",
      "OAuth 2.0 (Kakao, Naver)",
      "JavaMail (Gmail SMTP)",
    ],
  },
  { category: "Database", items: ["MySQL"] },
];

// 3개 role — actionRole만 description(prose 한 단락), 나머지는 bullets(존댓말 항목).
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
  "OAuth 2.0 소셜 로그인 (Kakao, Naver)",
  "Google SMTP 기반 이메일 인증 + 비밀번호 재발급",
  "Kakao Map, Mobility API 지도/경로 시각화",
  "Naver Geocoding API 좌표 변환",
  "AJAX 비동기 통신 (즐겨찾기 실시간 토글 등)",
  "MVC Model 2 Front Controller (Action 라우팅 설계)",
];

const bookmarkRole: { title: string; bullets: Line[] } = {
  title: "휴게소-사용자 다대다 관계 첫 설계 (BookMark 테이블)",
  bullets: [
    "한 사용자가 여러 휴게소를 좋아요할 수 있고, 한 휴게소도 여러 사용자에게 좋아요 받을 수 있는 다대다(N:M) 관계를 BookMark 연결 테이블로 처음 모델링했습니다.",
    "AJAX로 하트를 토글했고, add/delete 액션과 휴게소 PK(saKey) + 사용자 PK 조합으로 복합 PK를 구성했습니다.",
    {
      text: "지도·경로·마이페이지 세 페이지에서 같은 상태를 봐야 했지만 모달이 페이지마다 복사되어 데이터 불일치가 발생해, modal.jsp 분리와 공통 JS로 정리했습니다.",
      ev: ["threePages"],
    },
  ],
};

const troubles: Trouble[] = [
  {
    title: "HttpSession Stateful 한계, 토큰 없는 단일 서버 의존",
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

const SECTIONS: CaseSectionMeta[] = [
  {
    id: "problem",
    label: "문제",
    title: "경로상 휴게시설을 한 번에 찾는 웹을, 아는 것이 적은 상태에서 끝까지 만들어야 했습니다",
  },
  {
    id: "role",
    label: "내가 맡은 것",
    title: "인증·소셜 로그인·지도·즐겨찾기·Front Controller를 직접 구현했습니다",
  },
  {
    id: "flow",
    label: "흐름",
    title: "출발지·도착지 입력 → 경로상 휴게시설 카드, 요청은 Front Controller가 Action으로 나눴습니다",
  },
  {
    id: "decisions",
    label: "결정과 이유",
    title: "HttpSession, Action Forward, BookMark 연결 테이블, 가장 단순한 형태로 출발했습니다",
  },
  {
    id: "failed",
    label: "안 된 것",
    title: "세션은 Scale-out에서, Action은 UI 수정마다 재빌드에서 한계가 드러났습니다",
  },
  {
    id: "next",
    label: "다음에 고칠 것",
    title: "세 가지 한계가 HirePicker의 JWT, REST 분리, 즐겨찾기 재설계로 이어졌습니다",
  },
];
const S = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<string, CaseSectionMeta>;

export default function HighwayGuidePage() {
  return (
    <CaseLayout project={project} sections={SECTIONS}>
      <CaseSection meta={S.problem}>
        <Prose>
          {/* [1단계 A-3] HighWay 채우는 안: 서비스 설명 한 문장 (아래 캡션에서 옮김) */}
          <p>{HIGHWAY_SERVICE_LINE}입니다.</p>
          <p>
            JSP/Servlet 기반의 첫 풀스택 프로젝트입니다. 아는 것이 별로
            없어서 <span className="font-semibold">가장 단순한 형태</span>로 끝까지
            가봤습니다. JWT 없이 BCrypt + HttpSession을 사용했고, JSP Forward와
            AJAX JSON을 한 Action에서 같이 처리하는 구조였습니다. 그 단순함이 만든
            한계가 그대로 다음 프로젝트(HirePicker)의 기술 선택 근거가 되었기에, 이
            프로젝트의 가치는 결과물보다{" "}
            <span className="font-semibold">학습 사이클의 출발점</span>에 있습니다.
          </p>
        </Prose>
        <HeroShot />
      </CaseSection>

      <CaseSection meta={S.role}>
        <div>
          <SubHead note="이 프로젝트에서 직접 구현한 영역">What I built</SubHead>
          <div className="mt-4">
            <PlainList items={builtItems} />
          </div>
        </div>
        <div>
          <SubHead note="※ 직접 다룬 영역의 기술 세트.">사용 기술</SubHead>
          <div className="mt-4">
            <TechStackGrid groups={techStack} />
          </div>
        </div>
      </CaseSection>

      <CaseSection meta={S.flow}>
        <SearchResultShot />
        <ActionFlowShot />
      </CaseSection>

      <CaseSection meta={S.decisions}>
        <SubHead note="다음 프로젝트의 결정 근거가 된 학습 사이클">What carried forward</SubHead>
        <RoleGridCard n={1} {...actionRole} />
        <RoleGridCard n={2} {...authRole} visual={<UserTableShot />} />
        <RoleGridCard n={3} {...bookmarkRole} visual={<BookmarkShot />} />
        <div>
          <p className="mb-3 text-[15px] leading-[1.7] text-note">
            다대다 관계 첫 설계, 다음 프로젝트에서 같은 패턴을 재사용할 토대가
            되었습니다.
          </p>
          <CodeBlock code={bookmarkCode} lang="sql" filename="BookMark 테이블 + 토글 패턴" />
        </div>
      </CaseSection>

      <CaseSection meta={S.failed}>{troubleItems(troubles)}</CaseSection>

      <CaseSection meta={S.next}>
        <div>
          <SubHead>Evolution, 다음 프로젝트로의 발전</SubHead>
          <div className="mt-4">
            <Prose>
              <p>이 프로젝트의 세 가지 한계가 그대로 HirePicker의 결정으로 이어졌습니다.</p>
            </Prose>
          </div>
        </div>
        <EvolutionRow
          from="BCrypt + HttpSession (Stateful)"
          to="JWT 도입 (Stateless), Access Token + Refresh Token"
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
          ev={["threePages"]}
        />
        {lessonItems([
          "아는 게 별로 없어서 단일 서버·HttpSession·MyBatis 같은 가장 단순한 형태로 끝까지 가봤습니다. 그러고 나니 '왜 분리하고 왜 무상태로 가는지'가 다음 라운드(HirePicker)에서 훨씬 또렷한 결정 근거로 남았습니다.",
          "'프론트/백 분리, 무상태 토큰, 연결 테이블 정합성' 같은 말은 책으로 읽을 땐 그냥 좋은 말이었는데, 빌드 사이클·세션 끊김·다대다 불일치를 며칠 겪고 나니 같은 문장이 다르게 읽혔습니다. 다음 프로젝트들의 결정 근거가 이 마찰들에서 그대로 나왔습니다.",
        ])}
      </CaseSection>
    </CaseLayout>
  );
}

// 전 → 후 비교 한 줄.
function EvolutionRow({ from, to, note, ev }: { from: string; to: string; note: string; ev?: string[] }) {
  return (
    <div className="border-l-2 border-ink pl-4">
      <p className="text-[16px] leading-[1.6] text-note">{from}</p>
      <p className="text-[16px] font-semibold leading-[1.6] text-ink">→ {to}</p>
      <p className="mt-1 text-[15px] leading-[1.65] text-note">
        <Graded text={note} ev={ev} />
      </p>
    </div>
  );
}
