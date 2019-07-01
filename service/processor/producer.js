'use strict';

const Processor = require('./processor-abstract');

const { factoryTransport } = require('../../transport');

class Producer extends Processor {

    constructor(options) {
        super(options);
    }

    _getTransport(options) {
        return factoryTransport('target', options);
    }
}

module.exports = Producer;
