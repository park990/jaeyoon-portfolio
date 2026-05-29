"use client";

import { motion } from "framer-motion";
import { Award, ArrowDown, Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-3.5rem-5rem)] max-w-3xl flex-col justify-center px-6 py-24">
      {/* 수상 배지 — Hero 최상단 신뢰 신호 */}
      <motion.a
        href="#projects"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/15"
      >
        <Award className="h-3.5 w-3.5" />
        멋쟁이사자처럼 NLP 과정 최우수상
      </motion.a>

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
        className="mt-3 text-lg font-medium text-primary sm:text-xl"
      >
        AI · NLP Engineer
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
        className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        기사 속 수치 주장을 검증하는 LLM 파이프라인을 설계·구현하고,
        모델을 감싸는 백엔드/인프라까지 직접 다룹니다.
      </motion.p>

      {/* CTA — Featured 보기 + Contact */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <a
          href="#projects"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Projects
          <ArrowDown className="h-4 w-4" />
        </a>
        <a
          href="#contact"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary"
        >
          <Mail className="h-4 w-4" />
          Contact
        </a>
      </motion.div>
    </section>
  );
}
