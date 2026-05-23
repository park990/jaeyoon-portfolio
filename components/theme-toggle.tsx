"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // next-themes는 마운트 전에 테마를 알 수 없음.
  // 서버에서 무엇을 그릴지 모르니 자리만 잡아두고 깜빡임 방지.
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="테마 전환"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {/* mounted 전에는 둘 다 invisible로 그려서 layout shift 방지 */}
      <Sun
        className={`h-4 w-4 transition-all ${
          mounted ? (isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0") : "scale-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all ${
          mounted ? (isDark ? "scale-100 rotate-0" : "scale-0 rotate-90") : "scale-0"
        }`}
      />
    </button>
  );
}
