"use client";

import { motion, type Variants } from "framer-motion";
import { LearningPathTimeline } from "@/components/learning-path-timeline";

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

        {/* 좌측 portrait + 우측 narrative. 모바일은 portrait 위, narrative 아래로 자동 세로 */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr] sm:items-start sm:gap-10"
        >
          {/* 프로필 portrait */}
          <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-border bg-card sm:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile/jaeyoon.jpg"
              alt="박재윤 프로필 사진"
              loading="lazy"
              className="block h-auto w-full"
            />
          </div>

          {/* narrative 3문단 */}
          <div className="flex flex-col gap-8">
            <Paragraph>
              항공산업공학과 학사 졸업 후 진로를 다시 고민하다, Java Full-Stack
              양성과정에서 백엔드와 인프라 기초를 다졌습니다. HighWay Guide(JSP/Servlet)와
              HirePicker(Spring Boot + Next.js) 두 웹 프로젝트를 거친 뒤, 앱
              개발에도 도전하고 싶어 Booming(Flutter + Spring Boot) 모바일 앱을
              시작했습니다.{" "}
              <Highlight>Booming은 AI가 사용자의 대화를 보조해주는</Highlight> —
              대화의 정적 시간을 메워주고 다음 발화를 제안하는 — 앱이었는데,
              백엔드와 프론트엔드는 익숙했지만 핵심인 AI 영역은 한 번도 다뤄본
              적이 없었습니다. 앱을 완성하기 위해, 그리고 AI에 대한 막막함을
              해소하기 위해 멋쟁이사자처럼(부트캠프) NLP 집중 과정에 들어갔습니다.
            </Paragraph>
            <Paragraph>
              학습을 시작하면서 AI/NLP 자체에 더 깊이 빠져들었습니다.
              Text2Graph에서 ATLOP Loss 구현 오류와 평가 로직 버그를 수정해 F1을
              +4.07pt 개선하고, StructVerify-Lab에서 LLM 출력의 단위 누락을
              Pydantic 스키마로 결정론적으로 잡아내며 — 모델 작동 원리를
              이해하고 직접 통제하는 경험이 무엇보다 매력적이었습니다. 지금은
              처음 입문한 동기(앱 완성)를 넘어,{" "}
              <Highlight>AI 엔지니어로서 전문성을 쌓아가는 방향</Highlight>에
              집중하고 있습니다. 풀스택 기반은 AI 모델을 실제 운영 가능한
              서비스로 만드는 사고의 기반이 됩니다.
            </Paragraph>
            <Paragraph>
              이전 프로젝트의 한계를 다음 프로젝트의 의사결정 근거로 연결하는
              사고가 강점입니다. LLM 출력의 단위 누락, 시점 오매칭, KOSIS 표
              관련성 같은 실제 운영 시 깨지는 지점들을 프롬프트 제약과 Pydantic
              스키마로 결정론적으로 묶어가며 만들어왔습니다.
            </Paragraph>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <LearningPathTimeline />
        </motion.div>
      </motion.div>
    </section>
  );
}
