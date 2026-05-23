import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn 표준 헬퍼: clsx로 조건부 클래스 처리 + twMerge로 충돌 해결
// 예: cn("p-2", isActive && "bg-sky-500", "p-4") -> "bg-sky-500 p-4"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
