import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

// 영문: Inter variable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// 한글: Pretendard variable (단일 woff2가 wght 100~900 전부 커버)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const SITE_URL = "https://jaeyoon-portfolio.vercel.app";
const SITE_TITLE = "Jaeyoon Park · AI · NLP Engineer";
const SITE_DESCRIPTION =
  "기사 속 수치 주장을 검증하는 LLM 파이프라인을 설계·구현하고, 모델을 감싸는 백엔드/인프라까지 다룹니다. StructVerify-Lab · Medical RAG Experiment · Text2Graph (DocRED) · Booming · HirePicker.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Jaeyoon Park",
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
    siteName: "Jaeyoon Park · Portfolio",
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
      className={`${pretendard.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
