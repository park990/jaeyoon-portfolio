import { isValidElement } from "react";

// 사례 본문 한 덩어리(React 요소 트리)가 기대는 근거 id를 모은다 — 여백 주석용.
// - <Ev ids> · <Graded ev> 요소의 props
// - 데이터 객체 속 ev 키 (string[] 또는 { problem: [...], ... })
// - 내부 데이터로 근거를 그리는 서버 컴포넌트는 registerEv로 등록 (예: 담당 모듈 표)
// 클라이언트 컴포넌트 참조에는 속성을 읽지 않는다(서버에서 읽으면 오류). Map 조회만 한다.

const REGISTRY = new Map<unknown, readonly string[]>();

export function registerEv(type: unknown, ids: readonly string[]) {
  REGISTRY.set(type, ids);
}

function addAll(v: unknown, out: string[]) {
  if (Array.isArray(v)) {
    for (const x of v) if (typeof x === "string") out.push(x);
  } else if (v && typeof v === "object") {
    for (const x of Object.values(v)) addAll(x, out);
  }
}

function walk(node: unknown, out: string[], depth: number) {
  if (depth > 40 || node == null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const n of node) walk(n, out, depth + 1);
    return;
  }
  if (isValidElement(node)) {
    const reg = REGISTRY.get(node.type);
    if (reg) out.push(...reg);
    walk(node.props, out, depth + 1);
    return;
  }
  if (Object.getPrototypeOf(node) !== Object.prototype) return;
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (k === "ev" || k === "ids") addAll(v, out);
    else walk(v, out, depth + 1);
  }
}

export function collectEv(node: unknown): string[] {
  const out: string[] = [];
  walk(node, out, 0);
  return [...new Set(out)];
}
