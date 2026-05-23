import { codeToHtml } from "shiki";

// Server Component — shiki로 빌드 타임에 HTML 생성.
// highlighter 코드는 클라이언트 번들에 들어가지 않음.
export async function CodeBlock({
  code,
  lang,
  filename,
}: {
  code: string;
  lang: string;
  filename?: string;
}) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-[#0d1117]">
      {filename && (
        <figcaption className="border-b border-border/60 bg-background/40 px-4 py-2 font-mono text-xs text-muted-foreground">
          {filename}
        </figcaption>
      )}
      <div
        className="text-sm [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:leading-[1.6]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
