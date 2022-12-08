import { Application, Router } from "express";
import { AuthController } from "./controllers/AuthController";
import { UploadController } from "./controllers/UploadController";

const _routes: [string, Router][] = [
    ['', AuthController],
    ['upload', UploadController]
]

const routes = (app: Application) => {
    _routes.forEach(router => {
        const [path, route] = router
        app.use(`/api/${path}`, route)
    })
}

export default routes