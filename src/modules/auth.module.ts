import Joi from 'joi'
import bcrypt from 'bcrypt'
import prisma from '../helpers/database'
import jwt from 'jsonwebtoken'

interface RegisterType {
    name: string
    email: string
    password: string
}

interface LoginType {
    email: string
    password: string
}

class _auth {
    register = async (body: RegisterType) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().trim().lowercase().email().required(),
                password: Joi.string().required()
            }).options({ abortEarly: false })

            const validation = schema.validate(body, { convert: false })

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
                }
            }

            const add = await prisma.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: bcrypt.hashSync(body.password, 10)
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            })

            return {
                status: true,
                data: add
            }
        } catch (error) {
            console.error('register auth module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }

    login = async (body: LoginType) => {
        try {
            const schema = Joi.object({
                email: Joi.string().email().trim().lowercase().email().required(),
                password: Joi.string().required()
            }).options({ abortEarly: false })

            const validation = schema.validate(body, { convert: false })

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
                }
            }

            const checkUser = await prisma.user.findFirst({
                where: {
                    email: body.email
                }
            })

            if (!checkUser) {
                return {
                    status: false,
                    code: 404,
                    error: 'Sorry, user not found'
                }
            }

            const checkPassword = bcrypt.compareSync(body.password, checkUser.password)

            if (!checkPassword) {
                return {
                    status: false,
                    code: 401,
                    error: 'Sorry, wrong password'
                }
            }

            // const expiredAt = dayjs(new Date(Date.now() + 3600)).format()

            const payload = {
                id: checkUser.id,
                name: checkUser.name,
                email: checkUser.email
            }

            const token = jwt.sign(payload, 'secret-code-express', { expiresIn: '1h' })

            return {
                status: true,
                data: {
                    token
                }
            }            
        } catch (error) {
            console.error('login auth module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }
}

export default new _auth()