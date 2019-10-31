const Joi = require("@hapi/joi");

module.exports = {

    vaultGetByIdSchema: Joi.object({
        id: Joi
            .string()
            .min(5)
            .max(100)
            .pattern(/^[A-Za-z0-9\-]*\*?$/)
            .required()
    })

};
