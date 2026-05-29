import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const SITE_URL = "https://jaeyoon-portfolio.vercel.app";

// Next.js App Router 컨벤션 — 빌드 시 정적 sitemap.xml 생성.
// 홈 + 각 프로젝트 상세 페이지(hasDetailPage)를 항목으로 포함.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 1.0,
  };

  const detailPages: MetadataRoute.Sitemap = projects
    .filter((p) => p.hasDetailPage)
    .map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: p.display === "featured" ? 0.9 : 0.7,
    }));

  return [home, ...detailPages];
}
