import { Hero } from "@/components/home/hero";
import { Work } from "@/components/home/work";
import { Career } from "@/components/home/career";
import { OtherWork } from "@/components/home/other-work";
import { Intro } from "@/components/home/intro";
import { Contact } from "@/components/home/contact";

// 홈: 첫 화면(작은 줄 · 큰 문장 · 보조 문단 · 증거 3줄) → 작업(띠 4개) → 경력·교육 표
// → 그 밖의 작업 → 소개·기술 → 연락. (헤더·푸터는 app/layout.tsx)
export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Career />
      <OtherWork />
      <Intro />
      <Contact />
    </>
  );
}
