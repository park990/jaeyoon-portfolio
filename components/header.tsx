import Link from "next/link";
import { PROFILE } from "@/lib/profile";

// 얇게 고정되는 헤더: 이름 / 작업·경력·연락 / GitHub·메일
// 홈 섹션 앵커는 "/#..."로 두어 사례 페이지에서도 홈의 해당 구역으로 이동한다.
// (주의: /lab 시안은 body > header 를 숨기므로 이 요소는 body 직계 <header>여야 한다)
const nav = [
  { href: "/#work", label: "작업" },
  { href: "/#career", label: "경력" },
  { href: "/#contact", label: "연락" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-[1120px] items-center justify-between gap-4 px-4 text-[14px] sm:px-6">
        <Link href="/" className="shrink-0 font-semibold text-foreground hover:underline hover:underline-offset-4">
          {PROFILE.nameKo}
        </Link>

        <nav aria-label="홈 구역" className="flex items-center gap-4 sm:gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:underline hover:underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4 text-muted-foreground">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground hover:underline hover:underline-offset-4"
          >
            GitHub
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            className="hover:text-foreground hover:underline hover:underline-offset-4"
          >
            메일
          </a>
        </div>
      </div>
    </header>
  );
}
