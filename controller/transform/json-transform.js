'use strict';

const { Transform } = require('stream');

class JsonTransformStream extends Transform {

    constructor(options) {
        super();
        this._filter = options.filter || [];
    }

    _transform(chunk, encoding, callback) {
        this.push(chunk.toString());
        return callback();
    }
}

module.exports = JsonTransformStream;
