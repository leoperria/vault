const express = require("express");
const Joi = require("@hapi/joi");
const controller = require("../../controllers/vault.controller");
const {} = require("../../validations/vault.validation");
const {
    encryptionKeyParamSchema,
    limitParamSchema,
    skipParamSchema,
    idParamSchema,
    idParamSearchSchema
} = require("../../validations/vault.validation");
const validator = require("express-joi-validation").createValidator({passError: true});

const router = express.Router();

router
    .route("/:id")
    .put(
        validator.params(Joi.object({id: idParamSchema})),
        validator.query(Joi.object({
            encryption_key: encryptionKeyParamSchema,
            skip: skipParamSchema,
            limit: limitParamSchema
        })),
        controller.store
    )
    .get(
        validator.params(Joi.object({id: idParamSearchSchema})),
        validator.query(Joi.object({
            decryption_key: encryptionKeyParamSchema,
        })),
        controller.retrieve
    );

module.exports = router;
