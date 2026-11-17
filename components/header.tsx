import Link from "next/link";
import { PROFILE } from "@/lib/profile";

// 머리줄: 사이트 이름(왼쪽), 메뉴(오른쪽). [8단계] 메뉴는 작업, 경력, 소개, 연락, 이력서(새 탭), GitHub, 메일.
// 480px 미만에서는 GitHub, 메일을 숨긴다(둘 다 연락 구역에 있음).
// 홈 구역 앵커는 "/#..."로 두어 사례 페이지에서도 홈의 해당 구역으로 간다.
const nav = [
  { href: "/#work", label: "작업" },
  { href: "/#career", label: "경력" },
  { href: "/#about", label: "소개" },
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
        <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer">
          이력서
        </a>
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="max-[480px]:hidden">
          GitHub
        </a>
        <a href={`mailto:${PROFILE.email}`} className="max-[480px]:hidden">
          메일
        </a>
      </nav>
    </header>
  );
}
