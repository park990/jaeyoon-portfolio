// 본문 문단 묶음 — 17px · 한 줄 최대 690px (스크롤 등장 연출 없음)
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[690px] space-y-5 text-ink">{children}</div>;
}
