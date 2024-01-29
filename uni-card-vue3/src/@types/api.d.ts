declare namespace Http {
  type Response<T> = Promise<{
    code: Number,
    message: String
    data: T
  }>
}