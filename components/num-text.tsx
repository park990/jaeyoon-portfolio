// 문자열 안의 숫자 덩어리만 IBM Plex Mono(tabular-nums)로 감싼다.
// 한글·공백·화살표는 본문 서체(Pretendard)로 둬서 고정폭 공백 때문에 벌어지지 않게 한다.
const NUM = /([~±]?\d[\d,./:%·]*(?:pt)?)/g;

export function NumText({ text }: { text: string }) {
  const parts = text.split(NUM);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-num">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
