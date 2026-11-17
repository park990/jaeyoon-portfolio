// 정적 빌드라 이 값은 빌드 시점에 고정된다 = 최종 갱신일(빌드 날짜, KST)
const BUILD_DATE = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

// 내용은 1단계 그대로. 항목 사이 " · "는 간격으로 나눴다.
export function Footer() {
  return (
    <footer className="site-wrap w-full">
      <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-rule py-6 text-[13px] leading-[1.6] text-note">
        <p>
          최종 갱신 <time dateTime={BUILD_DATE}>{BUILD_DATE}</time> (빌드 날짜)
        </p>
        <p>© {BUILD_DATE.slice(0, 4)} Jaeyoon Park</p>
        <p>Built with Next.js + Tailwind + Claude Code</p>
      </div>
    </footer>
  );
}
