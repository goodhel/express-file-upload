import m$uploadFile from '../modules/upload-file.module'
import { Request, Response, Router } from "express";
import multer from 'multer'
import response from '../helpers/response';
import path from 'path';
import userSession from '../helpers/middleware'
import deleteFile from '../helpers/deleteFile';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(`${__dirname}`, '/../assets/'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const originalname = file.originalname.split('.')
        const ext = originalname[originalname.length - 1]
        const filename = `${file.fieldname}-${uniqueSuffix}.${ext}`
        cb(null, filename)
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
          // upload only xlsx format
          return cb(new Error('Please upload a File Xlsx'))
        }
        cb(null, true)
    }
})

export const UploadController = Router()


/**
 * List Upload File
 */
UploadController.get('/', userSession, async (req: Request, res: Response) => {
    const list = await m$uploadFile.listUpload()

    response.sendResponse(res, list)
})

/**
 * Upload File
 */
UploadController.post('/', upload.single('file'), userSession, async (req: Request, res: Response) => {
    const uploadWO = await m$uploadFile.uploadWorkOrder({ ...req.file, id: req.user.id })

    if (!uploadWO.status && req.file) {
        // delete file when upload failed
        await deleteFile(req.file.path)
    }

    response.sendResponse(res, uploadWO)
})

/**
 * Download File Upload
 * @param {number} id
 */
UploadController.get('/download/:id', async (req: Request, res: Response) => {
    const detail = await m$uploadFile.downloadFile(Number(req.params.id))

    if (detail.status) {
        res.setHeader('Content-Disposition', 'attachment; filename=import-upload.xlsx')
        res.setHeader('Content-Type', detail?.data?.mime!)
        res.status(200)
        res.sendFile(detail?.data?.path!)
    } else {
        response.sendResponse(res, detail)
    }
})