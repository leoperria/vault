const crypto = require("crypto");
const logger = require("../../config/logger");
const {redactString} = require("../../utils/log_utils");

const IV_LENGTH = 16;

/**
 * Encrypt text
 *
 * @public
 *
 * NOTE: From NodeJS docs:
 * Initialization vectors should be unpredictable and unique; ideally, they will be
 * cryptographically random. They do not have to be secret: IVs are typically just
 * added to ciphertext messages unencrypted. It may sound contradictory that something
 * has to be unpredictable and unique, but does not have to be secret; it is important
 * to remember that an attacker must not be able to predict ahead of time what a
 * given IV will be.
 *
 * @param inputBuffer {Buffer}
 * @param key {string}
 * @returns {{encrypted: Buffer, iv: Buffer}}
 */
function encrypt(inputBuffer, key) {

    if (!inputBuffer) {
        throw new Error("Input buffer must be provided");
    }

    if (!key || key.length === 0) {
        throw new Error("key not valid");
    }

    logger.debug("encrypt()", {
        param: {
            inputBuffer: `Buffer(${inputBuffer.length} bytes)`,
            key: redactString(key)
        }
    });

    const aesKey = crypto.createHash("sha256").update(key).digest();
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
    let encrypted = cipher.update(inputBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv,
        encrypted
    };
}

/**
 * Decrypt text
 *
 * @public
 *
 * @param encryptedObj {{encrypted: Buffer, iv: Buffer}}
 * @param key {string}
 * @returns {Buffer}
 */
function decrypt(encryptedObj, key) {

    if (!encryptedObj) {
        throw new Error("Encrypted object must be provided");
    }

    if (!key || key.length === 0) {
        throw new Error("key not valid");
    }

    logger.debug("decrypt()", {
        param: {
            encryptedBuffer: `Buffer(${encryptedObj.encrypted.length} bytes)`,
            key: redactString(key)
        }
    });

    const aesKey = crypto.createHash("sha256").update(key).digest();
    let decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, encryptedObj.iv);
    let decrypted = decipher.update(encryptedObj.encrypted);
    return Buffer.concat([decrypted, decipher.final()]);
}

module.exports = {decrypt, encrypt};
