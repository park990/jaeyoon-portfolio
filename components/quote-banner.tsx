// 메인 Projects 섹션 헤드라인 + HighWay Guide My Role 인용문 공통 컴포넌트.
// showFinal=true면 "그래서 둘을 나누어 정리했습니다." 마지막 줄 표시.

export function QuoteBanner({ showFinal = false }: { showFinal?: boolean }) {
  return (
    <blockquote className="max-w-2xl border-l-2 border-primary/40 pl-4 sm:pl-5">
      <p className="text-lg font-medium italic text-foreground sm:text-xl">
        Implementation is a means, not the point.
      </p>
      <p className="mt-2 text-base leading-[1.7] text-muted-foreground">
        AI가 단순 구현을 빠르게 대체하는 시대에, 구현 자체보다 그 안에서 얻은
        학습이 다음 프로젝트의 결정으로 이어진 사이클이 더 중요하다고
        생각합니다.
        {showFinal &&
          " 그래서 단순 구현과, 다음 프로젝트의 성장 발판이 된 학습을 나누어 정리했습니다."}
      </p>
    </blockquote>
  );
}
