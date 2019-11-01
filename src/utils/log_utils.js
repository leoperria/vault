const _ = require("lodash");

function formatLogObj(obj) {
    return _.keys(obj).map(k => `${k}=${obj[k]}`).join(" ");
}

function logMsg(msg, params) {
    return msg + " "+ formatLogObj(params);
}

function redactString(str) {
    if (!str || str.length === 0) {
        return "";
    } else {
        return "*".repeat(str.length);
    }
}

function obfuscateQueryParam(urlToObfuscate, paramName) {
    if (!paramName || paramName === "") {
        throw new Error(`paramsName is not valid`);
    }
    return urlToObfuscate.replace(
        new RegExp(`(${paramName}=)([^&]*)`),
        `$1<REDACTED>`
    );
}

module.exports = {
    logMsg,
    redactString,
    formatLogObj,
    obfuscateQueryParam
};
