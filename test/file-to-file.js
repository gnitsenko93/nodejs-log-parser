'use strict';

const assert = require('assert');
const {readFileSync} = require('fs');
const Config = require('../config/file-to-file.json');
const Source = require('../transport/source/file-source');
const Target = require('../transport/target/file-target');

const source = new Source(Config.source);
const target = new Target(Config.target);

source._stream.on('end', () => {
    console.log('source end');
});
source._stream.on('data', data => {
    console.log({ data: data });
})
target._stream.on('finish', () => {
    console.log('target finish');
})
target._stream.on('unpipe', () => {
    console.log('target unpipe');
    const original = readFileSync(Config.source.path);
    const copy = readFileSync(Config.target.path);
    assert.equal(original.length, copy.length, 'Copy size is not equal original');
    console.log('Test passed');
});

source._stream.pipe(target._stream);