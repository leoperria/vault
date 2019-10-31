const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/user.controller");
const {
    listUsers,
    createUser,
    replaceUser,
    updateUser,
} = require("../../validations/user.validation");

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param("userId", controller.load);


router
    .route("/")

    .get(validate(listUsers), controller.list)
    .post(validate(createUser), controller.create);


router
    .route("/profile")
    .get(controller.loggedIn);


router
    .route("/:userId")
    .get(controller.get)
    .put(validate(replaceUser), controller.replace)
    .patch(validate(updateUser), controller.update)
    .delete(controller.remove);


module.exports = router;
