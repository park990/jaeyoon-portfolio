"use client";

import { motion, type Variants } from "framer-motion";

type Entry = {
  org: string;
  role: string;
  period: string;
  location?: string;
  description: string;
};

const entries: Entry[] = [
  {
    org: "아시아나항공",
    role: "여객운송 인턴",
    period: "2024.06 ~ 2024.09 (4개월)",
    location: "인천국제공항 (KAL/AAR)",
    description:
      "대규모 여객 운송 시스템에서 데이터 정합성과 실시간 처리의 중요성을 현장에서 학습",
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

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
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
          Experience
        </motion.h2>

        {/* 타임라인: 왼쪽에 세로 라인 + 마커 */}
        <ol className="relative ml-3 border-l border-border">
          {entries.map((e) => (
            <motion.li
              key={e.org + e.role}
              variants={item}
              className="ml-6 pb-2 last:pb-0"
            >
              {/* 마커 — 라인 위에 올라타도록 absolute */}
              <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{e.org}</h3>
                  <span className="text-sm text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">{e.role}</p>
                {e.location && (
                  <p className="mt-1 text-xs text-muted-foreground">{e.location}</p>
                )}
                <p className="mt-3 text-sm leading-[1.8] text-foreground/80">
                  {e.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
