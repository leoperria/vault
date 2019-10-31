const Vault = require("../models/vault.model");


exports.retrieve = async (req, res, next) => {
    try {
        const vaultItem = await Vault.getByExternalId(req.params.id);
        res.json(vaultItem);
    } catch (error) {
        next(error);
    }
}


exports.store = async (req, res) => {
}
