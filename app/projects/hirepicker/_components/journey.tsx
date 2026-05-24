"use client";

// HighWay Guide → HirePicker → Booming 발전 라인 4개를 한 장에 비교하는 표.
// 중간점인 HirePicker 페이지에 두는 게 narrative상 가장 자연스러움.

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

type Row = {
  axis: string;
  highway: string;
  hire: string;
  booming: string;
};

const rows: Row[] = [
  {
    axis: "인증",
    highway: "BCrypt + HttpSession",
    hire: "JWT (Refresh=DB, Access=Redis)",
    booming: "토큰 전부 Redis + flutter_secure_storage",
  },
  {
    axis: "MVC / 분리",
    highway: "Action 한 곳에서 JSP + JSON",
    hire: "Next.js + Spring REST 분리",
    booming: "Spring REST + Flutter (모바일)",
  },
  {
    axis: "다대다 관계",
    highway: "휴게소-사용자 BookMark (첫 시도)",
    hire: "공고-사용자 즐겨찾기 (정확하게)",
    booming: "—",
  },
  {
    axis: "WebSocket",
    highway: "—",
    hire: "STOMP + Redis Pub/Sub (과한 설계 회고)",
    booming: "SimpleBroker + JWT ChannelInterceptor",
  },
  {
    axis: "메시지 영속",
    highway: "—",
    hire: "MySQL — 관계형 ChatMessage 테이블",
    booming: "MongoDB — 문서 기반 (대화 단위 schemaless)",
  },
  {
    axis: "프로젝트 가정 / 동시성",
    highway: "학습용 — 좋아요 토글 (카운트 표시 X)",
    hire: "학습용 — 즐겨찾기 토글 (카운트 표시 X)",
    booming: "배포 목표 — 좋아요 카운트 + 회원가입 동시 등록 → 동시성 제어",
  },
];

export function EngineeringJourney() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="flex flex-col gap-4"
    >
      <motion.p variants={item} className="text-sm leading-[1.8] text-muted-foreground">
        풀스택 3개 프로젝트의 발전 라인. HirePicker는{" "}
        <span className="font-medium text-[var(--accent)]">중간점</span>으로,
        HighWay Guide의 한계를 받아 도입한 결정들과 그 한계를 다시 다음 프로젝트
        Booming에 넘긴 결정들이 한 표에 보입니다.
      </motion.p>

      <motion.div
        variants={item}
        className="overflow-x-auto rounded-xl border border-border bg-card"
      >
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background/40 text-left">
            <tr>
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Axis
              </th>
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                HighWay Guide
              </th>
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                HirePicker
              </th>
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Booming
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.axis}
                className={i < rows.length - 1 ? "border-b border-border/60" : ""}
              >
                <td className="px-3 py-2.5 font-medium text-foreground">{r.axis}</td>
                <td className="px-3 py-2.5 text-foreground/70">{r.highway}</td>
                <td className="bg-[var(--accent)]/5 px-3 py-2.5 font-medium text-foreground">
                  {r.hire}
                </td>
                <td className="px-3 py-2.5 text-foreground/70">{r.booming}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
