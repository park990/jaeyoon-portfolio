"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Mail, FileText, MapPin, Copy, Check } from "lucide-react";

const EMAIL = "rhkgkrwk2008@gmail.com";
const GITHUB = "https://github.com/park990";
const HUGGINGFACE = "https://huggingface.co/park990";
const RESUME = "/jaeyoon-park-resume.pdf";

// lucide 1.x에 브랜드 아이콘 없음 → 인라인 SVG.
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.7.41.36.78 1.06.78 2.15v3.19c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API 미지원/거부 환경에서는 그냥 무시 (mailto + 노출된 주소가 fallback)
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col items-center gap-8 text-center"
      >
        <motion.h2
          variants={item}
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Contact
        </motion.h2>

        <motion.p
          variants={item}
          className="max-w-xl text-balance text-2xl font-medium leading-[1.5] text-foreground sm:text-3xl"
        >
          함께하고 싶다면 연락 주세요.
        </motion.p>

        {/* 주요 CTA 버튼 두 개 */}
        <motion.div
          variants={item}
          className="mt-2 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            이메일 보내기
          </a>
          <a
            href={RESUME}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary sm:w-auto"
          >
            <FileText className="h-4 w-4" />
            이력서 PDF
          </a>
        </motion.div>

        {/* 보조 링크 (아이콘) */}
        <motion.div variants={item} className="mt-4 flex items-center gap-2">
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={HUGGINGFACE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HuggingFace"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-base transition-colors hover:border-primary/60"
          >
            {/* HuggingFace는 lucide에 없음 → 공식 마스코트 이모지로 fallback */}
            <span aria-hidden="true">🤗</span>
          </a>
        </motion.div>

        {/* 상세 정보 */}
        <motion.dl
          variants={item}
          className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-x-8"
        >
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Mail className="h-4 w-4" />
            <a
              href={`mailto:${EMAIL}`}
              className="hover:text-foreground"
            >
              {EMAIL}
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={copied ? "이메일 주소 복사됨" : "이메일 주소 복사"}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-foreground" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            {copied && (
              <span className="text-xs text-foreground" aria-hidden="true">
                복사됨
              </span>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <MapPin className="h-4 w-4" />
            서울특별시 영등포구
          </div>
        </motion.dl>
      </motion.div>
    </section>
  );
}
