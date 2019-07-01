'use strict';

const Processor = require('./processor-abstract');

const { factoryTransport } = require('../../transport');

class Transformer extends Processor {

    constructor(options) {
        super(options);
    }

    _getTransport(options) {
        return factoryTransport('proxy', options);
    }
}

module.exports = Transformer;
