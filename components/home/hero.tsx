import { HOME_HERO } from "@/lib/profile";

// 첫 화면 (2단계 3-2): 역할 줄 → h1 → 보조 문단 → 검증기 예시 1줄 → 제 숫자 3줄.
// 데이터는 lib/profile.ts(HOME_HERO). 형광 = 출처가 있는 숫자, 펜 취소선 = 반박된 숫자.
function Src({ label, href }: { label: string; href?: string }) {
  if (!href) return <span className="src closed">{label}</span>;
  const external = href.startsWith("http");
  return (
    <a href={href} className="src" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
    </a>
  );
}

export function Hero() {
  const h = HOME_HERO;
  const ex = h.example;
  return (
    <section aria-labelledby="hero-title">
      <p className="hero-role">
        <b>{h.role.strong}</b> <span>{h.role.rest}</span>
      </p>
      <h1 id="hero-title" className="hero-title">
        {h.title[0]}
        <br />
        {h.title[1]}
      </h1>
      <p className="hero-intro">{h.intro}</p>

      <div className="claims">
        <div className="cols-head">
          <span>{ex.head[0]}</span>
          <span>{ex.head[1]}</span>
        </div>
        <div className="claim-row">
          <p>
            {ex.claim.before}
            <s className="struck">{ex.claim.struck}</s>
            {ex.claim.after}
          </p>
          <span className="dots" aria-hidden="true" />
          <span className="src">
            {ex.reference}, <b className="font-semibold">{ex.verdict}</b>{" "}
            <a href={ex.src.href} target="_blank" rel="noopener noreferrer" className="hit">
              {ex.src.label}
            </a>
          </span>
        </div>

        <div className="cols-head">
          <span>{h.claimsHead[0]}</span>
          <span>{h.claimsHead[1]}</span>
        </div>
        {h.claims.map((c) => (
          <div key={c.mark} className="claim-row">
            <p>
              {c.before}
              <mark>{c.mark}</mark>
              {c.after}
            </p>
            <span className="dots" aria-hidden="true" />
            <Src {...c.src} />
          </div>
        ))}
      </div>
    </section>
  );
}
