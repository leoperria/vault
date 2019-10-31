const express = require("express");
const vaultRoutes = require("./vault.route");

const router = express.Router();

/**
 * GET v1/status
 *
 * Useful for Load balancer's health check
 */
router.get("/status", (req, res) => res.send("OK"));

router.use("/vault", vaultRoutes);

module.exports = router;
