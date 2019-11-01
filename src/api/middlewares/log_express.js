const morgan = require("morgan");
const {obfuscateQueryParam} = require("../../utils/log_utils");

function logExpressRequests(redactedParams) {
    return morgan((tokens, request, response) => {

        let redactedUrl = tokens.url(request, response);
        for(const p of redactedParams) {
            redactedUrl = obfuscateQueryParam(redactedUrl, p);
        }

        return [
            tokens.method(request, response),
            redactedUrl,
            tokens.status(request, response),
            tokens.res(request, response, "content-length"), "-",
            tokens["response-time"](request, response), "ms"
        ].join(" ");
    })
}

module.exports = {logExpress: logExpressRequests};
