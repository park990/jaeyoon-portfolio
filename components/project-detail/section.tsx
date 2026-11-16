// 본문 문단 묶음 — 17px · 줄간격 1.75 · 한 줄 최대 680px (스크롤 등장 연출 없음)
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[680px] space-y-5 text-[17px] leading-[1.75] text-foreground">
      {children}
    </div>
  );
}
