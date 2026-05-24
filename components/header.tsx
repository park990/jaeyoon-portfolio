import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

// 홈 페이지의 섹션 앵커들. 추가/변경 편하도록 배열 분리.
// 모든 섹션이 "/" 페이지 안에 있으므로 href는 "/#xxx" 또는 "#xxx" 둘 다 동작.
// 절대 경로("/")를 prefix로 두면 상세 페이지(/projects/[slug])에서 클릭 시
// 홈으로 이동하면서 해당 섹션으로 스크롤됨.
const nav = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          Jaeyoon-Portfolio
        </Link>

        {/* 데스크탑(md+)에서만 풀 nav 노출. 모바일은 일단 숨김 — 햄버거는 다음 단계. */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* 모바일에선 테마 토글만 노출 */}
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
