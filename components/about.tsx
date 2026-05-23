"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";

// 자식들을 순차로 등장시키는 stagger 컨테이너.
// once:true + margin으로 첫 진입 시 한 번만 발화.
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

// 학습 진화 트랙 데이터. 추후 수정/추가 편하도록 분리.
const tracks: { label: string; steps: { title: string; caption: string }[] }[] = [
  {
    label: "Authentication",
    steps: [
      { title: "HttpSession", caption: "Stateful 세션" },
      { title: "JWT + Redis", caption: "토큰 + 캐시" },
      { title: "Flutter Secure Storage", caption: "모바일 안전 저장" },
    ],
  },
  {
    label: "Data Layer",
    steps: [
      { title: "DB 중심", caption: "RDBMS 직접 조회" },
      { title: "Redis 캐싱", caption: "핫 데이터 분리" },
    ],
  },
];

function TimelineCard({ title, caption }: { title: string; caption: string }) {
  return (
    <motion.div
      variants={item}
      className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-center sm:text-left"
    >
      <p className="text-sm font-semibold text-foreground sm:text-base">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
    </motion.div>
  );
}

function Track({ label, steps }: (typeof tracks)[number]) {
  return (
    <motion.div
      variants={item}
      className="rounded-xl border border-border/60 bg-background/40 p-5 sm:p-6"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">
        {label}
      </p>
      <motion.div
        variants={container}
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      >
        {steps.map((step, i) => (
          <Fragment key={step.title}>
            <TimelineCard {...step} />
            {i < steps.length - 1 && (
              <motion.div
                variants={item}
                className="flex shrink-0 items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                {/* 모바일은 세로 흐름이라 아래 화살표, 데스크탑은 가로니까 오른쪽 화살표 */}
                <ArrowDown className="h-4 w-4 sm:hidden" />
                <ArrowRight className="hidden h-4 w-4 sm:block" />
              </motion.div>
            )}
          </Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
}

// 본문 문단 — 한글 가독성 위해 leading-[1.8]
function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={item}
      className="text-pretty text-base leading-[1.8] text-muted-foreground sm:text-[17px]"
    >
      {children}
    </motion.p>
  );
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

        <div className="flex flex-col gap-6">
          <Paragraph>
            항공산업공학을 전공하고 Java Full-Stack 개발자 양성과정을 거쳐 NLP/LLM 영역으로
            영역을 넓혀온 신입 개발자입니다. 풀스택 프로젝트 3개와 AI 프로젝트 2개를 거치며,
            단순한 기능 구현을 넘어 &lsquo;이전 프로젝트의 한계를 다음 프로젝트의 의사결정
            근거로 연결하는 학습 사이클&rsquo;을 만들어왔습니다.
          </Paragraph>
          <Paragraph>
            인증 시스템은 HttpSession Stateful 인증 → JWT+Redis → Flutter Secure Storage로,
            데이터 관리는 DB 중심 → Redis 캐싱으로 점진적으로 진화시켰습니다. 각 전환의 결정
            근거는 이전 프로젝트에서 직접 부딪힌 한계에서 나왔습니다.
          </Paragraph>
          <Paragraph>
            파이프라인 전체를 한 번 처음부터 짜본 경험이 강점입니다. LLM 출력의 단위 누락,
            시점 오매칭, KOSIS 표 관련성 같은 실제 운영 시 깨지는 지점들을 프롬프트 제약과
            Pydantic 스키마로 결정론적으로 묶어가며 만들었습니다.
          </Paragraph>
        </div>

        <motion.div variants={container} className="mt-2 flex flex-col gap-4">
          {tracks.map((track) => (
            <Track key={track.label} {...track} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
