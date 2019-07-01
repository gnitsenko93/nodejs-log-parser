'use strict';

const Logable = require('../../lib/logable');

class Processor extends Logable {

    constructor(options) {
        super(options);

        this._options = options;

        this._transport = this._getTransport(this._options);
    }

    async start() {
        return this._transport.start();
    }

    async stop() {
        return this._transport.stop();
    }

    _getTransport(options) {
        throw new Error('_getTransport must be implemented.');
    }
}

module.exports = Processor;
