import type { Metadata } from "next";
import { Prose } from "@/components/project-detail/section";
import { CodeBlock } from "@/components/project-detail/code-block";
import {
  TechStackGrid,
  roleItems,
  troubleItems,
  lessonItems,
  PlainList,
  type Role,
  type Trouble,
} from "@/components/project-detail/blocks";
import { CaseLayout } from "@/components/case/case-layout";
import {
  CaseSection,
  SubHead,
  type CaseSectionMeta,
} from "@/components/case/case-parts";
import { caseMetadata } from "@/lib/site";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "hirepicker";
const project = getProjectBySlug(SLUG)!;

export const metadata: Metadata = caseMetadata(project);

const techStack = [
  { category: "Frontend", items: ["Next.js (SSR/ISR)", "React", "Axios"] },
  {
    category: "Backend",
    items: ["Spring Boot", "JPA", "Spring Security", "JWT", "WebSocket (STOMP)"],
  },
  { category: "Cache / DB", items: ["Redis (Access Token, Pub/Sub)", "MySQL"] },
  { category: "Data / Infra", items: ["Python Selenium", "Docker Compose", "AWS S3"] },
];

// Part 1 — "What I built": 단순 구현 작업 망라 (발전 narrative와 분리)
const builtItems = [
  "Spring Security Filter Chain 구성 (JWT 인증/인가)",
  "JPA Entity 매핑 + 인덱스 설계",
  "Next.js SSR/ISR 페이지 구성",
  "Axios 인터셉터 (자동 토큰 갱신)",
  "HttpOnly Cookie + Axios 통합 (인증 토큰 전달)",
  "공고 검색 / 필터 / 즐겨찾기 API 구현",
  "Python Selenium 공고 사진 수집",
  "AWS S3 이미지 업로드 (공고 이미지 저장)",
  "Docker Compose 환경 통합 (Spring Boot + Redis + MySQL)",
  "수집 데이터 이미지 정제 처리",
];

// Part 2 — "What carried forward": 다음 프로젝트로 이어진 학습 사이클 (존댓말)
const roles: Role[] = [
  {
    title: "JWT 인증 도입, HttpSession의 한계를 무상태로 전환",
    bullets: [
      "Spring Security + JWT Access/Refresh 이중 토큰 구조를 직접 설계했습니다.",
      "이때는 Refresh를 DB에, Access를 Redis에 분리 저장했고, ‘영속 데이터 vs 세션’ 구분이 아직 명확하지 않았습니다.",
      "구현 중 ‘Refresh도 영속이 아니라 세션 성격에 가깝다’는 점을 체감했고, 이 결론이 다음 프로젝트 Booming에서 토큰을 전부 Redis로 통합하는 결정 근거가 되었습니다.",
    ],
  },
  {
    title: "공고-사용자 즐겨찾기, HighWay의 다대다 매핑 학습 재사용",
    bullets: [
      "HighWay Guide에서 처음 시도한 다대다 관계 테이블 매핑·DB 설계가 막막했던 경험 덕분에, HirePicker의 공고-사용자 즐겨찾기 다대다는 손쉽게 적용할 수 있었습니다.",
      "JPA 연관관계로 다대다를 명시 매핑하고 인덱스를 추가했으며, 사용자별 즐겨찾기 카드 grid에 그대로 렌더했습니다.",
      "이 학습은 Booming에서 게시판 좋아요 다대다로 다시 한 번 재사용되었고, 모바일에서는 모델보다 ‘갱신 시점’이 더 어려운 축이 된다는 점을 새로 마주하게 됩니다.",
    ],
  },
  {
    title: "WebSocket (STOMP) + Redis Pub/Sub 직접 구현, 그리고 회고",
    bullets: [
      "다중 인스턴스 확장을 가정해 Redis Pub/Sub 외부 broker relay를 직접 구성했습니다.",
      "실 운영은 단일 서버라 매 메시지마다 외부 네트워크 I/O가 발생했고, 회고하면 같은 조건에서는 Spring 내장 SimpleBroker가 더 효율적이었을 거라고 판단했습니다.",
      "메시지 영속은 MySQL의 ChatMessage 테이블에 관계형으로 저장했지만, 채팅 메시지가 본질적으로 schemaless(첨부·이모지·시스템 메시지 등 다양한 형태)에 가까워 관계형 컬럼으로 표현하기 어색했습니다.",
      "이 두 회고(브로커 + 저장소)가 다음 프로젝트 Booming의 SimpleBroker + MongoDB 결정 근거가 되었습니다.",
    ],
  },
  {
    title: "Selenium 동적 크롤링 + Docker Compose 환경 통합",
    bullets: [
      "정적 HTTP 크롤링으로 JS 렌더링 데이터(이미지·상세)가 누락되어, Selenium 동적 크롤링으로 전환했습니다.",
      "수집 성공에만 몰두해 정제 단계를 누락했고, 무관 데이터가 일부 노출되며 ‘수집만큼 정제·검증이 중요하다’는 교훈을 얻었습니다.",
      "팀원마다 Redis 별도 실행·포트 충돌·Java 버전 불일치 문제가 반복되어, Spring Boot + Redis를 단일 Docker Compose 네트워크로 통합했습니다.",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "Refresh Token을 DB에 저장 → 매 요청 디스크 I/O",
    star: true,
    problem:
      "JWT는 무상태이지만 Refresh Token 회수·만료 관리는 어딘가에 저장이 필요했습니다. 처음에는 사용자 테이블 옆에 RefreshToken 테이블을 만들어 DB에 저장했고, 그 결과 매 인증 요청마다 디스크 I/O가 발생했습니다. ‘영속 데이터’도 아닌 것이 트랜잭션 영역에 들어가 있어 구조적으로 어색했습니다.",
    solve:
      "이 프로젝트에서는 Access만 Redis로 옮기는 반쪽 변경에 그쳤습니다. ‘토큰은 세션 성격에 가까운 임시 데이터’라는 결론을 얻었고, 다음 프로젝트 Booming에서 Refresh도 Redis로 통합하고 TTL 자동 만료로 회수 로직 자체를 제거했습니다.",
    lesson:
      "매 인증 요청마다 RefreshToken 테이블을 디스크에서 읽어오는 걸 보면서, ‘회수 가능해야 한다’는 생각만으로 DB 옆자리에 둔 게 어색하다는 걸 처음 느꼈습니다. 토큰처럼 시간이 지나면 사라지는 게 자연스러운 데이터는 트랜잭션 영역이 아니라 TTL이 있는 메모리 저장소에 어울린다는 걸, Booming에서 둘 다 Redis로 옮기고 나서야 확실히 정리됐습니다.",
  },
  {
    title: "Redis Pub/Sub 도입의 ‘과한 설계’ 회고",
    star: true,
    problem:
      "WebSocket 채팅에 Spring 내장 SimpleBroker를 안 쓰고 Redis Pub/Sub 외부 broker relay를 직접 구성했습니다. 다중 인스턴스 확장 명분이었지만 실제 운영은 단일 서버여서, 매 메시지마다 외부 네트워크 I/O가 추가되는 비용만 늘어났습니다.",
    solve:
      "이 프로젝트에서는 Pub/Sub 구조를 그대로 두었고, 다음 프로젝트 Booming에서 환경(단일 인스턴스 모바일 앱)에 맞춰 SimpleBroker로 단순화했습니다. 메시지 유실 우려는 DB 영속 저장으로 보완했습니다.",
    lesson:
      "WebSocket에 Redis Pub/Sub을 깔던 시점에는 ‘다중 인스턴스 대비’라는 명분이 그럴듯해 보였는데, 실제로 띄워보니 인스턴스는 하나뿐이고 메시지 한 번에 외부 네트워크 I/O만 추가되는 구조였습니다. 다음 프로젝트(Booming)에선 같은 자리에 Spring 내장 SimpleBroker를 그대로 쓰고, 인프라는 환경부터 보고 정합니다.",
  },
  {
    title: "Selenium 수집 후 정제 누락 → 무관 데이터 노출",
    problem:
      "정적 HTTP 크롤링으로 JS 렌더링된 공고 이미지·상세 데이터가 빠져, Selenium 동적 크롤링으로 전환해 수집은 성공했습니다. 다만 수집된 데이터에 광고·무관 이미지가 섞인 채 서비스에 노출되었습니다.",
    solve:
      "수집 → 정제 → 검증 단계를 분리하는 패턴의 필요성을 직접 체감했습니다 (이 프로젝트에서는 미완).",
    lesson:
      "Selenium으로 수집까지 성공했을 때는 ‘됐다’ 싶었는데, 막상 서비스 화면엔 광고 이미지가 그대로 박혀 있었습니다. 수집 단계에서 끝낼 게 아니라 정제·검증을 따로 두는 단계가 필요했고, 다음에 데이터 파이프라인을 짤 때는 정제 단계 자리를 먼저 비워두고 시작합니다.",
  },
];

// TL;DR — 보조 카드라 2개로 최소. HighWay → HirePicker → Booming narrative의 중간 지점.
type Highlight = {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
};

const HIGHLIGHTS: Highlight[] = [
  {
    label: "JWT 인증 도입",
    value: "Stateful → Stateless",
    note: "HighWay Guide의 HttpSession 한계를 받아 JWT Access/Refresh 이중 토큰 구조로 전환",
    accent: true,
  },
  {
    label: "두 번의 '과한 설계' 회고",
    value: "Refresh=DB, Redis Pub/Sub",
    note: "단일 서버에 외부 broker, 디스크 I/O가 다음 프로젝트 Booming의 단순화 결정 근거가 됨",
  },
];

const tokenCode = `// HirePicker — Refresh DB / Access Redis 분리 (반쪽 변경)
// Booming에선 둘 다 Redis로 통합되고, Refresh도 TTL 자동 만료로 회수 로직 제거됨.

@Service
public class TokenService {
    private final RefreshTokenRepository refreshTokenRepo; // JPA → DB
    private final StringRedisTemplate redisTemplate;       // Access → Redis

    public AuthTokens issue(Long userId) {
        String access  = jwtProvider.createAccessToken(userId);
        String refresh = jwtProvider.createRefreshToken(userId);

        // Refresh를 DB에 저장 — 이 시점엔 "회수 가능한 영속 데이터"로 봄
        refreshTokenRepo.save(new RefreshToken(userId, refresh, expiry));

        // Access는 Redis TTL
        redisTemplate.opsForValue().set("access:" + userId, access,
            Duration.ofMinutes(15));

        return new AuthTokens(access, refresh);
    }
}
`;

const SECTIONS: CaseSectionMeta[] = [
  {
    id: "problem",
    label: "문제",
    title: "HighWay Guide에서 남은 네 가지 한계에 각각 결정을 내려야 했습니다",
  },
  {
    id: "role",
    label: "내가 맡은 것",
    title: "인증·즐겨찾기·채팅·수집·실행 환경까지 직접 구현했습니다",
  },
  {
    id: "decisions",
    label: "결정과 이유",
    title: "JWT로 무상태 전환, 즐겨찾기 다대다 재사용, 그리고 과했던 Redis Pub/Sub",
  },
  {
    id: "failed",
    label: "안 된 것",
    title: "Refresh의 DB 저장, 단일 서버의 Pub/Sub, 정제 없는 수집이 어긋났습니다",
  },
  {
    id: "next",
    label: "다음에 고칠 것",
    title: "토큰은 TTL 저장소로, 인프라는 운영 조건에 맞춰, 환경은 처음부터 통합합니다",
  },
];
const S = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<string, CaseSectionMeta>;

function HighlightLine({ h }: { h: Highlight }) {
  return (
    <p className="max-w-[690px] border-l-2 border-ink pl-4 text-ink">
      <span className="text-note">{h.label}</span>{" "}
      <span className="font-semibold">{h.value}</span>, {h.note}
    </p>
  );
}

export default function HirePickerPage() {
  return (
    <CaseLayout project={project} sections={SECTIONS}>
      <CaseSection meta={S.problem}>
        <Prose>
          <p>
            Spring Boot + Next.js 기반의 두 번째 풀스택 프로젝트입니다.{" "}
            <span className="font-semibold">
              이전 프로젝트의 발전 포인트 4가지(HttpSession, Action 강결합,
              다대다 매핑, 단일 책임)
            </span>
            를 받아 각각에 대한 결정을 내렸고, 그 결정 중 일부는 ‘과한
            설계’였음을 직접 체감하며 다음 프로젝트 Booming의 단순화 결정 근거가
            되었습니다.
          </p>
        </Prose>
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

      <CaseSection meta={S.decisions}>
        <div className="space-y-3">
          {HIGHLIGHTS.map((h) => (
            <HighlightLine key={h.label} h={h} />
          ))}
        </div>
        <SubHead note="다음 프로젝트의 결정 근거가 된 학습 사이클">What carried forward</SubHead>
        {roleItems(roles)}
        <div>
          <p className="mb-3 text-[15px] leading-[1.7] text-note">
            Refresh Token을 DB에 저장한 ‘반쪽 변경’, 그 한계가 다음 프로젝트
            Booming에서 토큰 전부 Redis 통합의 근거가 되었습니다.
          </p>
          <CodeBlock code={tokenCode} lang="java" filename="TokenService.java (HirePicker)" />
        </div>
      </CaseSection>

      <CaseSection meta={S.failed}>{troubleItems(troubles)}</CaseSection>

      <CaseSection meta={S.next}>
        {lessonItems([
          "처음엔 Refresh Token을 'DB에 회수 가능하게 두자' 싶어 RefreshToken 테이블에 박았는데, 매 인증 요청마다 디스크를 읽는 구조가 어색했습니다. 다음 프로젝트(Booming)에선 Access랑 Refresh 둘 다 Redis로 옮기고 TTL 만료로 회수 로직 자체를 없앴습니다.",
          "단일 서버에 Redis Pub/Sub을 깔아본 한 번이 가장 비싼 수업이었습니다. 인스턴스가 하나뿐인데 매 메시지마다 외부 네트워크 I/O만 추가되는 구조였고, 그 뒤로는 인프라를 '유명한 기술이라서'가 아니라 '내 운영 조건에 맞아서'로 고릅니다.",
          "팀원마다 Redis 포트·Java 버전이 달라 한참 같이 디버깅하던 시기가 있었습니다. Spring Boot + Redis를 단일 Docker Compose 네트워크로 묶어두니 새 사람이 합류해도 `docker compose up` 한 줄로 끝났고, 그 뒤 프로젝트들은 환경 통합을 처음부터 잡고 시작합니다.",
        ])}
      </CaseSection>
    </CaseLayout>
  );
}
