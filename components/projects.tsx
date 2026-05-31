"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getProjectsByDisplay } from "@/lib/projects";
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
  const featured = getProjectsByDisplay("featured");
  const secondary = getProjectsByDisplay("secondary");
  const others = getProjectsByDisplay("other");

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-12"
      >
        {/* 제목 */}
        <motion.div variants={headingItem} className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Projects
          </h2>
        </motion.div>

        {/* ─── Featured · AI/NLP 3카드 ─── */}
        <motion.div variants={headingItem} className="flex flex-col gap-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Featured · AI / NLP
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                대표 프로젝트 3 — 결과·수치·트러블슈팅 중심
              </p>
            </div>
            <span className="text-xs text-muted-foreground">{featured.length}개</span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ─── Secondary · Full-Stack 2카드 (작게) ─── */}
        {secondary.length > 0 && (
          <motion.div variants={headingItem} className="flex flex-col gap-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground/85">
                  Full-Stack
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  한 프로젝트의 한계가 다음 결정이 된 풀스택 사이클 (HighWay → HirePicker → Booming)
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{secondary.length}개</span>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {secondary.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Other Projects · 한 줄 라인 ─── */}
        {others.length > 0 && (
          <motion.div
            variants={headingItem}
            className="flex flex-col gap-2 border-t border-border pt-6"
          >
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Other Projects
            </h3>
            <ul className="flex flex-col gap-1.5">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <span className="font-medium">{p.title}</span>
                    <span className="text-muted-foreground">— {p.subtitle}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
