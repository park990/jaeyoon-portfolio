"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/profile";

// 연락 — 메일 버튼, GitHub, 위치. 이력서 PDF는 내용이 옛 버전이라 숨김(PROFILE.showResume).
export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API 미지원/거부 환경에서는 무시 (mailto + 노출된 주소가 fallback)
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-border-strong">
      <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6">
        <h2 id="contact-title" className="text-[26px] font-semibold tracking-[-0.015em] text-foreground">
          연락
        </h2>
        <p className="mt-3 text-[20px] font-medium leading-[1.5] text-foreground">
          새로운 기회나 협업에 항상 열려 있습니다.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="inline-flex h-11 items-center rounded-sm bg-foreground px-5 text-[15px] font-medium text-background transition-opacity duration-150 hover:opacity-85"
          >
            이메일 보내기
          </a>
          <span className="font-num text-[15px] text-foreground">{PROFILE.email}</span>
          <button
            type="button"
            onClick={copy}
            className="h-9 rounded-sm border border-border px-3 text-[14px] text-foreground transition-colors duration-150 hover:bg-secondary"
            aria-live="polite"
          >
            {copied ? "복사됨" : "주소 복사"}
          </button>
          {PROFILE.showResume && (
            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] text-primary underline underline-offset-4"
            >
              이력서 PDF
            </a>
          )}
        </div>

        <dl className="mt-8 grid max-w-[560px] grid-cols-[7rem_minmax(0,1fr)] gap-y-2 text-[16px] leading-[1.6]">
          <dt className="text-muted-foreground">GitHub</dt>
          <dd>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              github.com/park990 ↗
            </a>
          </dd>
          <dt className="text-muted-foreground">HuggingFace</dt>
          <dd>
            <a
              href={PROFILE.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              huggingface.co/park990 ↗
            </a>
          </dd>
          <dt className="text-muted-foreground">위치</dt>
          <dd className="text-foreground">{PROFILE.location}</dd>
        </dl>
      </div>
    </section>
  );
}
