const Vault = require("../models/vault.model");

/**
 * Retrieve vault item controller
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
        console.log(req.params);
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

/*
exports.store = async (req, res) => {
// TODO: handle max size of the value document
};
*/


module.exports = {retrieve};
