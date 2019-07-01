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
     * @param options
     */
    constructor(options) {
        super(options);

        this._port = options.port;
        this._address = options.address;
    }

    async start() {
        this._stream = new PassThrough();

        this._server = createServer(function (socket) {
            socket.pipe(this._stream)
        }.bind(this));

        await promisify(this._server.listen.bind(this._server))(this._port, this._address);

        return this._stream;
    }
}

module.exports = TcpSource;
