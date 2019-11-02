const Vault = require("../models/vault.model");

// TODO: add integration tests

/**
 * Item retrieve controller
 *
 * @public
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
async function retrieve(req, res, next) {
    try {
        const vaultItem = await Vault.getById(
            req.params.id,
            req.query.decryption_key,
            req.query.limit,
            req.query.skip
        );
        res.json(vaultItem);
    } catch (error) {
        next(error);
    }
}

/**
 * Item store controller
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
async function store(req, res, next) {
    try {
        const result = await Vault.storeById(
            req.params.id,
            req.query.encryption_key,
            req.body
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {retrieve, store};
