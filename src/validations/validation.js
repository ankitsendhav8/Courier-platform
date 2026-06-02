const Joi = require('joi');

const createOrderSchema = Joi.object({
    courier_partner: Joi.string()
        .valid('urbanebolt', 'mockcourier')
        .required(),

    // customer_name: Joi.string()
    //     .required(),

    // mobile: Joi.string()
    //     .required(),

    // address: Joi.string()
    //     .required()
});

const bulkOrderSchema = Joi.object({
    orders: Joi.array()
        .max(100)
        .required()
});

module.exports = { createOrderSchema, bulkOrderSchema };