'use strict';

const Processor = require('./processor-abstract');

const { factoryTransport } = require('../../transport');

/**
 * @class Producer
 * @extends Processor
 */
class Producer extends Processor {

    /**
     *
     * @param {Object} options -
     * @constructor
     */
    constructor(options) {
        super(options);
    }

    /**
     * Gets producer transport.
     * @param {TargetOptions} options -
     * @return {Transport} -
     * @private
     * @override
     */
    _getTransport(options) {
        return factoryTransport('target', options);
    }
}

module.exports = Producer;
