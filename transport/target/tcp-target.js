'use strict';

const { promisify } = require('util');

const Transport = require('../transport-abstract');

const { PassThrough } = require('stream');

const { Socket } = require('net');


/**
 * @class TcpTarget
 * @extends Transport
 */
class TcpTarget extends Transport {

    /**
     * @typedef {Object} TcpTargetOptions
     * @property {number} port -
     * @property {string} address -
     */

    /**
     * @param {TcpTargetOptions} options -
     * @constructor
     */
    constructor(options) {
        super(options);

        this._port = options.port;
        this._address = options.address;
    }

    /**
     * Connects to TCP server.
     * @return {Promise<Stream>} -
     * @override
     */
    async start() {
        this._stream = new Socket();

        this._log(`Connecting to TCP server. Meta=${JSON.stringify({host: this._address, port: this._port})}`);

        await promisify(this._stream.connect.bind(this._stream))(this._port, this._address);

        this._log('Connection is established.');

        return this._stream;
    }
}

module.exports = TcpTarget;
