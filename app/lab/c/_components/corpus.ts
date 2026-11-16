// C안 「주석 코퍼스」 데이터 — 문장을 (평문 | 개체) 조각으로 쪼개 두면
// 렌더링·개수 집계·필터를 같은 데이터에서 계산할 수 있다.
import { CURRENT_WORK, PROFILE, SV_PROJECT } from "../../_data";

export type EntType =
  | "PER"
  | "ROLE"
  | "ORG"
  | "DATE"
  | "METRIC"
  | "PROJECT"
  | "AWARD"
  | "TECH";

export const ENT_ORDER: EntType[] = [
  "PER",
  "ROLE",
  "ORG",
  "PROJECT",
  "TECH",
  "METRIC",
  "AWARD",
  "DATE",
];

export const ENT_INFO: Record<EntType, { ko: string; color: string }> = {
  PER: { ko: "사람", color: "#e9dfc4" },
  ROLE: { ko: "직무", color: "#c6a6f2" },
  ORG: { ko: "기관", color: "#7fb4ea" },
  PROJECT: { ko: "프로젝트", color: "#73d3a3" },
  TECH: { ko: "기술", color: "#68cfdb" },
  METRIC: { ko: "수치", color: "#f3c24f" },
  AWARD: { ko: "수상·선발", color: "#f69b8a" },
  DATE: { ko: "날짜", color: "#aab3a4" },
};

export type Seg = string | { t: EntType; s: string };
export type Sentence = Seg[];

const e = (t: EntType, s: string) => ({ t, s });

// doc_01 · 소개 — 브리프 「사실」과 기존 사이트 문구에서만 구성. 최신 경력부터.
export const INTRO: Sentence[] = [
  [
    e("PER", PROFILE.nameKo),
    "은 텍스트에서 수치 주장과 관계를 뽑아내고, 뽑은 값이 맞는지까지 확인하는 ",
    e("ROLE", "AI · NLP 엔지니어"),
    "입니다.",
  ],
  [
    "지금은 ",
    e("PROJECT", CURRENT_WORK.name),
    "를 혼자 만들고 있고, ",
    e("DATE", "2026.10"),
    " 창업 오디션에서 ",
    e("METRIC", CURRENT_WORK.auditionRatio),
    " 경쟁률로 ",
    e("AWARD", "선발"),
    "됐습니다.",
  ],
  [
    "그 전에는 ",
    e("ORG", "샤이닝라이언"),
    "에서 ",
    e("ROLE", "AI 엔지니어 인턴"),
    "으로 부동산 공공데이터 수집·전처리 파이프라인과 모델 학습을 맡았습니다.",
  ],
  [
    e("ORG", "멋쟁이사자처럼"),
    " NLP 과정에서는 기사 속 수치 주장을 ",
    e("ORG", "KOSIS"),
    " 공식 통계와 대조하는 ",
    e("TECH", "LLM"),
    " 파이프라인 ",
    e("PROJECT", "StructVerify-Lab"),
    "을 팀으로 만들어 ",
    e("AWARD", "최우수상"),
    "을 받았습니다.",
  ],
];

// doc_02 · StructVerify-Lab 원문 — 기존 프로젝트 본문 수치만 사용
export const SV_SOURCE: Sentence[] = [
  [
    "기사 속 수치 주장을 ",
    e("ORG", "KOSIS"),
    " 공식 통계와 비교해 진위를 판정하는 ",
    e("TECH", "LLM"),
    " 플랫폼.",
  ],
  [
    "통계 카탈로그 ",
    e("METRIC", "262,783건"),
    "을 ",
    e("TECH", "pgvector"),
    "에 적재했고, claim ",
    e("METRIC", "8건"),
    " 직렬 ",
    e("METRIC", "~7분"),
    "이던 검증을 병렬화로 ",
    e("METRIC", "~1/3"),
    "로 줄였으며, 표 매칭 필터 ",
    e("METRIC", "4종"),
    "으로 오매칭을 막았습니다.",
  ],
];

export type Arg = { s: string; t?: EntType };
export type Triple = { h: Arg; r: string; tl: Arg };

export const SV_TRIPLES: Triple[] = [
  {
    h: { s: SV_PROJECT.title, t: "PROJECT" },
    r: "검증 대상",
    tl: { s: "기사 속 수치 주장" },
  },
  {
    h: { s: SV_PROJECT.title, t: "PROJECT" },
    r: "대조 출처",
    tl: { s: "KOSIS 공식 통계", t: "ORG" },
  },
  {
    h: { s: "통계 카탈로그" },
    r: "적재 규모",
    tl: { s: "262,783건", t: "METRIC" },
  },
  {
    h: { s: "claim 검증" },
    r: "병렬화",
    tl: { s: "asyncio.gather + Semaphore(3)", t: "TECH" },
  },
  {
    h: { s: "claim 8건 처리" },
    r: "소요 시간",
    tl: { s: "직렬 ~7분 → ~1/3", t: "METRIC" },
  },
  {
    h: { s: "통계표 매칭" },
    r: "차단 필터",
    tl: { s: "국제기구 · 장래추계 · 해외 지역 · 세부 대상" },
  },
  {
    h: { s: SV_PROJECT.title, t: "PROJECT" },
    r: "수상",
    tl: { s: SV_PROJECT.award, t: "AWARD" },
  },
];

export function countEntities(...docs: Sentence[][]): Record<EntType, number> {
  const out = Object.fromEntries(ENT_ORDER.map((t) => [t, 0])) as Record<EntType, number>;
  for (const doc of docs)
    for (const sent of doc)
      for (const seg of sent) if (typeof seg !== "string") out[seg.t] += 1;
  return out;
}
