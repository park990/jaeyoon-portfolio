"use client";

import { motion, type Variants } from "framer-motion";

// 홈 하단 작은 Background 블록. Experience + Education을 한 섹션에 묶음.
// 큰 타임라인 카드 대신 한 줄 요약 리스트로 컴팩트하게.

type ExpEntry = {
  org: string;
  role: string;
  period: string;
  note?: string;
};

type EduEntry = {
  org: string;
  program: string;
  period: string;
  meta?: string;
};

const experience: ExpEntry[] = [
  {
    org: "아시아나항공",
    role: "여객운송 인턴",
    period: "2024.06 ~ 09 · 4개월",
    note: "인천국제공항 여객운송직 — 다양한 국적·성격의 승객을 동시에 응대하며 커뮤니케이션과 우선순위 판단을 단련. 이후 팀 프로젝트 협업의 자연스러운 기반이 됨.",
  },
];

const education: EduEntry[] = [
  {
    org: "멋쟁이사자처럼",
    program: "자연어처리(NLP) AI 엔지니어 집중 과정",
    period: "2026.03 ~ 05",
    meta: "최우수상",
  },
  {
    org: "쌍용교육센터",
    program: "Java Full-Stack 개발자 양성과정 (AWS · Docker)",
    period: "2025.04 ~ 11",
  },
  {
    org: "한서대학교",
    program: "항공산업공학과 학사",
    period: "2018.03 ~ 2025.02",
    meta: "GPA 3.8 / 4.5",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function ExperienceEducation() {
  return (
    <section
      id="background"
      aria-label="Experience and Education"
      className="mx-auto max-w-5xl px-6 py-16 sm:py-20"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10"
      >
        {/* Experience */}
        <motion.div variants={item} className="flex flex-col gap-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Experience
          </h2>
          <ul className="flex flex-col gap-4">
            {experience.map((e) => (
              <li
                key={e.org + e.role}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {e.org}
                  </h3>
                  <span className="text-xs text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-primary">{e.role}</p>
                {e.note && (
                  <p className="mt-2 text-xs leading-[1.7] text-foreground/75">
                    {e.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Education */}
        <motion.div variants={item} className="flex flex-col gap-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Education
          </h2>
          <ul className="flex flex-col gap-3">
            {education.map((e) => (
              <li
                key={e.org + e.program}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {e.org}
                  </h3>
                  <span className="text-xs text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-0.5 text-xs text-foreground/80">{e.program}</p>
                {e.meta && (
                  <p className="mt-1 text-xs font-medium text-primary">{e.meta}</p>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
