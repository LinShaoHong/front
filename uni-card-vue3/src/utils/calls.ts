//延迟执行
export function delay(callback: () => void, mills: number): void {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    callback();
  }, mills);
}