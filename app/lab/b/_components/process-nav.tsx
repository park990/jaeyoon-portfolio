"use client";

import { useEffect, useState } from "react";
import { PROC_META, PROC_ORDER, ProcSymbol, type ProcKind } from "./symbols";
import styles from "../b.module.css";

// 내비게이션 = 공정선. 각 공정 기호가 해당 구역으로 가는 링크.
// 현재 위치: 공정표 카드(#b-card)가 화면 중앙선을 지나면 "처리"가 켜지고,
// 첫 화면 개요의 각 공정 칸이 중앙선을 지나면 그 공정이 켜진다(모바일 세로 배치에서 유효).
export function ProcessNav() {
  const [active, setActive] = useState<ProcKind | null>(null);

  useEffect(() => {
    const targets: [string, ProcKind][] = [
      ["b-in", "storage"],
      ["b-op", "operation"],
      ["b-qc", "inspection"],
      ["b-out", "transport"],
      ["b-card", "operation"],
    ];
    const map = new Map<Element, ProcKind>();
    for (const [id, kind] of targets) {
      const el = document.getElementById(id);
      if (el) map.set(el, kind);
    }
    // 중앙선에 걸린 요소 집합. 데스크톱에서는 개요 4칸이 가로로 나란해 동시에 걸리므로
    // 둘 이상 걸리면 "현재 위치 없음"으로 둔다. 카드가 걸리면 언제나 "처리".
    const hit = new Set<Element>();
    const card = document.getElementById("b-card");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) hit.add(e.target);
          else hit.delete(e.target);
        }
        if (card && hit.has(card)) setActive("operation");
        else if (hit.size === 1) setActive(map.get([...hit][0]) ?? null);
        else setActive(null);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    map.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="공정 흐름 내비게이션" className={styles.nav}>
      <ol className={styles.navTrack}>
        {PROC_ORDER.map((kind, i) => {
          const m = PROC_META[kind];
          const on = active === kind;
          return (
            <li key={kind} className={styles.navStation} data-on={on || undefined}>
              <a
                href={`#${kind === "operation" ? "b-card" : m.id}`}
                aria-current={on ? "location" : undefined}
                className={styles.navLink}
              >
                <ProcSymbol kind={kind} size={18} filled={on} className={styles.navSymbol} />
                <span className={styles.navNo}>{m.no}</span>
                <span className={styles.navName}>{m.name}</span>
              </a>
              {i < PROC_ORDER.length - 1 && <span aria-hidden="true" className={styles.navLine} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
