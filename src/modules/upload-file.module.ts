import Joi from 'joi'
import prisma from '../helpers/database'
import fs from 'fs'
import ExcelJS from 'exceljs'
import m$workingOrder from '../modules/working-order.module'

class _upload_file {
    listUpload = async () => {
        try {
            const list = await prisma.fileUpload.findMany({
                select: {
                    id: true,
                    name: true,
                    created_at: true
                }
            })

            return {
                status: true,
                data: list
            }
        } catch (error) {
            console.error('listUpload upload file module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }

    uploadWorkOrder = async (body: any) => {
        try {
            const schema = Joi.object({
                fieldname: Joi.string().required(),
                originalname: Joi.string().required(),
                encoding: Joi.string().required(),
                mimetype: Joi.string().required(),
                destination: Joi.string().required(),
                filename: Joi.string().required(),
                path: Joi.string().required(),
                size: Joi.number().required(),
                id: Joi.number().required()
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

            const add = await prisma.fileUpload.create({
                data: {
                    name: body.filename,
                    path: body.path,
                    mime: body.mimetype,
                    original_name: body.originalname,
                    extension: body.originalname.split('.').pop(),
                    user_id: body.id
                }
            })

            const fileBuf = fs.readFileSync(body.path)

            const workbook = new ExcelJS.Workbook()
            const excel = await workbook.xlsx.load(fileBuf)
            const ws = excel.getWorksheet(1)

            const numberWO = ws.getColumn(2).values
            const partNumber = ws.getColumn(7).values
            const partName = ws.getColumn(8).values
            const quantity = ws.getColumn(9).values
            const totalOrder = ws.getColumn(10).values
            const totalBox = ws.getColumn(11).values

            const data: any = []

            numberWO.forEach((number, index) => {
                if (index > 1) {
                    data.push({
                        no_work_order: number,
                        part_number: partNumber[index],
                        part_name: partName[index],
                        quantity: quantity[index],
                        total_order: totalOrder[index],
                        total_box: totalBox[index],
                        file_id: add.id
                    })
                }
            })

            const addWO = await m$workingOrder.addWorkingOrder(data)

            if (!addWO.status) {
                return addWO
            }

            return {
                status: true,
                data: addWO
            }
        } catch (error) {
            console.log('uploadWorkOrder upload file module Error: ', error)
            return {
                status: false,
                error
            }
        }
    }

    downloadFile = async (id: number) => {
        try {
            const schema = Joi.number().required()

            const validation = schema.validate(id, { convert: false })

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
                }
            }

            const file = await prisma.fileUpload.findUnique({
                where: {
                    id: id
                }
            })

            if (!file) {
                return {
                    status: false,
                    code: 404,
                    error: 'File not found'
                }
            }

            return {
                status: true,
                data: file
            }
        } catch (error) {
            console.error('downloadFile upload file module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }
}

export default new _upload_file()