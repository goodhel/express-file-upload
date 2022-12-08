/* eslint-disable no-unused-vars */
interface PayloadUser {
    id: number,
    name: string,
    email: string
}

declare namespace Express {
    interface Request {
        user: PayloadUser
    }
}
