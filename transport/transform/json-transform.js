'use strict';

const Transport = require('../transport-abstract');

const { JsonTransformController } = require('../../controller');

/**
 * @class JsonTransform
 * @extends Transport
 */
class JsonTransform extends Transport {

    /**
     * @typedef {Object} TransformOptions
     */

    /**
     *
     * @param {TransformOptions} options -
     * @constructor
     */
    constructor(options) {
        super(options);

        this._stream = null;
    }

    async start() {
        this._stream = new JsonTransformController(this._options);

        return this._stream;
    }
}

module.exports = JsonTransform;
