const mongoose = require("mongoose");
const validation = require("../validations/vault.validation");
const Joi = require("@hapi/joi");
const {decrypt} = require("../services/crypt");

const vaultSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

vaultSchema.statics = {

    // TODO: add id index for fast retrieval and sorting

    /**
     * Get Item by id and decrypt it
     *
     * Suppors externaId in the form of a wildcard matcher i.e. "key-*"
     *
     * @param id
     * @param decryptionKey
     * @param limit
     * @param skip
     */
    async getById(id, decryptionKey, limit, skip) {

        // Make sure the id is either a proper single id or a pattern like "prefix*"
        const _id = Joi.attempt(id, validation.idParamSearchSchema);

        // other validations
        const _decryptionKey = Joi.attempt(decryptionKey, validation.decryptionKeyParamSchema);
        const _limit = Joi.attempt(limit, validation.limitParamSchema);
        const _skip = Joi.attempt(skip, validation.skipParamSchema);

        let selector;
        if (_id.indexOf("*") >= 0) {
            const prefix = _id.replace(/\*/g, "");
            selector = {_id: {$regex: `^${prefix}`}};
        } else {
            selector = {_id: _id};
        }

        const vaultItems = await this
            .find(selector)
            .sort({"_id": "asc"})
            .limit(_limit)
            .skip(_skip)
            .exec();

        const res = [];
        for (const v of vaultItems) {

            if (v.value) {
                try {
                    v.value = decrypt(v.value, _decryptionKey);
                    res.push({
                        id: v._id,
                        value: JSON.parse(v.value)
                    });
                } catch (err) {
                    console.log(err);
                    console.log("BAD DECRYPT!");
                }
            } else {
                throw new Error(`Can't find value in stored item _id=${v._id}`);
            }
        }

        return res;

    },

    /**
     * Encrypt and store an item
     *
     * @param id
     * @param encryption_key
     * @param value
     * @returns {Promise<void>}
     */
    async storeById(id, encryption_key, value) {

        // validations
        const _id = Joi.attempt(id, validation.idparamSchema);
        const _encryption_key = Joi.attempt(encryption_key, validation.decryptionKeyParamSchema);

        console.log("_id", _id);
        console.log("_encryption_key", _encryption_key);
        console.log(JSON.stringify(value));
    }

};


/**
 * @typedef Vault
 */
module.exports = mongoose.model("Vault", vaultSchema);
