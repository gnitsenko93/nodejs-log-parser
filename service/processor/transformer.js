'use strict';

const Processor = require('./processor-abstract');

const { factoryTransport } = require('../../transport');

/**
 * @class Transformer
 * @extends Processor
 */
class Transformer extends Processor {

    /**
     *
     * @param {TransformOptions} options -
     * @constructor
     */
    constructor(options) {
        super(options);
    }

    /**
     * Gets transformer transport.
     * @param {TransformOptions} options -
     * @return {Transport} -
     * @private
     * @override
     */
    _getTransport(options) {
        return factoryTransport('proxy', options);
    }
}

module.exports = Transformer;
