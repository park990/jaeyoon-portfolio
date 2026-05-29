import { Hero } from "@/components/hero";
import { Strengths } from "@/components/strengths";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { About } from "@/components/about";
import { ExperienceEducation } from "@/components/experience-education";
import { Contact } from "@/components/contact";

// Home IA (Phase 1):
// Hero → Strengths(3) → Projects(Featured 3 · Full-Stack 2 · Other 1줄)
// → Skills(컴팩트) → About 미리보기 → Background(Exp+Edu 합본) → Contact
export default function Home() {
  return (
    <>
      <Hero />
      <Strengths />
      <Projects />
      <Skills />
      <About />
      <ExperienceEducation />
      <Contact />
    </>
  );
}
