"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Calendar, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

const MAX_STACK_BADGES = 4;

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const hiddenStackCount = Math.max(0, project.stack.length - MAX_STACK_BADGES);
  const visibleStack = project.stack.slice(0, MAX_STACK_BADGES);

  return (
    // 카드가 자체 initial/whileInView를 가져서 mount될 때마다 페이드인.
    // 부모 stagger variants에 의존하지 않으므로 필터 토글 후 재진입 시에도 정상 발화.
    // index 기반 delay로 첫 진입 시 stagger 흉내.
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
      style={{ "--accent": project.accent } as React.CSSProperties}
      className={cn(
        "group relative h-full",
        project.featured && "sm:col-span-2 lg:col-span-1"
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-200",
          "hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/10"
        )}
      >
        {/* 헤더: 그룹 배지 + 수상/대표 표시 (badge 우선) */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-medium"
            style={{ color: project.accent }}
          >
            {project.group}
          </span>
          {project.badge && (
            <span
              className="inline-flex items-center gap-1 truncate text-xs font-medium"
              style={{ color: project.accent }}
              aria-label="수상"
              title={project.badge}
            >
              <Award className="h-3.5 w-3.5 shrink-0 fill-current" />
              <span className="truncate">{project.badge}</span>
            </span>
          )}
        </div>

        {/* 제목 + 부제 */}
        <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-[var(--accent)]">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>

        {/* 한 줄 설명 */}
        <p className="mt-3 line-clamp-3 text-sm leading-[1.7] text-foreground/80">
          {project.oneLiner}
        </p>

        {/* 스택 배지 (4개까지 + 나머지 카운트) */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
          {hiddenStackCount > 0 && (
            <span className="rounded-md px-2 py-0.5 text-xs text-muted-foreground">
              +{hiddenStackCount}
            </span>
          )}
        </div>

        {/* 메타 정보 + CTA */}
        <div className="mt-auto flex items-end justify-between pt-5">
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {project.period}
            </p>
            <p className="flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              {project.team}명
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1 text-sm font-medium transition-all"
            style={{ color: project.accent }}
          >
            자세히 보기
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
