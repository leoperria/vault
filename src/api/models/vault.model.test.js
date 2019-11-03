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

const TEST_OBJ_2 = {
    a: 1,
    b: {
        c: "TEST_2"
    }
};

const INVALID_IDS = [
    "TEST**",
    "**",
    "",
    "TTT***TTTT",
    undefined,
    null,
    123
];

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

    it("should replace the value of already present key", async () => {

        const r1 = await Vault.storeById(
            DOCUMENT_ID,
            ENCRYPTION_KEY,
            TEST_OBJ
        );

        const r2 = await Vault.storeById(
            DOCUMENT_ID,
            ENCRYPTION_KEY,
            TEST_OBJ_2
        );

        const result = await Vault.getById(DOCUMENT_ID, ENCRYPTION_KEY);

        expect(result).toStrictEqual([
            {id: DOCUMENT_ID, value: TEST_OBJ_2}
        ]);

    });


    it("should return an empty array if the document is not present", async () => {

        const result = await Vault.getById(DOCUMENT_ID, ENCRYPTION_KEY);

        expect(result).toStrictEqual([]);

    });

    it("should return an array of documents when key contains wildcard *", async () => {

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

    it("should throw when the key is invalid", async () => {

        for (const invalidId of INVALID_IDS) {
            const attempt = async() =>{
                await Vault.storeById(
                    invalidId,
                    ENCRYPTION_KEY,
                    TEST_OBJ
                );
            };
            await expect(attempt()).rejects.toThrow(
                /fails|empty|required|must be a string/
            );
        }

    });


});
