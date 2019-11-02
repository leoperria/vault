Promise = require("bluebird"); // eslint-disable-line no-global-assign
const { port, env } = require("./config/vars");
const app = require("./config/express");
const mongoose = require("./config/mongoose");
const logger = require("./config/logger");

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => logger.debug(`Server started on port ${port} (${env})`));

/**
 * Exports express
 *
 * @public
 */
module.exports = app;

