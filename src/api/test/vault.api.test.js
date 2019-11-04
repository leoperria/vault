const request = require("supertest");
const app = require("./../../config/express");
const mongooseModule = require("./../../config/mongoose");

const ENCRYPTION_KEY = "Password!!!";

const DOCUMENT_ID = "TEST_ID";
const DOCUMENT_ID_2 = "ABC";

const TEST_OBJ = {
    a: 1,
    b: {
        c: "TEST"
    }
};

beforeAll(async () => {
 return mongooseModule.connect();
});

afterAll(async () => {
    await mongooseModule.mongoose.connection.close();
});


describe("Vault API", () => {

    it("should test that PUT endpoint stores a document", async () => {

        const res = await request(app)
            .put(`/v1/vault/${DOCUMENT_ID}`)
            .query({encryption_key: ENCRYPTION_KEY})
            .set("Content-Type", "application/json")
            .send(TEST_OBJ);

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({saved: true});
    });

    it("should test that GET endpoint fetch the document decrypted", async () => {

        await request(app)
            .put(`/v1/vault/${DOCUMENT_ID}_1`)
            .query({encryption_key: ENCRYPTION_KEY})
            .set("Content-Type", "application/json")
            .send(TEST_OBJ);

        const res2 = await request(app)
            .get(`/v1/vault/${DOCUMENT_ID}_1`)
            .query({decryption_key: ENCRYPTION_KEY});

        expect(res2.statusCode).toBe(200);
        expect(res2.body).toStrictEqual([
            {id: `${DOCUMENT_ID}_1`, value: TEST_OBJ}
        ]);

    });

    it("should test that GET endpoint used with wildcard * fetches documents", async () => {

        await request(app)
            .put(`/v1/vault/${DOCUMENT_ID_2}_A`)
            .query({encryption_key: ENCRYPTION_KEY})
            .set("Content-Type", "application/json")
            .send(TEST_OBJ);

        await request(app)
            .put(`/v1/vault/${DOCUMENT_ID_2}_B`)
            .query({encryption_key: ENCRYPTION_KEY})
            .set("Content-Type", "application/json")
            .send(TEST_OBJ);

        const res2 = await request(app)
            .get(`/v1/vault/${DOCUMENT_ID_2}*`)
            .query({decryption_key: ENCRYPTION_KEY});

        expect(res2.statusCode).toBe(200);
        expect(res2.body).toStrictEqual([
            {id: `${DOCUMENT_ID_2}_A`, value: TEST_OBJ},
            {id: `${DOCUMENT_ID_2}_B`, value: TEST_OBJ}
        ]);

    });

    it("should throw when input are not correct", async () => {

        // Missing encryption key
        const res = await request(app)
            .put(`/v1/vault/${DOCUMENT_ID}`)
            .set("Content-Type", "application/json")
            .send(TEST_OBJ);

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("errors");

        // Missing decryption key
        const res2 = await request(app)
            .get(`/v1/vault/${DOCUMENT_ID}`);

        expect(res2.statusCode).toBe(500);
        expect(res2.body).toHaveProperty("errors");
    });

});
