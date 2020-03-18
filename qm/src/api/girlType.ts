export interface GirlResp {
  id: string
  type: string
  name: string
  city: string
  mainImage: string
  likes: number
  visits: number
}

export interface GirlDetailResp {
  id: string
  name: string
  city: string
  title: string
  price: number
  contact: string
  mainImage: string
  detailImages: string[]
  accessible: boolean
  collected: boolean
  likes: number
  visits: number
  comments: number
  collects: number
  onService: boolean
}
