// 정적 빌드라 이 값은 빌드 시점에 고정된다 = 최종 갱신일(빌드 날짜, KST)
const BUILD_DATE = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-1 px-4 py-6 text-[13px] text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>
          최종 갱신 <time className="font-num" dateTime={BUILD_DATE}>{BUILD_DATE}</time> (빌드 날짜)
        </p>
        <p>
          © {BUILD_DATE.slice(0, 4)} Jaeyoon Park · Built with Next.js + Tailwind + Claude Code
        </p>
      </div>
    </footer>
  );
}
