import { notFound } from "next/navigation";

// 모든 사례는 app/projects/<slug>/page.tsx 전용 페이지가 우선 매칭된다.
// 이 동적 라우트는 그 밖의 주소를 404로 돌려보내는 역할만 한다
// (상세 페이지가 없는 '서울 재개발 분석 서비스'는 projects 목록에 없으므로 페이지가 생기지 않는다).
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

export default function ProjectFallback() {
  notFound();
}
