"use client";

// HighWay Guide → HirePicker → Booming으로 이어지는 학습 사이클 시각화.
// 기존에 홈 About 섹션에 있던 트랙을 HirePicker의 narrative 맥락으로 이전.
// HirePicker가 JWT+Redis 전환의 중심이라는 위치가 맥락에 맞음.

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// 트랙 데이터. 각 step의 `current: true`면 HirePicker 단계로 하이라이트.
type Step = { title: string; caption: string; current?: boolean };
type Track = { label: string; steps: Step[] };

const tracks: Track[] = [
  {
    label: "Authentication",
    steps: [
      { title: "HttpSession", caption: "HighWay Guide — Stateful 세션" },
      { title: "JWT + Redis", caption: "HirePicker — 토큰 + 캐시", current: true },
      { title: "Flutter Secure Storage", caption: "Booming — 모바일 안전 저장" },
    ],
  },
  {
    label: "Data Layer",
    steps: [
      { title: "DB 중심", caption: "HighWay Guide — RDBMS 직접 조회" },
      { title: "Redis 캐싱", caption: "HirePicker — 핫 데이터 분리", current: true },
    ],
  },
];

function StepCard({ step }: { step: Step }) {
  return (
    <motion.div
      variants={item}
      className={
        "flex-1 rounded-lg border bg-card px-4 py-3 text-center sm:text-left " +
        (step.current
          ? "border-[var(--accent)]/50 bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]/20"
          : "border-border")
      }
    >
      <p
        className={
          "text-sm font-semibold sm:text-base " +
          (step.current ? "text-[var(--accent)]" : "text-foreground")
        }
      >
        {step.title}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{step.caption}</p>
    </motion.div>
  );
}

function TrackRow({ track }: { track: Track }) {
  return (
    <motion.div
      variants={item}
      className="rounded-xl border border-border/60 bg-background/40 p-5 sm:p-6"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
        {track.label}
      </p>
      <motion.div
        variants={container}
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      >
        {track.steps.map((step, i) => (
          <Fragment key={step.title}>
            <StepCard step={step} />
            {i < track.steps.length - 1 && (
              <motion.div
                variants={item}
                className="flex shrink-0 items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
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

export function EngineeringJourney() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="flex flex-col gap-4"
    >
      <p className="text-sm leading-[1.8] text-muted-foreground">
        HighWay Guide → HirePicker → Booming으로 이어지는 학습 사이클. 이전
        프로젝트에서 직접 부딪힌 한계가 이 프로젝트(HirePicker)의 기술 선택 근거가
        되었고, 다시 다음 프로젝트(Booming)의 결정으로 확장됐습니다.
      </p>
      {tracks.map((t) => (
        <TrackRow key={t.label} track={t} />
      ))}
    </motion.div>
  );
}
