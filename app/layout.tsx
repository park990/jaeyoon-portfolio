import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

// 본문·제목: Pretendard variable (단일 woff2가 wght 100~900 전부 커버)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

// 숫자·SHA·근거 등급 표시 전용
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://jaeyoon-portfolio.vercel.app";
const SITE_TITLE = "박재윤 — AI · NLP 엔지니어 (수치 검증 · 데이터 파이프라인)";
const SITE_DESCRIPTION =
  "숫자를 말할 때는 출처를 같이 붙입니다. 기사 속 수치 주장을 공식 통계와 대조하는 LLM 파이프라인을 만들었고, 지금은 흩어진 공공 자료를 모아 검사 규칙으로 자동 점검하는 서비스를 혼자 만들고 있습니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · 박재윤",
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
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "박재윤 · Portfolio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    // suppressHydrationWarning: next-themes가 client에서 class="dark"를 주입하므로
    // 서버 마크업과 일시적으로 달라짐 → 공식 권장 처리
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
