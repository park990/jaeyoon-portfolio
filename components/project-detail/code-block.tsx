import { codeToHtml, type ThemeRegistration } from "shiki";

// Server Component — shiki로 빌드 타임에 HTML 생성.
// 단색 테마: 먹(#000) 글자 + 주석만 주석색(#5E6368), 바탕 #F5F6F7. (언어별 주석은 shiki 문법이 판별)
// source가 있으면 캡션에 커밋 고정 링크를 단다.
// kind "원본" = 예시가 그 파일에서 그대로 발췌됨 / "관련 파일" = 요약·예전 버전이라 파일과 글자가 다름
const MONO_INK: ThemeRegistration = {
  name: "mono-ink",
  type: "light",
  colors: { "editor.background": "#F5F6F7", "editor.foreground": "#000000" },
  tokenColors: [
    { settings: { foreground: "#000000", background: "#F5F6F7" } },
    {
      scope: ["comment", "punctuation.definition.comment", "string.quoted.docstring"],
      settings: { foreground: "#5E6368" },
    },
  ],
};

export async function CodeBlock({
  code,
  lang,
  filename,
  source,
}: {
  code: string;
  lang: string;
  filename?: string;
  source?: { label: string; href: string; kind?: "원본" | "관련 파일" };
}) {
  const html = await codeToHtml(code, { lang, theme: MONO_INK });

  return (
    <figure className="min-w-0">
      {(filename || source) && (
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 pb-1.5 text-[13px] leading-[1.6] text-note">
          {filename && <span className="font-mono">{filename}</span>}
          {source && (
            <a href={source.href} target="_blank" rel="noopener noreferrer" className="hit">
              {source.kind ?? "원본"} <span className="font-mono">{source.label}</span>
            </a>
          )}
        </figcaption>
      )}
      <div className="code-block" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
