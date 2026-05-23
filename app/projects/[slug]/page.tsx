import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Users, ExternalLink } from "lucide-react";
import { getProjectBySlug, projects } from "@/lib/projects";

// hasDetailPage가 true인 슬러그는 전용 정적 페이지(app/projects/<slug>/page.tsx)가
// 우선 매칭되므로 동적 라우트의 prerender 대상에서 제외 → 빌드 중복 제거.
export function generateStaticParams() {
  return projects
    .filter((p) => !p.hasDetailPage)
    .map((p) => ({ slug: p.slug }));
}

// Next.js 16: params는 Promise. await 필수.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.title} · Jaeyoon Park`,
    description: project.subtitle,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article
      className="mx-auto max-w-3xl px-6 py-16 sm:py-24"
      style={{ "--accent": project.accent } as React.CSSProperties}
    >
      {/* 뒤로 가기 */}
      <Link
        href="/#projects"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        모든 프로젝트
      </Link>

      {/* 헤더 */}
      <header className="mb-10">
        <span
          className="inline-flex items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-medium"
          style={{ color: project.accent }}
        >
          {project.group}
        </span>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{project.subtitle}</p>

        <p className="mt-6 text-base leading-[1.8] text-foreground/90">
          {project.oneLiner}
        </p>
      </header>

      {/* 메타 정보 */}
      <dl className="mb-10 grid grid-cols-1 gap-4 border-y border-border py-6 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              기간
            </dt>
            <dd className="mt-0.5 text-sm text-foreground">{project.period}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              팀 구성
            </dt>
            <dd className="mt-0.5 text-sm text-foreground">{project.team}명</dd>
          </div>
        </div>
      </dl>

      {/* 스택 */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 외부 링크 */}
      {project.links && project.links.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Links
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 본문 placeholder — 추후 challenge / approach / outcome 블록 추가 예정 */}
      <section className="rounded-lg border border-dashed border-border bg-background/40 p-6 text-sm text-muted-foreground">
        상세 내용 (Challenge · Approach · Outcome) 작성 중입니다.
      </section>
    </article>
  );
}
