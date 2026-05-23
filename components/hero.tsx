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
        언어와 사람을 잇는 AI 제품을 만듭니다. 자연어 처리, 데이터 파이프라인,
        그리고 끝단의 사용자 경험까지 — 전 스택을 오가며 일합니다.
      </motion.p>
    </section>
  );
}
