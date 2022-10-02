import joi from "joi";

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
    birthday: joi.date().iso().required()
})

export {
    gamesSchema,
    customerSchema,
}