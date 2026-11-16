"use client";

import { useState } from "react";
import styles from "../c.module.css";
import { ENT_INFO, ENT_ORDER, type EntType } from "./corpus";

// 내비게이션 = 개체 유형 범례. 유형을 누르면 그 유형만 강조되고 나머지는 흐려진다.
// (서버에서 렌더한 본문을 children으로 받아 data-filter 속성만 바꾼다)
export function FilterRoot({
  counts,
  name,
  children,
}: {
  counts: Record<EntType, number>;
  name: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<EntType | null>(null);
  const types = ENT_ORDER.filter((t) => counts[t] > 0);

  return (
    <div className={styles.filterable} data-filter={active ?? undefined}>
      <div className={styles.legend}>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-2.5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-3">
          <nav aria-label="문서" className="flex shrink-0 items-baseline gap-4 whitespace-nowrap text-[13px]">
            <span className="font-semibold text-[var(--fg)]">{name}</span>
            <a href="#c-doc1" className="text-[var(--fg2)] hover:text-[var(--fg)]">
              doc_01 소개
            </a>
            <a href="#c-doc2" className="text-[var(--fg2)] hover:text-[var(--fg)]">
              doc_02 프로젝트
            </a>
          </nav>
          <div
            role="group"
            aria-label="개체 유형으로 강조하기"
            className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 lg:justify-end"
          >
            {types.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={active === t}
                onClick={() => setActive((a) => (a === t ? null : t))}
                title={ENT_INFO[t].ko}
                className={`${styles.chip} shrink-0`}
                style={{ "--c": ENT_INFO[t].color } as React.CSSProperties}
              >
                <span aria-hidden="true" className={styles.swatch} />
                <span>{t}</span>
                <span className="hidden font-normal sm:inline lg:hidden 2xl:inline">
                  {ENT_INFO[t].ko}
                </span>
                <span className={styles.count}>{counts[t]}</span>
              </button>
            ))}
            {active && (
              <button
                type="button"
                onClick={() => setActive(null)}
                className="ml-1 h-[30px] shrink-0 whitespace-nowrap px-2 text-[12.5px] text-[var(--fg2)] underline underline-offset-4 hover:text-[var(--fg)]"
              >
                전체 보기
              </button>
            )}
          </div>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {active ? `${ENT_INFO[active].ko}(${active}) ${counts[active]}개 강조` : "전체 표시"}
      </p>
      {children}
    </div>
  );
}
