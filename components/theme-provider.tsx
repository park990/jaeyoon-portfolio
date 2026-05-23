"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes의 ThemeProvider를 client 경계로 감싸는 래퍼.
// 서버 컴포넌트인 layout.tsx에서 직접 import할 수 없으니 분리.
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
