import joi from "joi";

const gamesSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string(),
    stockTotal: joi.number().min(1).required(),
    categoryId: joi.required(),
    pricePerDay: joi.number().min(1).required(),
})

export {
    gamesSchema,
}