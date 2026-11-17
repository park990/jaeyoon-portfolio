import { getProjectBySlug } from "@/lib/projects";
import { EvidenceProvider, Ev } from "@/components/case/evidence";

// 소개 · 기술 — 기존 Hero 설명 문장 · About · Strengths · Projects 인용문 · Skills의 문장을 이 구역으로 옮김.
// 65.4% → 63.1% 수치에는 Medical Chatbot 사례의 근거 등급을 붙인다.

// 기존 components/strengths.tsx
const STRENGTHS = [
  {
    title: "LLM 파이프라인 설계",
    body: "claim 추출 → 검증 흐름을 직접 짜고, 운영에서 깨지는 지점(단위 누락·표 오매칭)을 프롬프트·규칙으로 잡습니다.",
  },
  {
    title: "RAG를 맹신하지 않습니다",
    body: "RAG가 정확도를 65.4% → 63.1%로 떨어뜨린 걸 측정하고 원인까지 분석. 적용 조건을 아는 엔지니어를 지향합니다.",
    ev: ["ablation"],
  },
  {
    title: "모델 + 그걸 감싸는 서비스",
    body: "Spring 백엔드, AWS 배포까지. 모델만이 아니라 서비스로 굴립니다.",
  },
];

// 기존 components/skills.tsx — 원칙: 실제로 다룬 것만.
const SKILLS: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["Python", "TypeScript", "Java", "Dart", "SQL"] },
  {
    title: "AI / NLP",
    items: [
      "PyTorch",
      "HuggingFace Transformers",
      "NCP HCX",
      "RAG (ChromaDB, ko-sroberta)",
      "Pydantic",
      "Prompt Engineering",
    ],
  },
  { title: "Backend", items: ["Spring Boot", "JPA", "REST API", "WebSocket (STOMP)", "JWT", "OAuth 2.0"] },
  { title: "Frontend", items: ["React", "Next.js", "Flutter (Riverpod)"] },
  { title: "Database", items: ["PostgreSQL + pgvector", "MySQL", "Redis", "MongoDB"] },
  { title: "DevOps / Infra", items: ["Docker", "GitHub Actions", "AWS (EC2, S3)", "nginx", "pm2"] },
  { title: "Tools", items: ["Git", "Linux", "VS Code", "Colab"] },
];

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[17px] font-semibold leading-[1.5] text-ink">{children}</h3>;
}

export function Intro() {
  const med = getProjectBySlug("medical-rag")!;
  return (
    <section id="about" aria-labelledby="about-title" className="sec mt-[clamp(56px,7vw,96px)]">
      <EvidenceProvider evidence={med.evidence} linkBase="/projects/medical-rag">
        <h2 id="about-title" className="sec-label">
          소개, 기술
        </h2>

        {/* [2.5단계] .body 틀: 글은 왼쪽 690px, 사진은 오른쪽 여백. 960px 미만에서는 사진이 글 위로 */}
        <div className="case-body intro-body mt-4">
          <div className="case-text space-y-5 text-[17px] leading-[1.8] text-ink">
            {/* 기존 Hero 설명 문장 */}
            <p className="font-semibold">
              기사 속 수치 주장을 검증하는 LLM 파이프라인을 설계·구현하고, 모델을 감싸는
              백엔드/인프라까지 직접 다룹니다.
            </p>
            {/* 기존 About 4문단 */}
            <p>
              <span className="font-semibold">기사 속 수치 주장을 검증하는 LLM 파이프라인</span>을
              설계·구현하고, 데이터 적재부터 AWS 배포까지 직접 다룹니다. 모델만이 아니라 그걸
              감싸는 서비스(백엔드·인프라)까지 봅니다.
            </p>
            <p>
              멋쟁이사자처럼 NLP 과정을 <span className="font-semibold">StructVerify-Lab</span>으로
              마무리(최우수상)했고, 2026.09까지 이어서 개발했습니다.
            </p>
            <p>
              RAG가 정확도를 65.4% → 63.1%로 떨어뜨린 걸 직접 측정하고 원인까지 본 경험이
              있어서, 새 기술을 붙일 때 적용 조건부터 확인하는 편입니다.
              <Ev ids={["ablation"]} />
            </p>
            <p>
              이전 프로젝트의 한계를 다음 결정의 근거로 연결하는 사고가 강점입니다. LLM 출력의
              단위 누락이나 KOSIS 표 오매칭처럼 운영에서 깨지는 지점을 프롬프트·규칙·스키마로
              잡아왔습니다.
            </p>
          </div>
          <aside aria-label="프로필 사진">
            {/* 기존 About 사진 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile/jaeyoon.jpg"
              alt="박재윤 프로필 사진"
              width={1080}
              height={1440}
              loading="lazy"
              className="block h-auto w-[160px] border border-rule"
            />
          </aside>
        </div>

        <div className="mt-12 max-w-[690px]">
          <Sub>강점</Sub>
          <dl className="mt-3 border-t border-rule">
            {STRENGTHS.map((s) => (
              <div key={s.title} className="border-b border-rule py-3">
                <dt className="text-[16px] font-semibold text-ink">{s.title}</dt>
                <dd className="mt-0.5 text-[17px] leading-[1.8] text-ink">
                  {s.body}
                  {s.ev && <Ev ids={s.ev} />}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 기존 Projects 섹션 인용문 (dbee373에서 복구한 문구) — 인용문은 명조 */}
        {/* [2.5단계] 왼쪽 세로선 제거, 명조 21px */}
        <blockquote className="mt-12 max-w-[690px]">
          <p className="font-serif text-[21px] leading-[1.6] text-ink">
            Implementation is a means, not the point.
          </p>
          <p className="mt-2 font-serif text-[17px] leading-[1.8] text-note">
            AI가 단순 구현을 빠르게 대체하는 시대에, 구현 자체보다 그 안에서 얻은 학습이 다음
            프로젝트의 결정으로 이어진 사이클이 더 중요하다고 생각합니다.
          </p>
        </blockquote>

        <div className="mt-12 max-w-[690px]">
          <Sub>기술</Sub>
          <dl className="mt-3 border-t border-rule text-[16px] leading-[1.65]">
            {SKILLS.map((c) => (
              <div
                key={c.title}
                className="grid grid-cols-1 gap-x-4 gap-y-0.5 border-b border-rule py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]"
              >
                <dt className="text-note">{c.title}</dt>
                <dd className="text-ink">{c.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </EvidenceProvider>
    </section>
  );
}
