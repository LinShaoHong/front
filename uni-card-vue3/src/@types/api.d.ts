declare namespace Http {
  type Response<T> = Promise<{
    code: string
    message: string,
    value: T
    values: [T]
    total: number
  }>
}