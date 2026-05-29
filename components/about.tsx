"use client";

import { motion, type Variants } from "framer-motion";

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

          {/* narrative 미리보기 — 핵심 4문단 (브리프 §5 About 가이드) */}
          <div className="flex flex-col gap-5">
            <Paragraph>
              <Highlight>기사 속 수치 주장을 검증하는 LLM 파이프라인</Highlight>을
              설계·구현하고, 데이터 적재부터 AWS 배포까지 직접 다룹니다. 모델만이
              아니라 그걸 감싸는 서비스(백엔드·인프라)까지 봅니다.
            </Paragraph>
            <Paragraph>
              항공산업공학과 학사 졸업 후 Java Full-Stack을 거쳐 NLP/LLM 영역으로
              자리를 옮겼고, 지금은 멋쟁이사자처럼 NLP 과정 최우수상으로 마무리한{" "}
              <Highlight>StructVerify-Lab</Highlight>을 이어가고 있습니다.
            </Paragraph>
            <Paragraph>
              RAG가 정확도를 65.4% → 63.1%로 떨어뜨린 걸 직접 측정하고 원인까지
              본 경험이 있어서, 새 기술을 붙일 때 적용 조건부터 확인하는 편입니다.
            </Paragraph>
            <Paragraph>
              이전 프로젝트의 한계를 다음 결정의 근거로 연결하는 사고가 강점입니다.
              LLM 출력의 단위 누락이나 KOSIS 표 오매칭처럼 운영에서 깨지는 지점을
              프롬프트·규칙·스키마로 잡아왔습니다.
            </Paragraph>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
