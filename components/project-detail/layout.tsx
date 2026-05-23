import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Users, ExternalLink } from "lucide-react";
import { getNextProject, type Project, type ProjectLink } from "@/lib/projects";

// lucide 1.x에 GitHub 브랜드 아이콘 없음 → 인라인 SVG.
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.7.41.36.78 1.06.78 2.15v3.19c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

// 링크 라벨이 "GitHub"이면 GitHub 아이콘, "HuggingFace"면 🤗, 그 외엔 ExternalLink.
function LinkIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("github")) return <GithubIcon className="h-4 w-4" />;
  if (l.includes("hugging")) return <span aria-hidden="true">🤗</span>;
  return <ExternalLink className="h-3.5 w-3.5" />;
}

export function ProjectHeader({
  project,
  oneLiner,
  period,
  team,
  links,
}: {
  project: Project;
  oneLiner: string;
  period: string;
  team: string;
  links?: ProjectLink[];
}) {
  return (
    <header className="mb-10">
      <Link
        href="/#projects"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects로 돌아가기
      </Link>

      <div className="mt-2">
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
        <p className="mt-6 text-base leading-[1.8] text-foreground/90">{oneLiner}</p>

        {/* 메타 정보 */}
        <div className="mt-6 flex flex-col gap-3 border-y border-border py-4 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {period}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {team}
          </span>
          {links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]"
            >
              <LinkIcon label={link.label} />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

// 하단: Projects로 돌아가기 + 다음 프로젝트 미리보기 (있을 때만)
export function ProjectFooter({ currentSlug }: { currentSlug: string }) {
  const next = getNextProject(currentSlug);
  return (
    <footer className="mt-12 flex flex-col gap-6 border-t border-border pt-10">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects로 돌아가기
      </Link>

      {next && (
        <Link
          href={`/projects/${next.slug}`}
          // 다음 프로젝트의 액센트를 미리보기 카드에 inline으로 주입
          style={{ "--accent": next.accent } as React.CSSProperties}
          className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
        >
          <div>
            <p className="text-xs text-muted-foreground">다음 프로젝트</p>
            <p
              className="mt-1 text-base font-semibold text-foreground transition-colors group-hover:text-[var(--accent)]"
            >
              {next.title}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{next.subtitle}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
        </Link>
      )}
    </footer>
  );
}
