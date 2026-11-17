import { notFound } from "next/navigation";

// 모든 사례는 app/projects/<slug>/page.tsx 전용 페이지가 우선 매칭된다.
// 이 동적 라우트는 그 밖의 주소를 404로 돌려보내는 역할만 한다
// (projects 목록의 사례는 모두 전용 페이지가 있다).
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

export default function ProjectFallback() {
  notFound();
}
