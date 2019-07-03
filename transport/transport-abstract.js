'use strict';

const Logable = require('../lib/logable');

/**
 *
 * @param {Object} options -
 * @constructor
 */
class Transport extends Logable {

    constructor(options) {
        super(options);

        /**
         * @type {object}
         */
        this._options = options;
        /**
         * @type {Stream}
         */
        this._stream = null;
    }

    /**
     * Starts transport.
     * @return {Promise<Stream>} stream instance
     */
    async start() {
        return this._stream;
    }

    /**
     * Stops transport.
     * @return {Promise<Stream>} -
     */
    async stop () {
        return this._stream.destroy();
    }

}

module.exports = Transport;
