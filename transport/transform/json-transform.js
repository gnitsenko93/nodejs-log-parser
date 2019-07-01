'use strict';

const Transport = require('../transport-abstract');

const { Transform } = require('stream');

class JsonTransform extends Transport {

    constructor(options) {
        super(options);

        this._stream = null;
    }

    async start() {
        this._stream = new Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                return callback();
            }
        });

        return this._stream;
    }
}

module.exports = JsonTransform;
