const Joi = require("@hapi/joi");

const MAX_PAGE_SIZE = 100;

const idParamSchema = Joi
    .string()
    .min(1)
    .max(100)
    .pattern(/^[A-Za-z0-9\-]*$/)
    .required();

const idParamSearchSchema = Joi
    .string()
    .min(1)
    .max(100)
    .pattern(/^[A-Za-z0-9\-]*\*?$/)
    .required();

const decryptionKeyParamSchema = Joi.string().min(1).max(100).required();

const skipParamSchema = Joi
    .number()
    .integer()
    .min(0)
    .default(0);

const limitParamSchema = Joi
    .number()
    .integer()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(MAX_PAGE_SIZE);

module.exports = {

    decryptionKeyParamSchema,

    idparamSchema,

    idParamSearchSchema,

    skipParamSchema,

    limitParamSchema,

    vaultGetByIdSchema: Joi.object({
        id: idParamSearchSchema
    }),

    vaultQueryParamsSchema: Joi.object({
        decryption_key: decryptionKeyParamSchema,
        skip: skipParamSchema,
        limit: limitParamSchema
    })

};
