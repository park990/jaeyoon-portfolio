import Link from "next/link";
import { PROFILE } from "@/lib/profile";

// 머리줄: 사이트 이름(왼쪽) · 메뉴(오른쪽). 메뉴 항목은 1단계 그대로(작업 · 경력 · 연락 · GitHub · 메일).
// 홈 구역 앵커는 "/#..."로 두어 사례 페이지에서도 홈의 해당 구역으로 간다.
// (주의: /lab 시안은 body > header 를 숨기므로 이 요소는 body 직계 <header>여야 한다)
const nav = [
  { href: "/#work", label: "작업" },
  { href: "/#career", label: "경력" },
  { href: "/#contact", label: "연락" },
];

export function Header() {
  return (
    <header className="site-wrap site-header w-full">
      <Link href="/" className="site-name">
        {PROFILE.nameKo}
      </Link>
      <nav aria-label="사이트 메뉴" className="site-nav">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={`mailto:${PROFILE.email}`}>메일</a>
      </nav>
    </header>
  );
}
