const mongoose = require("mongoose");
const APIError = require("../../utils/APIError");
const httpStatus = require("http-status");


const vaultSchema = new mongoose.Schema({
    externalId: String,
    value: String
});

vaultSchema.statics = {

    /**
     * Get Item by ObjectId
     *
     */
    async getByExternalId(externalId) {
        try {
            let vaultItem;

            // Query mongodb
            vaultItem = await this.find({externalId}).exec();
            if (vaultItem) {
                return vaultItem;
            } else {
                throw new APIError({
                    message: "Item not exists",
                    status: httpStatus.NOT_FOUND
                });
            }
        } catch (error) {
            throw error;
        }
    }

};


/**
 * @typedef Vault
 */
module.exports = mongoose.model("Vault", vaultSchema);
