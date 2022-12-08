import { NextFunction, Request, Response } from 'express'

interface Data {
    status: boolean
    data?: any
    error?: any
    code?: number
}

class _response {
  sendResponse = (res: Response, data: Data) => {
    try {
      if (data.code) {
        res.status(data.code)

        delete data.code

        res.send(data)
        return true
      }

      res.status(data && data.status ? 200 : 400)
      res.send(data)
      return true
    } catch (error) {
      console.error('sendResponse error: ', error)

      res.status(400).send({
        status: false,
        error
      })

      return false
    }
  }

  errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    // if (typeof (err) === 'string') {
    //     // custom application error
    //     return res.status(400).json({ data: err });
    // }

    // if (err.name === 'ValidationError') {
    //     // mongoose validation error
    //     return res.status(400).json({ data: err.message });
    // }

    if (err.code === 'permission_denied') {
      return res.status(403).send('Forbidden')
    }

    if (err.name === 'UnauthorizedError') {
      // jwt authentication error
      return res.status(401).json({ status: false, error: 'Invalid Token' })
    }

    if (err.name === 'AuthenticationError') {
      // jwt authentication error
      return res.status(401).json({ status: false, error: 'Invalid Token' })
    }

    // default to 500 server error
    return res.status(500).json({ status: false, error: err.message })
  }
}

export default new _response()
