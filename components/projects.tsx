"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  projects,
  PROJECT_GROUPS,
  type ProjectFilter,
} from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const headingItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Projects() {
  const [filter, setFilter] = React.useState<ProjectFilter>("All");

  // filter "All"이면 전체, 아니면 group 일치만
  const visible = React.useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.group === filter)),
    [filter]
  );

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-10"
      >
        {/* 제목 + 부제 */}
        <motion.div variants={headingItem} className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Projects
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            AI/NLP과 Full-Stack 양쪽에서 진행한 프로젝트들
          </p>
        </motion.div>

        {/* 필터 토글 */}
        <motion.div
          variants={headingItem}
          role="tablist"
          aria-label="프로젝트 필터"
          className="flex flex-wrap items-center gap-2"
        >
          {PROJECT_GROUPS.map((group) => {
            const active = filter === group;
            return (
              <button
                key={group}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(group)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {group}
              </button>
            );
          })}
          <span className="ml-2 text-xs text-muted-foreground">
            {visible.length}개
          </span>
        </motion.div>

        {/* 카드 그리드. 각 카드의 layout prop이 위치 전환을 부드럽게. */}
        {/* 카드 자체가 initial/whileInView를 가지므로 부모 motion 불필요. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
