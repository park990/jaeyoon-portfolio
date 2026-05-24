"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowDown, Star } from "lucide-react";

type Node = {
  label: string;       // 위쪽: 단계명
  org: string;         // 가운데: 기관/스택
  period: string;      // 아래쪽: 기간
  current?: boolean;   // true면 primary 액센트 + ⭐
};

const nodes: Node[] = [
  {
    label: "항공산업공학 학사",
    org: "한서대학교",
    period: "2018.03 ~ 2025.02",
  },
  {
    label: "Java Full-Stack 양성과정",
    org: "쌍용교육센터",
    period: "2025.04 ~ 2025.11",
  },
  {
    label: "앱 개발 시작 (Booming)",
    org: "Flutter + Spring Boot",
    period: "2025.11 ~",
  },
  {
    label: "NLP 집중 과정",
    org: "멋쟁이사자처럼",
    period: "2026.03 ~ 2026.05",
  },
  {
    label: "AI 엔지니어 (현재)",
    org: "StructVerify-Lab · Text2Graph",
    period: "2026.05 ~",
    current: true,
  },
];

// Framer Motion stagger — 사용자 명시 0.1초 간격
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function NodeCard({ node }: { node: Node }) {
  return (
    <motion.div
      variants={item}
      className={
        "flex min-w-[140px] flex-1 flex-col items-center gap-1 rounded-lg border bg-card px-3 py-3 text-center " +
        (node.current
          ? "border-primary/60 ring-1 ring-primary/20"
          : "border-border")
      }
    >
      <div
        className={
          "flex items-center gap-1 text-sm font-medium " +
          (node.current ? "text-primary" : "text-foreground")
        }
      >
        {node.label}
        {node.current && (
          <Star className="h-3.5 w-3.5 fill-current" aria-label="현재" />
        )}
      </div>
      <div className="text-xs text-muted-foreground">{node.org}</div>
      <div className="text-xs text-muted-foreground/70">{node.period}</div>
    </motion.div>
  );
}

function Arrow() {
  return (
    <motion.div
      variants={item}
      className="flex shrink-0 items-center justify-center text-muted-foreground"
      aria-hidden="true"
    >
      <ArrowDown className="h-4 w-4 lg:hidden" />
      <ArrowRight className="hidden h-4 w-4 lg:block" />
    </motion.div>
  );
}

export function LearningPathTimeline() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Learning path
      </p>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        // lg+에서 가로, 그 외 세로. 노드 5개라 lg에서도 좁아질 수 있어 flex-wrap 허용
        className="flex flex-col items-stretch gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-2"
      >
        {nodes.map((node, i) => (
          <Fragment key={node.label}>
            <NodeCard node={node} />
            {i < nodes.length - 1 && <Arrow />}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
