// 사진 첨부 TODO 표시용 컴포넌트.
// 사진을 추가하면 PhotoPlaceholder 자리를 <Image> 등으로 교체하고
// PhotoTodoBanner의 count를 줄이거나(0이 되면 컴포넌트 자체 삭제) 하면 됨.

export function PhotoTodoBanner({ count }: { count: number }) {
  return (
    <div className="mb-8 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
      <p className="font-semibold text-amber-500">
        ⚠️ 사진 첨부 {count}개 필요
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        페이지 내 점선 박스(📷)에 해당 위치 사진을 추가하세요.
      </p>
    </div>
  );
}

// 본문 안 점선 placeholder.
// aspect는 기본 video(16:9), props로 "square" 또는 임의값 가능.
export function PhotoPlaceholder({
  n,
  caption,
  aspect = "video",
}: {
  n: number;
  caption: string;
  aspect?: "video" | "square" | "portrait";
}) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "portrait"
        ? "aspect-[3/4]"
        : "aspect-video";

  return (
    <div
      className={
        "my-4 flex items-center justify-center rounded-lg border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-6 text-center " +
        aspectClass
      }
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl">📷</span>
        <p className="text-sm font-semibold text-amber-500">사진 {n}</p>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          {caption}
        </p>
      </div>
    </div>
  );
}
