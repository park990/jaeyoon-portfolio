import { Hero } from "@/components/home/hero";
import { Work } from "@/components/home/work";
import { Career } from "@/components/home/career";
import { OtherWork } from "@/components/home/other-work";
import { Intro } from "@/components/home/intro";
import { Contact } from "@/components/home/contact";

// 홈: 첫 화면(역할 줄 · h1 · 보조 문단 · 예시 1줄 + 제 숫자 3줄) → 작업(띠 4개) → 경력·교육 표
// → 그 밖의 작업 → 소개·기술 → 연락. (머리줄·바닥글은 app/layout.tsx)
export default function Home() {
  return (
    <div className="site-wrap page">
      <Hero />
      <Work />
      <Career />
      <OtherWork />
      <Intro />
      <Contact />
    </div>
  );
}
