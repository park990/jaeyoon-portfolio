import type { Metadata } from "next";
import "./lab.css";

// 디자인 시안 전용 구역. 검색엔진 색인 제외 (sitemap.ts에도 포함되지 않음).
export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
