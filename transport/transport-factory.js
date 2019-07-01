'use strict';

const FileSource = require('./source/file-source');
const FileTarget = require('./target/file-target');
const TcpSource = require('./source/tcp-source');
const TcpTarget = require('./target/tcp-target');
const JsonTransform = require('./transform/json-transform');

/**
 * @typedef {FileSource|FileTarget|TcpSource|TcpTarget|JsonTransform} Transport
 */

/**
 * Creates Transport instance with particular type.
 * @param {'source'|'target'|'proxy'} _type -
 * @param {Object} options -
 * @throws {Error} Will throw an error in transport type is not supported.
 * @return {Transport} -
 */
module.exports = function transportFactory(_type, options) {
    let transport = null;

    const { type } = options;

    switch (type) {
        case 'file':
            if (_type === 'source') {
                transport = new FileSource(options);
            }
            if (_type === 'target') {
                transport = new FileTarget(options);
            }
            break;
        case 'tcp':
            if (_type === 'source') {
                transport = new TcpSource(options);
            }
            if (_type === 'target') {
                transport = new TcpTarget(options);
            }
            break;
        default:
            if (_type === 'proxy') {
                transport = new JsonTransform(options);
            } else {
                throw new Error('Transport type is not supported.');
            }
    }

    if (!transport) {
        throw new Error('Only source and target transport can be created.');
    }

    return transport;
}