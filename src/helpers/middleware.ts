import prisma from "./database"
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express"

interface PayloadUser {
    id: number,
    name: string,
    email: string
}

const userSession = async (req: Request, res: Response, next: NextFunction) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, 'secret-code-express') as PayloadUser

      const user = await prisma.user.findFirst({
        where: {
            id: decoded.id
        }
      })

      if (user) {
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        next()
      } else {
        res.status(401).send({ message: 'Not authorized' })
      }
    } catch (error) {
      // console.error('Middleware user not authorized Error: ', error)
      res.status(401).send({ message: 'Not authorized Error. Token Expired.' })
    }
  }

  if (!token) {
    res.status(401).send({
      message: 'Not authenticated, no token'
    })
  }
}

export default userSession