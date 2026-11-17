import type { Metadata } from "next";
import type { Project } from "@/lib/projects";

// 사이트 제목·공유 미리보기 공용 값 (2.5단계 7번)
// 탭 제목과 og:title에는 " — "와 " · "를 쓰지 않는다: 홈 "박재윤 | AI·NLP 엔지니어", 사례 "<프로젝트명> | 박재윤"
export const SITE_URL = "https://jaeyoon-portfolio.vercel.app";
export const SITE_TITLE = "박재윤 | AI·NLP 엔지니어";
export const SITE_DESCRIPTION =
  "숫자를 말할 때는 출처를 같이 붙입니다. 기사 속 수치 주장을 공식 통계와 대조하는 LLM 파이프라인을 만들었고, 지금은 흩어진 공공 자료를 모아 검사 규칙으로 자동 점검하는 서비스를 혼자 만들고 있습니다.";

// Next 메타데이터는 openGraph를 통째로 바꾸므로(얕은 병합) 사례 페이지도 이 값을 펼쳐 쓴다
export const BASE_OPEN_GRAPH = {
  type: "website",
  locale: "ko_KR",
  siteName: "박재윤 포트폴리오",
} as const;

// app/opengraph-image.tsx가 만드는 공용 이미지. 홈은 파일 규칙으로 자동으로 붙지만,
// openGraph를 따로 정하는 사례 페이지와 twitter:image에는 주소를 직접 적어야 한다.
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "박재윤, AI·NLP 엔지니어. 숫자를 말할 때는 출처를 같이 붙입니다.",
};

/** 사례 페이지 메타데이터: 탭 제목 "<프로젝트명> | 박재윤"(layout의 template), og:title도 같게 */
export function caseMetadata(p: Project): Metadata {
  const title = `${p.title} | 박재윤`;
  const url = `${SITE_URL}/projects/${p.slug}`;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { ...BASE_OPEN_GRAPH, url, title, description: p.description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description: p.description, images: [OG_IMAGE.url] },
  };
}
