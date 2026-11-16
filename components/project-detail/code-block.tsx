import { codeToHtml } from "shiki";

// Server Component — shiki로 빌드 타임에 HTML 생성.
// 밝은 모드 github-light / 어두운 모드 github-dark (globals.css의 .dark 규칙이 전환).
// source가 있으면 캡션에 커밋 고정 링크를 단다.
// kind "원본" = 예시가 그 파일에서 그대로 발췌됨 / "관련 파일" = 요약·예전 버전이라 파일과 글자가 다름
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
  const html = await codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });

  return (
    <figure className="overflow-hidden rounded-md border border-border">
      {(filename || source) && (
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border bg-secondary px-4 py-2 text-[13px] text-muted-foreground">
          {filename && <span className="font-mono">{filename}</span>}
          {source && (
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-num text-[12.5px] text-primary underline underline-offset-[3px] hover:no-underline"
            >
              {source.kind ?? "원본"} {source.label} ↗
            </a>
          )}
        </figcaption>
      )}
      <div
        className="code-block text-[13.5px] [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:font-mono [&_pre]:leading-[1.6]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
