import express, { Request, Response } from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req: Request, res: Response) => {
    res.status(200).send({
        message: 'Hello this API from Backend Express File Upload' 
    })
})

routes(app)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})