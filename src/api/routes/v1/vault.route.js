const express = require("express");
const controller = require("../../controllers/vault.controller");
const validator = require('express-joi-validation').createValidator({passError: true});
const {
    vaultGetByIdSchema
} = require("../../validations/vault.validation");

const router = express.Router();

router
    .route("/:id")
    .get(validator.params(vaultGetByIdSchema), controller.retrieve)
    .post(controller.store)

module.exports = router;
