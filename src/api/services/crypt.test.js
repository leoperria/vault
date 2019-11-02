const {decrypt} = require("./crypt");
const {encrypt} = require("./crypt");

const ENCRYPTION_KEY = "Password!!!";
const ENCRYPTION_KEY_2 = "Abcdef1234";

const TEST_MSG = "Test message";


describe("Encryption module ", () =>{

    it("should encrypt and decrypt properly when the key is the same", () => {
        const encryptedObj = encrypt(Buffer.from(TEST_MSG), ENCRYPTION_KEY);
        const decryptedBuf = decrypt(encryptedObj, ENCRYPTION_KEY);
        expect(decryptedBuf.toString()).toBe(TEST_MSG);
    });

    it("should throw when the key is different", () => {
        const attempt  = () => {
            const encryptedObj = encrypt(Buffer.from(TEST_MSG), ENCRYPTION_KEY);
            decrypt(encryptedObj, ENCRYPTION_KEY_2);
        };
        expect(attempt).toThrow(/bad decrypt/);
    });

    it("should throw when encrypting with empty values", () => {
        const attempt1  = () => {
            encrypt(Buffer.from(TEST_MSG), "");
        };
        const attempt2  = () => {
            encrypt(Buffer.from(TEST_MSG));
        };
        const attempt3  = () => {
            encrypt(undefined, ENCRYPTION_KEY);
        };
        expect(attempt1).toThrow(/encryptionKey not valid/);
        expect(attempt2).toThrow(/encryptionKey not valid/);
        expect(attempt3).toThrow(/Input buffer must be provided/);
    });

    it("should throw when decrypting with empty key", () => {
        const attempt1  = () => {
            const encryptedObj = encrypt(Buffer.from(TEST_MSG), ENCRYPTION_KEY);
            decrypt(encryptedObj, "");
        };
        const attempt2  = () => {
            decrypt(undefined, ENCRYPTION_KEY);
        };
        expect(attempt1).toThrow(/encryptionKey not valid/);
        expect(attempt2).toThrow(/Encrypted object must be provided/);
    });

    it("should throw when decrypting corrupted input", () => {
        const attempt1  = () => {
            const encryptedObj = encrypt(Buffer.from(TEST_MSG), ENCRYPTION_KEY);
            decrypt({
                encrypted: encryptedObj.encrypted,
                iv: Buffer.from("GARBAGE string")
            },ENCRYPTION_KEY);
        };
        const attempt2  = () => {
            const encryptedObj = encrypt(Buffer.from(TEST_MSG), ENCRYPTION_KEY);
            decrypt({
                encrypted: Buffer.from("GARBAGE string"),
                iv: encryptedObj.iv
            },ENCRYPTION_KEY);
        };
        expect(attempt1).toThrow(/Invalid IV length/);
        expect(attempt2).toThrow(/wrong final block length/);
    });
});
