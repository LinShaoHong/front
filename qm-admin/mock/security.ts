import { Response, Request, NextFunction } from 'express'

export const accessTokenAuth = (req: any, res: any, next: any) => {
  const accessToken = req.header('X-Access-Token')
  if (!accessToken) {
    return res.status(401).json({
      code: 50001,
      messaege: 'Invalid Access Token'
    })
  }
  next()
}
