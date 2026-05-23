"use client";

import { motion, type Variants } from "framer-motion";

type Entry = {
  org: string;
  program: string;
  period: string;
  description: string;
  meta?: string;
};

const entries: Entry[] = [
  {
    org: "멋쟁이사자처럼",
    program: "자연어처리(NLP) AI 엔지니어 집중 과정",
    period: "2026.03 ~ 2026.05 (수료 예정)",
    description: "Transformer, RAG, LoRA, Document RE 등 LLM 응용 집중 학습",
  },
  {
    org: "쌍용교육센터",
    program: "AWS와 Docker & Kubernetes를 활용한 Java Full-Stack 개발자 양성과정",
    period: "2025.04 ~ 2025.11 (수료)",
    description: "Spring Boot, JPA, AWS, Docker 기반 풀스택 개발 트레이닝",
  },
  {
    org: "한서대학교",
    program: "항공산업공학과 (학사)",
    period: "2018.03 ~ 2025.02 (졸업)",
    description: "항공 운영 시스템과 산업공학 기반 데이터 분석 학습",
    meta: "GPA 3.8 / 4.5",
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

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
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
          Education
        </motion.h2>

        <ol className="relative ml-3 border-l border-border">
          {entries.map((e) => (
            <motion.li
              key={e.org + e.program}
              variants={item}
              className="ml-6 pb-6 last:pb-0"
            >
              <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{e.org}</h3>
                  <span className="text-sm text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">{e.program}</p>
                <p className="mt-3 text-sm leading-[1.8] text-foreground/80">
                  {e.description}
                </p>
                {e.meta && (
                  <p className="mt-2 text-xs text-muted-foreground">{e.meta}</p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
