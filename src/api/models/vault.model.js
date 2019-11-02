const mongoose = require("mongoose");
const validation = require("../validations/vault.validation");
const Joi = require("@hapi/joi");
const {MAX_DOCUMENT_SIZE} = require("./constants");
const {ValidationError} = require("@hapi/joi/lib/errors");
const {encrypt} = require("../services/crypt");
const {redactString, logMsg} = require("../../utils/log_utils");
const {decrypt} = require("../services/crypt");

// TODO: add integration tests

const vaultItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    value: {
        iv: {
            type: Buffer,
            required: true
        },
        encrypted: {
            type: Buffer,
            required: true
        }
    }
});

vaultItemSchema.statics = {

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

        console.log(logMsg(`Vault.getById()`, {
            id,
            decryptionKey: redactString(decryptionKey),
            limit, skip
        }));

        // Make sure the id is either a proper single id or a pattern like "prefix*"
        const _id = Joi.attempt(id, validation.idParamSearchSchema);

        // other validations
        const _decryptionKey = Joi.attempt(decryptionKey, validation.encryptionKeyParamSchema);
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
                    const decrypted = decrypt(v.value, _decryptionKey);
                    res.push({
                        id: v._id,
                        value: JSON.parse(decrypted)
                    });
                } catch (err) {
                    if (err.message.indexOf("Invalid IV length" > 0) ||
                        err.message.indexOf("bad decrypt") > 0) {
                        console.error(`BAD DECRYPT:  ${err.message}`);
                    } else {
                        throw new err;
                    }
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
     * @param encryptionKey
     * @param value {Object}
     */
    async storeById(id, encryptionKey, value) {

        const objBuffer = Buffer.from(JSON.stringify(value));

        console.log(logMsg(`Vault.storeById()`, {
            id,
            encryptionKey: redactString(encryptionKey),
            value: `JSON(${objBuffer.length} bytes)`
        }));

        // validations
        const _id = Joi.attempt(id, validation.idParamSchema);
        const _encryptionKey = Joi.attempt(encryptionKey, validation.encryptionKeyParamSchema);

        // Encrypt the value
        const encryptedValue = encrypt(objBuffer, _encryptionKey);

        console.log(encryptedValue.encrypted.length);

        if (encryptedValue.encrypted.length > MAX_DOCUMENT_SIZE) {
            throw new ValidationError("ValidatioError", [{
                message: `Encrypted document is bigger than max ` +
                    `size allowed (${MAX_DOCUMENT_SIZE} bytes)`
            }]);
        }

        // Upsert the item with key _id
        const vaultItem = await this
            .findOne({_id})
            .exec();

        let res;
        if (vaultItem === null) {
            res = await this.create({
                _id,
                value: encryptedValue
            });
        } else {
            vaultItem.value = encryptedValue;
            res = await vaultItem.save();
        }

        if (!res) {
            throw new Error(`Can't save document _id=${_id}`);
        } else {
            return {
                saved: true
            };
        }

    }

};

/**
 * @typedef VaultItem
 */
module.exports = mongoose.model("VaultItem", vaultItemSchema);
