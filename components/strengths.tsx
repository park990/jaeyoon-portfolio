"use client";

import { motion, type Variants } from "framer-motion";
import { Workflow, FlaskConical, Layers } from "lucide-react";

// 사용자가 합격 포트폴리오 브리프에서 직접 지정한 3가지 강점 카피.
// 마케팅 문장이 아니라 "측정/구체 사실"로 적어두는 것이 의도.
const STRENGTHS = [
  {
    icon: Workflow,
    title: "LLM 파이프라인 설계",
    body: "claim 추출 → 검증 흐름을 직접 짜고, 운영에서 깨지는 지점(단위 누락·표 오매칭)을 프롬프트·규칙으로 잡습니다.",
  },
  {
    icon: FlaskConical,
    title: "RAG를 맹신하지 않습니다",
    body: "RAG가 정확도를 65.4% → 63.1%로 떨어뜨린 걸 측정하고 원인까지 분석. 적용 조건을 아는 엔지니어를 지향합니다.",
  },
  {
    icon: Layers,
    title: "모델 + 그걸 감싸는 서비스",
    body: "Spring 백엔드 · AWS 배포까지. 모델만이 아니라 서비스로 굴립니다.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Strengths() {
  return (
    <section
      id="strengths"
      aria-label="강점 3가지"
      className="mx-auto max-w-5xl px-6 py-16 sm:py-20"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
      >
        {STRENGTHS.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              variants={item}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:p-6"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="text-sm leading-[1.7] text-muted-foreground">
                {s.body}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
