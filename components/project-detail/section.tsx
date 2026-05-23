"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// framer-motion wrapper. children에 server component(예: CodeBlock) 포함 가능.
export function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="scroll-mt-24 py-12 sm:py-16"
    >
      {title && (
        <motion.h2
          variants={item}
          className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {title}
        </motion.h2>
      )}
      <motion.div variants={item}>{children}</motion.div>
    </motion.section>
  );
}

// 한글 본문 — leading-[1.8]
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-base leading-[1.8] text-foreground/85 sm:text-[17px]">
      {children}
    </div>
  );
}
