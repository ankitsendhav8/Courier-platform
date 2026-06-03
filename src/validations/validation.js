const Joi = require('joi');

// Validation schema for create order request single and bulk
const createOrderSchema = Joi.object({
    courier_partner: Joi.string().required(),
    order_id: Joi.required(),
    customerCode: Joi.string().required(),
    declaredValue: Joi.number().required(),
    itemDescription: Joi.string().required(),
    collectableValue: Joi.number().required(),
    height: Joi.number().required(),
    length: Joi.number().required(),
    pieces: Joi.number().required(),
    weight: Joi.number().required(),
    breadth: Joi.number().required(),
    serviceType: Joi.string().required(),
    payMode: Joi.string().required(),
    rtnCity: Joi.string().required(),
    rtnName: Joi.string().required(),
    consCity: Joi.string().required(),
    consName: Joi.string().required(),
    rtnEmail: Joi.string().required(),
    rtnState: Joi.string().required(),
    shprCity: Joi.string().required(),
    shprName: Joi.string().required(),
    consEmail: Joi.string().required(),
    consState: Joi.string().required(),
    rtnMobile: Joi.required(),
    shprEmail: Joi.string().required(),
    shprState: Joi.string().required(),
    consMobile: Joi.required(),
    rtnAddress: Joi.string().required(),
    rtnAddressType: Joi.string().required(),
    rtnCountry: Joi.string().required(),
    rtnPincode: Joi.required(),
    shprMobile: Joi.required(),
    consAddress: Joi.string().required(),
    consAddressType: Joi.string().required(),
    consCountry: Joi.string().required(),
    consPincode: Joi.required(),
    invoiceNumber: Joi.string().required(),
    invoiceDate: Joi.string().required(),
    shprAddress: Joi.string().required(),
    shprAddressType: Joi.string().required(),
    shprCountry: Joi.string().required(),
    shprPincode: Joi.number().required(),
    invoiceValue: Joi.number().required(),
    itemQuantity: Joi.number().required()
});

const bulkOrderSchema = Joi.object({
    orders: Joi.array()
        .max(100)
        .required()
});

module.exports = { createOrderSchema, bulkOrderSchema };