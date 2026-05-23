"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// LLM Pipeline 6단계. StructVerify-Lab의 핵심 검증 흐름.
// emphasized 박스(LLM Extract, Validate)는 하늘색 테두리로 강조.
type Stage = { en: string; ko: string; emphasized?: boolean };
const pipeline: Stage[] = [
  { en: "Input", ko: "원문 입력" },
  { en: "LLM Extract", ko: "구조화 추출", emphasized: true },
  { en: "Validate", ko: "Pydantic 검증", emphasized: true },
  { en: "Persist", ko: "PostgreSQL 적재" },
  { en: "Compare", ko: "KOSIS 비교" },
  { en: "Verdict", ko: "판정" },
];

function PipelineBox({ stage }: { stage: Stage }) {
  return (
    <motion.div
      variants={item}
      className={
        "flex-1 rounded-lg border bg-card px-3 py-3 text-center " +
        (stage.emphasized
          ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
          : "border-border")
      }
    >
      <p
        className={
          "text-sm font-semibold " +
          (stage.emphasized ? "text-primary" : "text-foreground")
        }
      >
        {stage.en}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{stage.ko}</p>
    </motion.div>
  );
}

function LLMPipelineDiagram() {
  return (
    <motion.div
      variants={item}
      className="rounded-xl border border-border/60 bg-background/40 p-5 sm:p-6"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">
        LLM Pipeline
      </p>
      <motion.div
        variants={container}
        // 박스가 6개라 lg에서도 한 줄에 안 들어갈 수 있어 flex-wrap 허용
        className="flex flex-col items-stretch gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3"
      >
        {pipeline.map((stage, i) => (
          <Fragment key={stage.en}>
            <PipelineBox stage={stage} />
            {i < pipeline.length - 1 && (
              <motion.div
                variants={item}
                className="flex shrink-0 items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                <ArrowDown className="h-4 w-4 lg:hidden" />
                <ArrowRight className="hidden h-4 w-4 lg:block" />
              </motion.div>
            )}
          </Fragment>
        ))}
      </motion.div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        StructVerify-Lab의 핵심 검증 파이프라인 — 도메인 비의존적 수치 팩트체크 흐름.
      </p>
    </motion.div>
  );
}

// 본문 문단 — 한글 leading-[1.7]
function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={item}
      className="text-pretty text-base leading-[1.7] text-muted-foreground sm:text-[17px]"
    >
      {children}
    </motion.p>
  );
}

// 본문 안의 핵심 구문 강조. primary 액센트 + medium weight.
// 너무 자주 쓰면 무뎌지니까 한 문단에 1회 정도가 적정.
function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-primary">{children}</span>;
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-10"
      >
        <motion.h2
          variants={item}
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          About
        </motion.h2>

        <div className="flex flex-col gap-8">
          <Paragraph>
            항공산업공학과 학사 졸업 후 진로를 다시 고민하다, Java Full-Stack 양성과정에서
            백엔드와 인프라 기초를 다졌습니다. HighWay Guide(JSP/Servlet)와
            HirePicker(Spring Boot + Next.js) 두 웹 프로젝트를 거친 뒤, 앱 개발에도
            도전하고 싶어 Booming(Flutter + Spring Boot) 모바일 앱을 시작했습니다.{" "}
            <Highlight>Booming은 AI가 사용자의 대화를 보조해주는</Highlight> — 대화의
            정적 시간을 메워주고 다음 발화를 제안하는 — 앱이었는데, 백엔드와
            프론트엔드는 익숙했지만 핵심인 AI 영역은 한 번도 다뤄본 적이
            없었습니다. 앱을 완성하기 위해, 그리고 AI에 대한 막막함을 해소하기
            위해 멋쟁이사자처럼(부트캠프) NLP 집중 과정에 들어갔습니다.
          </Paragraph>
          <Paragraph>
            학습을 시작하자마자 백엔드 개발보다 AI/NLP 영역이 훨씬 매력적이고
            전망이 밝다고 느꼈습니다. Text2Graph에서 ATLOP Loss 구현 오류와 평가
            로직 버그를 수정해 F1을 +4.07pt 개선하고, StructVerify-Lab에서 LLM
            출력의 단위 누락을 Pydantic 스키마로 결정론적으로 잡아내며 — 모델
            작동 원리를 이해하고 직접 통제하는 경험에 빠져들었습니다. 지금은
            처음 입문한 동기(앱 완성)를 넘어,{" "}
            <Highlight>AI 엔지니어로서 전문성을 쌓아가는 길</Highlight>을 걷고
            있습니다. 풀스택 기반은 AI 모델을 실제 운영 가능한 서비스로 만드는
            사고의 든든한 기반이 됩니다.
          </Paragraph>
          <Paragraph>
            이전 프로젝트의 한계를 다음 프로젝트의 의사결정 근거로 연결하는
            사고가 강점입니다. LLM 출력의 단위 누락, 시점 오매칭, KOSIS 표 관련성
            같은 실제 운영 시 깨지는 지점들을 프롬프트 제약과 Pydantic 스키마로
            결정론적으로 묶어가며 만들어왔습니다.
          </Paragraph>
        </div>

        <LLMPipelineDiagram />
      </motion.div>
    </section>
  );
}
