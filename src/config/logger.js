const winston = require("winston");

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    defaultMeta: {service: "vault-api"}
});

/**
 * Since the application will be dockerized
 * the output should be sent to the console
 * also in production, but will be in json
 * format.
 */
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
} else {
    logger.add(new winston.transports.Console({
        format: winston.format.json()
    }));
}

// Stream for morgan
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

module.exports = logger;
