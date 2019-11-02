const express = require("express");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("../api/routes/v1");
const {logs} = require("./vars");
const error = require("../api/middlewares/error");
const {MAX_DOCUMENT_SIZE} = require("../api/models/constants");
const {logExpress} = require("../api/middlewares/log_express");

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(logExpress([
    "decryption_key",
    "encryption_key"
]));

// parse body params and attach them to req.body
app.use(bodyParser.json({limit: MAX_DOCUMENT_SIZE}));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount api v1 routes
app.use("/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
