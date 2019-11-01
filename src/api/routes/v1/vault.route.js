const express = require("express")
const controller = require("../../controllers/vault.controller")
const {vaultQueryParamsSchema} = require("../../validations/vault.validation");
const validator = require("express-joi-validation").createValidator({passError: true})
const {vaultGetByIdSchema} = require("../../validations/vault.validation")

const router = express.Router()

router
    .route("/:id")
    .get(
        validator.params(vaultGetByIdSchema),
        validator.query(vaultQueryParamsSchema),
        controller.retrieve
    );

module.exports = router;
