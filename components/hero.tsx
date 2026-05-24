"use client";

import { motion } from "framer-motion";

// 임시 Hero. 추후 사진/CTA/소개 문구 보강 예정.
// framer-motion으로 진입 페이드만 살짝.
export function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-3.5rem-5rem)] max-w-3xl flex-col justify-center px-6 py-24">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-4 text-sm font-medium text-primary"
      >
        Hi, I&apos;m
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl"
      >
        Jaeyoon Park
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        className="mt-4 text-pretty text-lg text-muted-foreground sm:text-xl"
      >
        AI/NLP Engineer &amp; Full-Stack Developer
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
        className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
      >
        백엔드에서 AI/NLP로 영역을 넓혀가는 신입 엔지니어입니다. LLM
        파이프라인과 NLP 모델 학습을 풀스택 기반 위에 쌓아가고 있습니다.
      </motion.p>
    </section>
  );
}
