const crypto = require("crypto");

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
 * @param encryptionKey {string}
 * @returns {{encrypted: Buffer, iv: Buffer}}
 */
function encrypt(inputBuffer, encryptionKey) {
    if  (encryptionKey.length === 0) {
        throw new Error(`encryptionKey lenght can't  be 0`);
    }
    const aesKey = crypto.createHash("sha256").update(encryptionKey).digest();
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
 * @param encryptionKey {string}
 * @returns {Buffer}
 */
function decrypt(encryptedObj, encryptionKey) {
    if  (encryptionKey.length === 0) {
        throw new Error(`encryptionKey lenght can't  be 0`);
    }
    const aesKey = crypto.createHash("sha256").update(encryptionKey).digest();
    let decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, encryptedObj.iv);
    let decrypted = decipher.update(encryptedObj.encrypted);
    return Buffer.concat([decrypted, decipher.final()]);
}

module.exports = {decrypt, encrypt};
