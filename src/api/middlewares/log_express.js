const morgan = require("morgan");

function obfuscateQueryParam(urlToObfuscate, paramName) {
    if (!paramName || paramName === "") {
        throw new Error(`paramsName is not valid`);
    }
    return urlToObfuscate.replace(new RegExp(`(${paramName}=)([^&]*)`), "$1REDACTED");
}

function logExpress(redactedParams) {
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


module.exports = {logExpress};
