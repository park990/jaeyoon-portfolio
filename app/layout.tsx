import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BASE_OPEN_GRAPH, OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

// 글꼴 세 가지 (next/font/google). 한글 글꼴은 unicode-range 조각으로 쓰는 글자만 받는다.
// 명조: 주장(사이트 이름 · h1 · 문장형 제목 · 첫 화면 주장 줄 · 결과의 큰 값 · 인용문)
const serif = Noto_Serif_KR({
  weight: ["400", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false,
});

// 고딕: 그 밖의 모든 글자
const sans = IBM_Plex_Sans_KR({
  weight: ["400", "600"],
  variable: "--font-plex-sans-kr",
  display: "swap",
  preload: false,
});

// 고정폭: 코드 · 파일 경로 · 커밋 번호만 (홈에는 쓰이지 않아 미리 받지 않는다)
const mono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | 박재윤",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI Engineer",
    "NLP Engineer",
    "LLM",
    "RAG",
    "HyperCLOVA X",
    "Pydantic",
    "pgvector",
    "FastAPI",
    "Spring Boot",
    "Next.js",
    "Portfolio",
    "박재윤",
  ],
  authors: [{ name: "Jaeyoon Park", url: SITE_URL }],
  creator: "Jaeyoon Park",
  // og:image는 app/opengraph-image.tsx(파일 규칙)가 붙인다. twitter:image는 같은 주소를 직접 적는다
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable} ${mono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* /lab 시안은 body > header · body > footer 를 숨기므로 둘 다 body 직계로 둔다 */}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
