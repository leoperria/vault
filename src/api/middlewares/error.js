const httpStatus = require("http-status");
const APIError = require("../../utils/APIError");
const {ValidationError} = require("@hapi/joi/lib/errors");
const {env} = require("../../config/vars");

/**
 * Error handler. Send stacktrace only during development
 *
 * @public
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
function handler(err, req, res, next) {
    const response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack
    };

    if (env !== "development") {
        delete response.stack;
    }

    res.status(err.status);
    res.json(response);
}

/**
 * If error is not an instanceOf APIError, convert it.
 *
 * @public
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
function converter(err, req, res, next) {
    let convertedError = err;

    const convertValidationError = error => new APIError({
        message: "Validation Error",
        errors: error.details.map(d => d.message.replace(/"/g, "'"))
    });

    if (err && err.error && err.error.isJoi) {
        convertedError = convertValidationError(err.error);
    } else if (err instanceof ValidationError) {
        convertedError = convertValidationError(err);
    } else if (!(err instanceof APIError)) {
        console.error(err);
        convertedError = new APIError({
            message: "Server error"
        });
    }
    return handler(convertedError, req, res);
}

/**
 * Catch 404 and forward to error handler
 *
 * @public
 *
 * @param req
 * @param res
 * @param next
 */
function notFound(req, res, next) {
    const err = new APIError({
        message: "Not found",
        status: httpStatus.NOT_FOUND
    });
    return handler(err, req, res);
}

module.exports = {handler, converter, notFound};
