const mongoose = require("../../config/mongoose");
const Vault = require("./vault.model");

const ENCRYPTION_KEY = "Password!!!";
const WRONG_ENCRYPTION_KEY = "Abcd1234";
const DOCUMENT_ID = "TEST_ID";
const TEST_OBJ = {
    a: 1,
    b: {
        c: "TEST"
    }
};

let connection;
beforeAll(async () => {
    connection = await mongoose.connect();
});

afterAll(async () => {
    await connection.close();
});

// delete the collection on every test
beforeEach(async () => {
    await Vault.deleteMany();
});

describe("Vault Model", () => {

    it("should encrypt and store a document", async () => {

        const result = await Vault.storeById(
            DOCUMENT_ID,
            ENCRYPTION_KEY,
            TEST_OBJ
        );

        expect(result).toStrictEqual({saved: true});

    });

    it("should decrypt a stored document", async () => {

        await Vault.storeById(
            DOCUMENT_ID,
            ENCRYPTION_KEY,
            TEST_OBJ
        );

        const result = await Vault.getById(DOCUMENT_ID, ENCRYPTION_KEY);

        expect(result).toStrictEqual([
            {id: DOCUMENT_ID, value: TEST_OBJ}
        ]);

    });


    it("shoudl return an empty array if the document is not present", async () => {

        const result = await Vault.getById(DOCUMENT_ID, ENCRYPTION_KEY);

        expect(result).toStrictEqual([]);

    });

    it("should return an array of document when key contains wildcard * ", async () => {

        await Promise.all([
            Vault.storeById(DOCUMENT_ID + "A", ENCRYPTION_KEY, TEST_OBJ),
            Vault.storeById(DOCUMENT_ID + "B", ENCRYPTION_KEY, TEST_OBJ),
            Vault.storeById(DOCUMENT_ID + "C", ENCRYPTION_KEY, TEST_OBJ)
        ]);

        const result = await Vault.getById(DOCUMENT_ID + "*", ENCRYPTION_KEY);

        expect(result).toEqual([
            {id: DOCUMENT_ID+"A", value: TEST_OBJ},
            {id: DOCUMENT_ID+"B", value: TEST_OBJ},
            {id: DOCUMENT_ID+"C", value: TEST_OBJ}
        ]);

    });

    it("should return an empty array when the encryption key is wrong", async () => {

        await Vault.storeById(
            DOCUMENT_ID,
            ENCRYPTION_KEY,
            TEST_OBJ
        );

        const result = await Vault.getById(DOCUMENT_ID, WRONG_ENCRYPTION_KEY);

        expect(result).toEqual([]);

    });


});
