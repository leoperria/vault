function redactString(str) {
    if (!str || str.length === 0) {
        return "";
    } else {
        return "*".repeat(str.length);
    }
}

function obfuscateQueryParam(urlToObfuscate, paramName) {
    if (!paramName || paramName === "") {
        throw new Error("paramsName is not valid");
    }
    return urlToObfuscate.replace(
        new RegExp(`(${paramName}=)([^&]*)`),
        "$1<REDACTED>"
    );
}

module.exports = {
    redactString,
    obfuscateQueryParam
};
