const winston = require("winston")

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: "error.log", level: "error"}),
        new winston.transports.File({filename: "combined.log"}),
    ],
})

logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}))

logger.stream = {
    write: (message) => {
        logger.info(message.trim())
    },
}

module.exports = logger
