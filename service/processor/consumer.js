'use strict';

const Processor = require('./processor-abstract');

const { factoryTransport } = require('../../transport');

/**
 * @class Consumer
 * @extends Processor
 */
class Consumer extends Processor {

    /**
     * @param {SourceOptions} options -
     * @constructor
     */
    constructor(options) {
        super(options);
    }

    /**
     * Gets consumer  transport.
     * @param {SourceOptions} options -
     * @return {Transport} -
     * @private
     * @override
     */
    _getTransport(options) {
        return factoryTransport('source', options);
    }
}

module.exports = Consumer;
