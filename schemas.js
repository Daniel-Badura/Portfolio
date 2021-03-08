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

