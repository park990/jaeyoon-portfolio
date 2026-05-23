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

const SLUG = "highway-guide";
const ACCENT = "#EF4444";
const REPO =
  "https://github.com/CodeGlove/-SIST-Project2-HighwayRestInfo/tree/jaeyoon";

export const metadata: Metadata = {
  title: "HighWay Guide · Jaeyoon Park",
  description: "고속도로 통합 정보 플랫폼 — MVC Model 2 + 카카오/네이버 폴백",
};

const techStack = [
  { category: "Frontend", items: ["JSP", "AJAX (Fetch API)"] },
  {
    category: "Backend",
    items: ["Java Servlet (MVC Model 2)", "MyBatis", "HttpSession", "BCrypt", "Google SMTP"],
  },
  { category: "External API", items: ["Kakao Map · Mobility", "Naver Geocoding"] },
  { category: "Database", items: ["MySQL"] },
  { category: "Infra", items: ["AWS (EC2, S3)"] },
  { category: "Data", items: ["Python Selenium (리뷰 데이터)"] },
];

const roles: Role[] = [
  {
    title: "MVC Model 2 Front Controller 직접 설계 — 전체 Action 라우팅",
    bullets: ["URI 기반 Action 매핑, init() 시점 등록, forward 라우팅"],
  },
  {
    title: "OAuth 2.0 + SMTP + BCrypt 사용자 인증",
    bullets: ["이메일 인증 흐름과 비밀번호 해싱 직접 구현"],
  },
  {
    title: "Kakao Map API + 클라이언트 거리 계산 기반 지도 시각화",
    bullets: ["좌표/거리 계산을 클라이언트에서 처리해 서버 부하 분산"],
  },
  {
    title: "AJAX 비동기 즐겨찾기 실시간 동기화",
    bullets: ["Fetch API로 즐겨찾기 토글 즉시 반영"],
  },
];

const troubles: Trouble[] = [
  {
    title: "HttpSession Stateful 한계 → 다음 프로젝트 JWT 전환의 계기",
    star: true,
    problem:
      "첫 풀스택 프로젝트로 HttpSession 기반 인증 구현. 단일 서버에서는 직관적이지만 Scale-out 시 세션 불일치 문제, 서버 메모리 부하 — Stateful의 근본적 한계 체감.",
    solve:
      "HirePicker에서 무상태 JWT + Redis 도입의 결정적 근거가 됨 (이 프로젝트에서는 한계만 학습)",
    lesson: "기술 선택은 현재 요구사항뿐 아니라 미래 확장성도 고려해야 함",
  },
  {
    title: "JSP 강결합 → RESTful API 분리 아키텍처 체감",
    problem:
      "하나의 Controller가 Forward(JSP)와 JSON 응답(AJAX)을 모두 처리. request.setAttribute와 PrintWriter JSON 조립이 한 클래스에 뒤섞임. 사소한 UI 수정에도 자바 코드 수정 + 서버 재빌드.",
    solve:
      "이 프로젝트에서는 구조 유지. 다음 프로젝트(HirePicker)에서 Next.js + Spring Boot REST API로 분리하는 결정 근거가 됨.",
    lesson: "프론트/백 분리(RESTful API)가 왜 현대 웹의 표준이 됐는지 직접 체감",
  },
  {
    title: "카카오 API 주소 인식 실패 → 자동화 폴백 파이프라인",
    star: true,
    problem:
      '공공데이터 휴게소 주소 끝의 "(서울방향)" 같은 텍스트나 외곽 "산 지번" 주소는 카카오 API 인식 실패',
    solve:
      "실패 데이터만 failList에 모아 네이버 지오코딩 API로 2차 재요청하는 자동화 파이프라인",
    lesson: "외부 API의 결함을 내 코드로 우회하는 방어적 설계의 중요성",
  },
];

const controllerCode = `@WebServlet("*.do")
public class FrontController extends HttpServlet {
    private Map<String, Action> actionMap = new HashMap<>();

    @Override
    public void init() {
        actionMap.put("/login.do", new LoginAction());
        actionMap.put("/restArea/list.do", new RestAreaListAction());
        // ... 다수의 Action 등록
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res) {
        String uri = req.getRequestURI();
        Action action = actionMap.get(uri);
        String view = action.execute(req, res);
        req.getRequestDispatcher(view).forward(req, res);
    }
}
`;

const fallbackCode = `List<Address> failList = new ArrayList<>();
for (RestArea area : restAreas) {
    Coord coord = kakaoApi.geocode(area.address);
    if (coord == null) {
        failList.add(area);
    } else {
        area.setCoord(coord);
    }
}
// 카카오가 실패한 데이터만 네이버로 재요청
for (RestArea area : failList) {
    Coord coord = naverApi.geocode(area.address);
    if (coord != null) area.setCoord(coord);
}
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
        oneLiner="MVC Model 2 Front Controller를 직접 설계하고, 카카오 → 네이버 지오코딩 폴백 파이프라인 구축."
        period="2025.07 ~ 2025.08"
        team="5명"
        links={[{ label: "GitHub", href: REPO }]}
      />

      <Section id="overview" title="Overview">
        <Prose>
          <p>
            JSP/Servlet 기반 고속도로 이용자를 위한 통합 정보(휴게소, CCTV 등)
            제공 플랫폼. 첫 풀스택 프로젝트로 MVC Model 2 아키텍처를 직접 설계하고
            외부 API(카카오, 네이버)를 연동했습니다.
          </p>
          <p>
            HttpSession 기반 인증의 한계를 직접 체감한 경험이 다음 프로젝트
            HirePicker에서 JWT + Redis로 전환하는 결정 근거가 되었습니다.
          </p>
        </Prose>
      </Section>

      <Section id="stack" title="Tech Stack">
        <TechStackGrid groups={techStack} />
      </Section>

      <Section id="role" title="My Role">
        <MyRoleCards roles={roles} accent={ACCENT} />
      </Section>

      <Section id="code" title="Code Highlights">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              MVC Model 2 Front Controller. URI별 Action을 init() 시점에 매핑하고
              service()에서 라우팅.
            </p>
            <CodeBlock code={controllerCode} lang="java" filename="FrontController.java" />
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              카카오 실패 → 네이버 재요청 폴백. 외부 API 결함을 코드로 우회.
            </p>
            <CodeBlock code={fallbackCode} lang="java" filename="GeocodingPipeline.java" />
          </div>
        </div>
      </Section>

      <Section id="trouble" title="Trouble-shooting">
        <TroubleCards troubles={troubles} accent={ACCENT} />
      </Section>

      <Section id="lessons" title="Lessons Learned">
        <LessonsList
          items={[
            "HttpSession의 한계를 직접 체감한 것이 다음 프로젝트의 기술 선택 근거가 되었다.",
            "JSP의 강결합 구조를 통해 RESTful API 분리의 이유를 머리가 아닌 손으로 이해했다.",
            "외부 API에 100% 의존하지 않고, 결함을 코드로 방어하는 사고 방식을 배웠다.",
          ]}
        />
      </Section>

      {/* 마지막 프로젝트라 ProjectFooter의 "다음 프로젝트" 카드는 자동으로 숨겨짐 */}
      <ProjectFooter currentSlug={SLUG} />
    </article>
  );
}
