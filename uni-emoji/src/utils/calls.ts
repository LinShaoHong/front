//延迟执行
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));