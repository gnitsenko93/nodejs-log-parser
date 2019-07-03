'use strict';

const { PassThrough } = require('stream');
const { createServer } = require('net');
const { promisify } = require('util');

const Transport = require('../transport-abstract');

/**
 * @class TcpSource
 * @extends Transport
 */
class TcpSource extends Transport {

    /**
     * @typedef {Object} TcpSourceOptions
     * @property {number} port -
     * @property {string} address -
     */

    /**
     * @param {TcpSourceOptions} options -
     * @constructor
     */
    constructor(options) {
        super(options);

        this._port = options.port;
        this._address = options.address;
    }

    /**
     * Starts TCP server.
     * @return {Promise<Stream>} -
     * @override
     */
    async start() {
        this._stream = new PassThrough();

        this._server = createServer(function (socket) {
            this._log('A new TCP source is connected.');

            socket.on('close', () => {
                this._log('TCP source is disconnected.');
            })

            socket.pipe(this._stream, { end: false })
        }.bind(this));

        this._log(`Starting TCP server. Meta=${JSON.stringify({host: this._address, port: this._port})}`);

        await promisify(this._server.listen.bind(this._server))(this._port, this._address);

        this._log('TCP server is started.');

        return this._stream;
    }
}

module.exports = TcpSource;
