import { Request, Response, Router } from 'express'
import response from '../helpers/response'
import m$user from '../modules/auth.module'

export const AuthController = Router()


/**
 * Login
 * @param {string} email
 * @param {string} password
 */
AuthController.post('/login', async (req: Request, res: Response) => {
    const login = await m$user.login(req.body)

    response.sendResponse(res, login)
})

/**
 * Register
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */
AuthController.post('/register', async (req: Request, res: Response) => {
    const register = await m$user.register(req.body)

    response.sendResponse(res, register)
})