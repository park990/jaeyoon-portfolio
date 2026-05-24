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
import { EngineeringJourney } from "./_components/journey";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "hirepicker";
const ACCENT = "#F97316";
const REPO = "https://github.com/wlsksekf/hire-picker/tree/jaeyoon";

export const metadata: Metadata = {
  title: "HirePicker · Jaeyoon Park",
  description:
    "HighWay Guide의 HttpSession·Action 강결합·다대다 첫 시도의 한계를 JWT·REST 분리·즐겨찾기 재설계로 발전시킨 두 번째 풀스택 프로젝트.",
};

const techStack = [
  { category: "Frontend", items: ["Next.js (SSR/ISR)", "React", "Axios"] },
  {
    category: "Backend",
    items: ["Spring Boot", "JPA", "Spring Security", "JWT", "WebSocket (STOMP)"],
  },
  { category: "Cache / DB", items: ["Redis (Access Token, Pub/Sub)", "MySQL"] },
  { category: "Data / Infra", items: ["Python Selenium", "Docker Compose"] },
];

const roles: Role[] = [
  {
    title: "JWT 인증 도입 — HttpSession의 한계를 무상태로 전환",
    bullets: [
      "Spring Security + JWT Access/Refresh 이중 토큰 구조 직접 설계",
      "이때는 Refresh를 DB에, Access를 Redis에 분리 저장 — '영속 데이터 vs 세션' 구분이 아직 명확하지 않았음",
      "구현 중 'Refresh도 영속이 아니라 세션 성격에 가깝다'를 체감 → 다음 프로젝트 Booming에서 토큰을 전부 Redis로 통합하는 결정 근거",
    ],
  },
  {
    title: "공고-사용자 즐겨찾기 다대다 재설계",
    bullets: [
      "HighWay Guide의 휴게소-좋아요 BookMark에서 부족했던 부분(3페이지 상태 동기화·연결 테이블 정합성)을 정리",
      "JPA 연관관계로 다대다를 명시 매핑 + 인덱스 + 사용자별 즐겨찾기 카드 grid에 그대로 렌더",
    ],
  },
  {
    title: "WebSocket (STOMP) + Redis Pub/Sub 직접 구현 — 그리고 회고",
    bullets: [
      "다중 인스턴스 확장 가정으로 Redis Pub/Sub 외부 broker relay를 직접 구성",
      "실 운영은 단일 서버라 매 메시지마다 외부 네트워크 I/O 발생 — 회고: 같은 조건에서는 Spring 내장 SimpleBroker가 더 효율적이었을 것",
      "메시지 영속은 MySQL의 ChatMessage 테이블에 관계형으로 저장 — JPA로 다루기 편했지만 채팅 메시지가 본질적으로 schemaless(첨부·이모지·시스템 메시지 등 다양한 형태)에 가까운데 관계형 컬럼으로 표현하는 게 어색했음",
      "이 두 회고(브로커 + 저장소)가 다음 프로젝트 Booming의 SimpleBroker + MongoDB 결정 근거",
    ],
  },
  {
    title: "Selenium 동적 크롤링 + Docker Compose 환경 통합",
    bullets: [
      "정적 HTTP 크롤링으로 JS 렌더링 데이터(이미지·상세) 누락 → Selenium 동적 크롤링으로 전환",
      "수집 성공에만 몰두해 정제 단계 누락 → 무관 데이터 일부 노출, '수집만큼 정제·검증이 중요'한 교훈",
      "팀원마다 Redis 별도 실행·포트 충돌·Java 버전 불일치 → Spring Boot + Redis를 단일 Docker Compose 네트워크로 통합",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "Refresh Token을 DB에 저장 → 매 요청 디스크 I/O",
    star: true,
    problem:
      "JWT는 무상태이지만 Refresh Token 회수/만료 관리는 어딘가에 저장이 필요. 처음엔 사용자 테이블 옆에 RefreshToken 테이블을 만들어 DB에 저장 → 매 인증 요청마다 디스크 I/O가 발생하고, '영속 데이터'도 아닌 게 트랜잭션 영역에 들어가 있어 어색.",
    solve:
      "이 프로젝트에선 Access만 Redis로 옮기는 반쪽 변경에 그침. '토큰은 세션 성격에 가까운 임시 데이터'라는 결론을 얻었고, 다음 프로젝트 Booming에서 Refresh도 Redis로 통합 + TTL 자동 만료로 회수 로직 자체 제거.",
    lesson:
      "데이터의 성격(영속 vs 세션)을 보고 저장소를 선택해야 한다. 인증 토큰은 '관리해야 할 영속 데이터'가 아니라 '시간 지나면 사라지는 게 정답인 데이터'.",
  },
  {
    title: "Redis Pub/Sub 도입의 '과한 설계' 회고",
    star: true,
    problem:
      "WebSocket 채팅에 Spring 내장 SimpleBroker를 안 쓰고 Redis Pub/Sub 외부 broker relay를 직접 구성. 다중 인스턴스 확장 명분이었지만 실제 운영은 단일 서버 — 매 메시지마다 외부 네트워크 I/O가 추가되는 비용만 늘어남.",
    solve:
      "이 프로젝트에서는 Pub/Sub 구조 그대로 두고, 다음 프로젝트 Booming에서 환경(단일 인스턴스 모바일 앱)에 맞춰 SimpleBroker로 단순화. 메시지 유실 우려는 DB 영속 저장으로 보완.",
    lesson:
      "확장성 명분의 외부 인프라 도입은 운영 조건을 다시 보고 결정해야 한다. '유명한 기술 = 좋은 선택'이 아니라 '내 환경에 맞는 기술 = 좋은 선택'.",
  },
  {
    title: "Selenium 수집 후 정제 누락 → 무관 데이터 노출",
    problem:
      "정적 HTTP 크롤링으로 JS 렌더링된 공고 이미지·상세 데이터가 빠짐 → Selenium 동적 크롤링으로 전환해 수집은 성공. 다만 수집된 데이터에 광고·무관 이미지가 섞인 채 서비스에 노출됨.",
    solve:
      "수집 → 정제 → 검증 단계를 분리하는 패턴의 필요성을 직접 체감 (이 프로젝트에선 미완).",
    lesson:
      "데이터 파이프라인은 '어떻게 가져올 것인가'만큼 '어떻게 정제하고 검증할 것인가'가 품질을 결정한다.",
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

export default function HirePickerPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <ProjectHeader
        project={project}
        oneLiner="HighWay Guide의 HttpSession·Action 강결합·다대다 첫 시도의 한계를 JWT·REST 분리·즐겨찾기 재설계로 발전시킨 두 번째 풀스택 프로젝트. 동시에 Redis Pub/Sub 같은 '과한 설계' 한 번을 거쳐 Booming의 단순화 결정의 근거가 됨."
        period="2025.10 ~ 2025.11"
        team="5명"
        links={[{ label: "GitHub", href: REPO }]}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            Spring Boot + Next.js 기반 두 번째 풀스택 프로젝트.{" "}
            <span className="font-medium text-foreground">
              이전 프로젝트의 한계 4가지(HttpSession, Action 강결합, 다대다 첫
              시도, 단일 책임 위반)
            </span>
            를 받아 각각에 대한 결정을 내렸고, 그 결정 중 일부는 ‘과한 설계’였음을
            직접 체감하며 다음 프로젝트 Booming의 단순화 결정 근거가 되었습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          ※ <span className="text-foreground">직접 다룬 영역</span>의 기술 세트.
        </p>
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="evolution" title="Evolution — 발전 라인">
        <EngineeringJourney />
      </Section>

      <Section id="code" title="Code Highlight">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Refresh Token을 DB에 저장한 ‘반쪽 변경’ — 그 한계가 다음 프로젝트
            Booming에서 토큰 전부 Redis 통합의 근거가 됨.
          </p>
          <CodeBlock code={tokenCode} lang="java" filename="TokenService.java (HirePicker)" />
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "데이터의 성격(영속 vs 세션)을 보고 저장소를 결정한다 — 인증 토큰은 영속 데이터가 아니다.",
            "확장성 명분의 외부 인프라 도입은 운영 조건을 다시 보고 결정한다 — '유명한 기술'이 아니라 '내 환경에 맞는 기술'.",
            "데이터 파이프라인은 '수집'만큼 '정제·검증'이 품질을 결정한다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
