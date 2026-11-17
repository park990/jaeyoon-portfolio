import { ImageResponse } from "next/og";
import { HOME_HERO } from "@/lib/profile";

// 공유 미리보기 이미지 (2.5단계 7번) — 1200×630, 흰 바탕.
// 직무 줄 → 큰 문장 두 줄(명조 700) → 주장 줄 1(형광 포함). 첫 화면과 같은 문구(lib/profile.ts).
// 글꼴: Google Fonts css2의 text= 부분 글꼴(이 이미지에 쓰는 글자만)을 빌드 때 받아 쓴다.
// 정적 생성이라 요청 시에는 다시 받지 않는다.

export const dynamic = "force-static";
export const alt = "박재윤, AI·NLP 엔지니어. 숫자를 말할 때는 출처를 같이 붙입니다.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#000000";
const NOTE = "#5E6368";
const MARK = "#FFE94A";

/** css2 API에서 부분 글꼴 주소를 찾아 받는다 (기본 요청에는 truetype을 돌려준다) */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { cache: "force-cache" })).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error(`Google Fonts 부분 글꼴을 찾지 못함: ${family} ${weight}`);
  const res = await fetch(src[1], { cache: "force-cache" });
  if (!res.ok) throw new Error(`글꼴 파일 응답 ${res.status}: ${family} ${weight}`);
  return res.arrayBuffer();
}

export default async function Image() {
  const h = HOME_HERO;
  const claim = h.claims[0];
  const roleBold = h.role.strong;
  const roleRest = h.role.rest;
  const titleText = h.title.join("");
  const claimText = claim.before + claim.mark + claim.after;

  const [sans400, sans600, serif400, serif700] = await Promise.all([
    googleFont("IBM Plex Sans KR", 400, roleRest),
    googleFont("IBM Plex Sans KR", 600, roleBold),
    googleFont("Noto Serif KR", 400, claimText),
    googleFont("Noto Serif KR", 700, titleText),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#FFFFFF",
          color: INK,
          padding: "0 76px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 30, lineHeight: 1.5 }}>
          <span style={{ fontFamily: "Sans", fontWeight: 600 }}>{roleBold}</span>
          <span style={{ fontFamily: "Sans", fontWeight: 400, color: NOTE, marginLeft: 18 }}>{roleRest}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 18,
            fontFamily: "Serif",
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1.22,
            letterSpacing: "-0.035em",
          }}
        >
          <span>{h.title[0]}</span>
          <span>{h.title[1]}</span>
        </div>
        <div style={{ display: "flex", marginTop: 52, borderTop: `2px solid ${INK}`, paddingTop: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontFamily: "Serif",
              fontWeight: 400,
              fontSize: 34,
              lineHeight: 1.5,
            }}
          >
            <span>{claim.before.trimEnd()}</span>
            <span style={{ background: MARK, padding: "0 10px", marginLeft: 9 }}>{claim.mark}</span>
            <span>{claim.after}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Sans", data: sans400, weight: 400, style: "normal" },
        { name: "Sans", data: sans600, weight: 600, style: "normal" },
        { name: "Serif", data: serif400, weight: 400, style: "normal" },
        { name: "Serif", data: serif700, weight: 700, style: "normal" },
      ],
    },
  );
}
