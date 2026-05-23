export function Footer() {
  // social 링크는 Contact 섹션으로 이동. footer는 정말 카피라이트 한 줄만.
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-6">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Jaeyoon Park · Built with Next.js +
          Tailwind + Claude Code
        </p>
      </div>
    </footer>
  );
}
