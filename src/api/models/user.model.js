const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const APIError = require("../utils/APIError");
const { env } = require("../../config/vars");

/**
 * User Roles
 */
const roles = ["user", "admin"];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    services: {
        facebook: String,
        google: String,
    },
    role: {
        type: String,
        enum: roles,
        default: "user",
    },
    picture: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre("save", async function save(next) {
    try {
        if (!this.isModified("password")) return next();

        const rounds = env === "test" ? 1 : 10;

        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Methods
 */
userSchema.method({
    transform() {
        const transformed = {};
        const fields = ["id", "name", "email", "picture", "role", "createdAt"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    }
});

/**
 * Statics
 */
userSchema.statics = {

    roles,

    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let user;

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }

            throw new APIError({
                message: "User does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({
        page = 1, perPage = 30, name, email, role,
    }) {
        const options = omitBy({ name, email, role }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
        if (error.name === "MongoError" && error.code === 11000) {
            return new APIError({
                message: "Validation Error",
                errors: [{
                    field: "email",
                    location: "body",
                    messages: ["\"email\" already exists"],
                }],
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack,
            });
        }
        return error;
    }

};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
