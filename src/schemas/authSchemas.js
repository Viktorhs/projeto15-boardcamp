import basejoi from "joi";
import JoiDate from '@joi/date';

const joi = basejoi.extend(JoiDate);

const gamesSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string(),
    stockTotal: joi.number().min(1).required(),
    categoryId: joi.required(),
    pricePerDay: joi.number().min(1).required(),
})

const customerSchema = joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().min(11).max(11).required(),
    birthday: joi.date().format('YYYY-MM-DD').required()
})

const rentalsSchema = joi.object({
    customerId: joi.required(),
    gameId: joi.required(),
    daysRented: joi.number().min(1).required()
})

export {
    gamesSchema,
    customerSchema,
    rentalsSchema
}