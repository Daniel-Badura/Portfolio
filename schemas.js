/*jshint esversion: 9 */
const Joi = require('joi');

module.exports.widoczkiSchema = Joi.object({
    widoczek: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    })
});

