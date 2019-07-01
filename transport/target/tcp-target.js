'use strict';

const { promisify } = require('util');

const Transport = require('../transport-abstract');

const { PassThrough } = require('stream');

const { Socket } = require('net');

class TcpTarget extends Transport {
    constructor(options) {
        super(options);

        this._port = options.port;
        this._address = options.address;
    }

    async start() {
        this._stream = new Socket();

        await promisify(this._stream.connect.bind(this._stream))(this._port, this._address);

        return this._stream;
    }
}

module.exports = TcpTarget;
