'use strict';

const Logable = require('../../lib/logable');

/**
 * @class Processor
 * @extends Logable
 */
class Processor extends Logable {

    /**
     *
     * @param {Object} options -
     * @constructor
     */
    constructor(options) {
        super(options);

        this._options = options;

        this._transport = this._getTransport(this._options);
    }

    /**
     * Starts transport.
     * @return {Promise<Transport>} started transport instance.
     */
    async start() {
        return this._transport.start();
    }

    /**
     * Stops transport.
     * @return {Promise<Transport>} stopped transport instance.
     */
    async stop() {
        return this._transport.stop();
    }

    /**
     * Sets processor transport.
     * @param {Object} options -
     * @private
     */
    _getTransport(options) {
        throw new Error('_getTransport must be implemented.');
    }
}

module.exports = Processor;
