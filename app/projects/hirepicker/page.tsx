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
import {
  PhotoTodoBanner,
  PhotoPlaceholder,
} from "@/components/project-detail/photo";
import { EngineeringJourney } from "./_components/journey";
import { getProjectBySlug } from "@/lib/projects";

const SLUG = "hirepicker";
const ACCENT = "#F97316";
const REPO = "https://github.com/wlsksekf/hire-picker/tree/jaeyoon";

export const metadata: Metadata = {
  title: "HirePicker · Jaeyoon Park",
  description:
    "구인구직 플랫폼 — 잡 검색/필터, WebSocket+Redis Pub/Sub, Selenium 크롤러, Docker 환경 통합, HttpOnly Cookie 인증 담당",
};

// 담당 영역 위주로 Tech Stack 좁힘.
const techStack = [
  {
    category: "Search / Filter",
    items: ["JPA Specification API", "Pageable", "Spring Data"],
  },
  {
    category: "Realtime",
    items: ["WebSocket (STOMP)", "SimpleBroker", "Redis Pub/Sub Listener"],
  },
  {
    category: "Auth",
    items: ["JWT", "HttpOnly Cookie", "Spring Security", "ResponseCookie"],
  },
  {
    category: "Data Crawling",
    items: ["Python", "Selenium", "Google Images", "MySQL Connector"],
  },
  {
    category: "Infra",
    items: [
      "Docker Compose (dev/prod profile)",
      "Nginx (HTTPS reverse proxy)",
      "Let's Encrypt (Certbot)",
      "AWS EC2",
    ],
  },
];

const roles: Role[] = [
  {
    title: "잡 검색 / 필터 (JPA Specification 동적 쿼리)",
    bullets: [
      "POST /api/search — SearchFilterDTO 하나로 검색어 + 7개 차원 필터(지역/직종/고용형태/학력/기업종류/내외부/해외/날짜) 처리",
      "JPA Specification API로 조건이 있을 때만 Predicate 추가 → 컬럼 간 AND, 다중 값은 OR로 동적 합성",
      "회사 JOIN으로 검색어를 company.name, 지역을 company.address LIKE로 매칭",
      "source 필터는 JobPosting.cUserIdx의 null 여부로 내부/외부 공고 자동 분기",
      "Pageable로 서버 사이드 페이지네이션 일관 적용",
    ],
  },
  {
    title: "WebSocket + Redis Pub/Sub 통합 (다중 인스턴스 동기화)",
    bullets: [
      "WebSocketConfig: enableSimpleBroker(\"/topic\") — STOMP 라우팅은 in-memory broker 유지",
      "별도 RedisMessageListenerContainer + PatternTopic(\"chat-room:*\")로 인스턴스 간 sync 채널 구성",
      "ChatController: 메시지 수신 시 DB 영속화 → RedisPublisher.publish(\"chat-room:{roomId}\")",
      "RedisSubScriber: onMessage에서 SimpMessagingTemplate.convertAndSend(\"/topic/room/{roomId}\")로 자기 인스턴스의 구독자에게 push",
      "두 메커니즘 결합 — STOMP 표준 API 그대로 + 다중 인스턴스 호환성 확보",
    ],
  },
  {
    title: "Selenium 기반 공고 회사 이미지 크롤러 (jaeyoonPython/getCompany.py)",
    bullets: [
      "DB의 job_posting과 JOIN해 실제 채용 중인 회사명만 distinct 추출 → Google Images에서 본사 건물 사진 수집 → DB company.image_path 갱신",
      "봇 탐지 우회: --disable-blink-features=AutomationControlled, excludeSwitches, custom User-Agent, headless",
      "썸네일 필터: img.YQ4gaf 전체 로드 후 height>100px 인 것만 '진짜 썸네일'로 선별 (작은 광고/스폰서 제외) + JS execute_script로 강제 클릭",
      "고해상도 처리: img.sFlh5c의 src가 gstatic.com이면 lazy-load 가정하고 5초 polling으로 non-gstatic URL 대기 (실패 시 썸네일 fallback)",
      "IP 차단 방지를 위해 회사당 3초 sleep, 전체 실행 후 한 번에 conn.commit()",
    ],
  },
  {
    title: "Docker / Nginx 환경 통합",
    bullets: [
      "단일 docker-compose.yml + profiles[\"dev\"|\"prod\"]로 두 환경 분리 — 개발은 build 로컬 + volume mount + npm run dev, 프로덕션은 Docker Hub image + env_file + healthcheck",
      "프로덕션 백엔드 healthcheck(/actuator/health 30s) + 로그 로테이션(1MB × 3) + AWS VPC DNS fallback(172.31.0.2 → 8.8.8.8)",
      "Nginx: 80 → 443 강제 리다이렉트, Let's Encrypt(Certbot) 자동 갱신용 ACME challenge 경로 유지",
      "/ws location: Upgrade/Connection: upgrade 헤더 + proxy_read_timeout 86400 (WebSocket 24시간 keep-alive)",
      "/api location: proxy_set_header Cookie $http_cookie로 인증 쿠키 명시적 전달",
    ],
  },
  {
    title: "Cookie 기반 인증 (CookieUtils)",
    bullets: [
      "Access / Refresh Token 모두 HttpOnly Cookie로 발급 — XSS로 토큰 탈취 차단",
      "환경 분기: isProduction()으로 Secure(prod=true), SameSite(prod=Strict, dev=Lax)",
      "Spring 6의 ResponseCookie 빌더 API 사용 — Path / + maxAge(만료 시간 자동 계산)",
      "로그아웃 시 동일 속성 + maxAge=0 쿠키로 즉시 만료 처리",
      "이 패턴(HttpOnly Cookie)의 모바일 부적합성 체감이 다음 프로젝트 Booming의 flutter_secure_storage 결정 근거가 됨",
    ],
  },
];

const troubles: Trouble[] = [
  {
    title: "다중 인스턴스에서 메시지가 한 서버에만 도착",
    star: true,
    problem:
      "Spring 내장 SimpleBroker는 in-memory 라우팅이라 인스턴스 A에 붙은 클라이언트가 보낸 메시지를 인스턴스 B에 붙은 클라이언트가 받지 못함. enableStompBrokerRelay로 외부 broker를 쓰면 정석이지만 별도 broker 서버 운영 부담이 큼.",
    solve:
      "SimpleBroker는 그대로 둔 채, Redis Pub/Sub을 'sync 채널'로 옆에 두는 패턴 도입. ChatController가 DB 저장 후 RedisPublisher로 발행 → 모든 인스턴스의 RedisSubScriber가 받아 자기 인스턴스의 SimpMessagingTemplate으로 push. SimpleBroker 표준 API는 그대로 쓰면서 인스턴스 간 sync만 Redis로 해결.",
    lesson:
      '"외부 broker 도입" vs "in-memory 유지" 이분법이 아니라 두 메커니즘을 결합하는 선택지가 있다는 점을 직접 구현으로 확인',
  },
  {
    title: "Google Images의 gstatic 저해상도 썸네일 문제",
    star: true,
    problem:
      "썸네일을 클릭한 후 큰 이미지 <img class=\"sFlh5c\">의 src가 즉시 고해상도 URL이 들어오는 사이트도 있고(예: Aju IB, Namu Wiki), 처음엔 gstatic.com 도메인의 저해상도가 잡혔다가 JS lazy-load로 뒤늦게 교체되는 사이트도 있음(예: 넥슨스페이스). 어느 경우인지 미리 알 수 없음.",
    solve:
      "src를 한 번 읽고 분기: 이미 non-gstatic이면 통과, gstatic이면 5초 동안 0.2초 간격 polling으로 src 변경 감지. 5초 내에 안 바뀌면 저해상도 썸네일을 그대로 저장(완전 실패보다는 fallback 우선). 일반 element.click() 대신 driver.execute_script(\"arguments[0].click();\")로 JS 강제 클릭 — Google의 안티봇 클릭 인터셉트 회피.",
    lesson:
      "외부 사이트의 동작 가정에 의존하지 말고, 변화 가능한 상태는 polling + fallback 2단으로 묶어야 데이터 수집 파이프라인이 안정적",
  },
  {
    title: "환경별 80 포트 충돌 + 팀원 구동 장애",
    problem:
      "초기엔 dev/prod docker-compose 분리 없이 단일 파일을 환경 변수로 토글 → 팀원마다 Redis 별도 실행, Java 버전 차이, 포트 충돌로 'docker-compose up'이 자주 실패.",
    solve:
      "단일 compose 파일 안에 profiles[\"dev\"|\"prod\"] 두 세트 정의. dev는 volume mount + npm run dev로 핫리로드, prod는 Docker Hub image + healthcheck + env_file. 명령은 --profile dev / --profile prod 한 줄로 분리. nginx까지 묶어서 같은 네트워크에 두니 팀원이 git clone 후 한 줄 명령으로 환경 재현.",
    lesson:
      "환경 격리는 '여러 파일'보다 '한 파일의 profile'로 두는 게 유지보수가 쉽다. 다만 둘 다 80 포트라 동시 실행 불가는 명시적으로 문서화해야 함",
  },
];

const websocketCode = `// 1) WebSocketConfig — SimpleBroker + Redis Listener 병렬 설치
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");           // 같은 인스턴스 내 라우팅
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListener(
            RedisConnectionFactory cf, RedisSubScriber subscriber) {
        RedisMessageListenerContainer c = new RedisMessageListenerContainer();
        c.setConnectionFactory(cf);
        // "chat-room:*" 패턴으로 다른 인스턴스의 발행 메시지 수신
        c.addMessageListener(subscriber, new PatternTopic("chat-room:*"));
        return c;
    }
}

// 2) ChatController — DB 저장 후 Redis 발행
@MessageMapping("/chat.sendMessage")
public void sendMessage(ChatMessageDTO dto, SimpMessageHeaderAccessor headers) {
    chatMessageRepository.save(toEntity(dto));           // 영속화
    redisPublisher.publish(dto);                         // 모든 인스턴스에 fan-out
}

// 3) RedisSubScriber — 자기 인스턴스의 구독자에게 push
@Override
public void onMessage(Message message, byte[] pattern) {
    ChatMessageDTO dto = objectMapper.readValue(message.getBody(), ChatMessageDTO.class);
    messagingTemplate.convertAndSend("/topic/room/" + dto.getRoomId(), dto);
}
`;

const cookieCode = `@Component
@RequiredArgsConstructor
public class CookieUtils {
    private final Environment environment;
    private final JwtTokenProvider jwtTokenProvider;

    private boolean isProduction() {
        return Arrays.asList(environment.getActiveProfiles()).contains("prod");
    }
    private String getSameSitePolicy() {
        return isProduction() ? "Strict" : "Lax";   // CSRF 정책 환경 분기
    }

    public ResponseCookie createAccessTokenCookie(String accessToken) {
        long maxAge = jwtTokenProvider.getAccessTokenValidityInMilliseconds() / 1000;
        return ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)                       // XSS 방어
                .secure(isProduction())               // prod에서만 HTTPS 전송
                .path("/")
                .maxAge(maxAge)
                .sameSite(getSameSitePolicy())        // CSRF 방어
                .build();
    }
    // refresh 쿠키 / 삭제용 쿠키도 동일 패턴
}
`;

const selectorCode = `# 1) gstatic 저해상도 → 고해상도 lazy-load polling
large = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "img.sFlh5c")))
img_url = large.get_attribute('src')

if 'gstatic.com' in img_url:
    # 저해상도 → 5초간 0.2초 간격으로 non-gstatic URL 대기
    initial = img_url
    start = time.time()
    while time.time() - start < 5:
        cur = large.get_attribute('src')
        if cur and cur != initial and 'gstatic.com' not in cur:
            img_url = cur
            break
        time.sleep(0.2)
    # 5초 후에도 안 바뀌면 저해상도 썸네일을 그대로 fallback 사용

# 2) 큰 썸네일만 클릭 (작은 광고 제외)
thumbnails = wait.until(EC.presence_of_all_elements_located(
    (By.CSS_SELECTOR, "img.YQ4gaf")))
real = next((t for t in thumbnails if t.size['height'] > 100), None)

# 3) Google 안티봇 회피용 JS 강제 클릭
driver.execute_script("arguments[0].click();", real)
`;

export default function HirePickerPage() {
  const project = getProjectBySlug(SLUG)!;

  return (
    <article
      className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16"
      style={{ "--accent": ACCENT } as React.CSSProperties}
    >
      <PhotoTodoBanner count={3} />

      <ProjectHeader
        project={project}
        oneLiner="잡 검색/필터(JPA Specification 7차원), WebSocket+Redis Pub/Sub 다중 인스턴스 동기화, Selenium 공고 회사 이미지 크롤러, Docker dev/prod 환경 통합, HttpOnly Cookie 인증을 담당."
        period="2025.10 ~ 2025.11"
        team="5명"
        links={[{ label: "GitHub", href: REPO }]}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            Spring Boot + JPA + Next.js 기반 구인구직 플랫폼. 5명 팀 프로젝트에서
            검색/필터·실시간 채팅·외부 데이터 수집·인프라·인증 등 가로축의 핵심
            영역을 담당했습니다.
          </p>
          <p>
            HighWay Guide의 HttpSession 한계 경험이 JWT + HttpOnly Cookie 전환의
            근거가 되었고, 이번 프로젝트에서 다중 인스턴스 WebSocket 동기화와
            HttpOnly Cookie의 모바일 부적합성을 직접 체감한 것이 다음 프로젝트
            Booming의 기술 선택을 이끌었습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
        <div className="mt-5 space-y-5">
          <PhotoPlaceholder
            n={1}
            caption="잡 검색 결과 화면 1장 — 7개 필터(지역/직종/고용형태/학력/기업종류/내외부/날짜) 중 2~3개가 적용된 상태 + 좌측 필터 패널이 함께 보이는 컷. JPA Specification 동적 쿼리의 '결과물'을 시각적으로 증명."
          />
          <PhotoPlaceholder
            n={2}
            caption="실시간 채팅 동작 — 같은 채팅방에 들어간 두 브라우저(또는 두 탭)가 메시지를 주고받는 캡처. WebSocket SimpleBroker + Redis Pub/Sub로 다중 인스턴스에서도 sync된다는 점을 한 컷으로."
          />
          <PhotoPlaceholder
            n={3}
            caption="크롤러로 모은 공고 회사 이미지가 적용된 회사 카드 grid — Google Images에서 가져온 건물 사진이 image_path로 들어가 실제 UI에 박힌 모습. '이 데이터를 모았다'의 최종 결과물."
          />
        </div>
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              WebSocket SimpleBroker + Redis Pub/Sub Listener 결합. Spring 표준
              STOMP API를 그대로 쓰면서 다중 인스턴스 sync를 Redis로 위임.
            </p>
            <CodeBlock
              code={websocketCode}
              lang="java"
              filename="WebSocket + Redis 통합"
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              HttpOnly + Secure + SameSite를 환경(dev/prod)에 따라 자동 분기.
              ResponseCookie 빌더로 일관 적용.
            </p>
            <CodeBlock code={cookieCode} lang="java" filename="CookieUtils.java" />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Selenium 크롤러의 gstatic 저해상도 → 고해상도 lazy-load polling +
              JS 강제 클릭 + 작은 광고 썸네일 제외 로직.
            </p>
            <CodeBlock
              code={selectorCode}
              lang="python"
              filename="jaeyoonPython/getCompany.py"
            />
          </div>
        </div>
      </Section>

      <Section id="journey" title="Engineering Journey">
        <EngineeringJourney />
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "표준 API와 외부 인프라의 결합은 이분법이 아니다 — SimpleBroker(표준) 위에 Redis Pub/Sub(외부 sync)을 얹는 식의 절충안이 운영 부담을 가장 낮춘다.",
            "외부 사이트(Google 등) 의존 파이프라인은 상태 가정 대신 'polling + fallback 2단'으로 묶어야 안정적이다.",
            "환경 분리는 별도 파일이 아니라 단일 compose의 profile로 두는 게 팀 재현성에 유리하다.",
            "HttpOnly Cookie가 웹에서는 정답이지만 모바일에서는 작동하지 않는다 — 이 체감이 다음 프로젝트 Booming의 flutter_secure_storage 결정으로 이어졌다.",
          ]}
        />
      </Section>

      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
