const morgan = require("morgan");
const logger = require("../../config/logger");
const {obfuscateQueryParam} = require("../../utils/log_utils");

function logExpressRequests(redactedParams) {
    return morgan((tokens, request, response) => {

        let redactedUrl = tokens.url(request, response);
        for(const p of redactedParams) {
            redactedUrl = obfuscateQueryParam(redactedUrl, p);
        }

        return [
            "HTTP " +  tokens.method(request, response),
            redactedUrl,
            tokens.status(request, response),
            tokens.res(request, response, "content-length"), "-",
            tokens["response-time"](request, response), "ms"
        ].join(" ");
    },  { stream: logger.stream })
}

module.exports = {logExpress: logExpressRequests};
