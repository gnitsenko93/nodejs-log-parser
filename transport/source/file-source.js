'use strict';

const fs = require('fs');
const util = require('util');
const Abstract = require('../transport-abstract');

function FileSource(config) {
  this.config = config;
  this._stream = fs.createReadStream(this.config.path, {
    flags: 'r',
    encoding: 'utf8',
  });
}
util.inherits(FileSource, Abstract);

module.exports = FileSource;
