import prisma from "../helpers/database"
import Joi from 'joi'
import { Prisma } from "@prisma/client"

class _workingOrder {
    addWorkingOrder = async (body: Prisma.WorkOrderCreateManyInput[]) => {
        try {
            const schema = Joi.array().items(
                Joi.object({
                    no_work_order: Joi.string(),
                    part_number: Joi.string(),
                    part_name: Joi.string(),
                    quantity: Joi.number(),
                    total_order: Joi.number(),
                    total_box: Joi.number(),
                    file_id: Joi.number(),
                })
            ).options({ abortEarly: false })

            const validation = schema.validate(body, { convert: false })

            if (validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
                }
            }

            const add = await prisma.workOrder.createMany({
                data: body
            })

            return {
                status: true,
                data: add
            }
        } catch (error) {
            console.error('addWorkingOrder working order module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }
}

export default new _workingOrder()
