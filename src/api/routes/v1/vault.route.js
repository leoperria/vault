const express = require("express");
const controller = require("../../controllers/vault.controller");

const router = express.Router();

router
    .route("/")
    .post(controller.store)
    .get(controller.retrieve)

module.exports = router;
