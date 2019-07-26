export interface ListResp {
  code: number
  message: string
  values: []
}

export interface SingleResp {
  code: number
  message: string
  value: any
}

export interface PageResp {
  code: number
  message: string
  total: number
  values: []
}

export interface CountResp {
  code: number
  message: string
  count: number
}
