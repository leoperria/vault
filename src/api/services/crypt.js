const crypto = require("crypto");

const IV_LENGTH = 16;

/**
 * Encrypt text
 *
 * @public
 *
 * @param text
 * @param encryption_key
 * @returns {string}
 */
function encrypt(text, encryption_key) {
    const aesKey = crypto.createHash("sha256").update(encryption_key).digest();
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Decrypt text
 *
 * @public
 *
 * @param text
 * @param encryption_key
 * @returns {string}
 */
function decrypt(text, encryption_key) {
    const aesKey = crypto.createHash("sha256").update(encryption_key).digest();
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {decrypt, encrypt};
