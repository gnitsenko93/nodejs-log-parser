'use strict';

const jsonToJson = require('./json-to-json');
const rfc5424ToJson = require('./rfc5424-to-json');
const unFormattedToJson = require('./unformatted-to-json');

module.exports = {
    jsonToJson,
    rfc5424ToJson,
    unFormattedToJson
};
