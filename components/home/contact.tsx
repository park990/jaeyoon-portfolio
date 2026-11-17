"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/profile";

// 연락 — 메일, GitHub, 위치.
// 링크는 펜 + 밑줄(열리는 링크의 뜻 하나), 단독 링크·버튼은 누르는 높이 44px 이상.
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
    <section id="contact" aria-labelledby="contact-title" className="sec mt-[clamp(56px,7vw,96px)]">
      <h2 id="contact-title" className="sec-label">
        연락
      </h2>
      <p className="sent-title mt-3">새로운 기회나 협업에 항상 열려 있습니다.</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[16px]">
        <a href={`mailto:${PROFILE.email}`} className="inline-flex min-h-11 items-center font-semibold">
          이메일 보내기
        </a>
        <span className="text-ink">{PROFILE.email}</span>
        <button
          type="button"
          onClick={copy}
          className="h-11 border border-ink px-4 text-[15px] text-ink transition-colors duration-150 hover:text-pen-h"
          aria-live="polite"
        >
          {copied ? "복사됨" : "주소 복사"}
        </button>
      </div>

      <dl className="mt-6 grid max-w-[560px] grid-cols-[7rem_minmax(0,1fr)] items-baseline gap-y-1 text-[16px] leading-[1.6]">
        <dt className="text-note">이력서</dt>
        <dd>
          <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" className="hit">
            PDF 열기
          </a>
        </dd>
        <dt className="text-note">GitHub</dt>
        <dd>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="hit">
            github.com/park990
          </a>
        </dd>
        <dt className="text-note">HuggingFace</dt>
        <dd>
          <a href={PROFILE.huggingface} target="_blank" rel="noopener noreferrer" className="hit">
            huggingface.co/park990
          </a>
        </dd>
        <dt className="text-note">위치</dt>
        <dd className="text-ink">{PROFILE.location}</dd>
      </dl>
    </section>
  );
}
