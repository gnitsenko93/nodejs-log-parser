'use strict';

const util = require('util');
const stream = require('stream');

const pipeline = util.promisify(stream.pipeline);

const Logable = require('../lib/logable');

const {
    Consumer, Producer, Transformer
} = require('./processor');

/**
 * @class Service
 */
class Service extends Logable {

    /**
     * @typedef {Object} SourceOptions
     * @property {'file'|'tcp'} type -
     * @property {string} path -
     * @property {number} port -
     * @property {string} address -
     */

    /**
     * @typedef {SourceOptions} TargetOptions
     */

    /**
     * @typedef {Object} TransformOptions
     * @property {'json'} type -
     */

    /**
     * @constructor
     * @param {Object} options -
     * @param {SourceOptions} options.source -
     * @param {TargetOptions} options.target -
     * @param {TransformOptions} [options.transform] -
     */
    constructor(options) {
        super(options);

        this._options = options;

        this._consumer = new Consumer(this._options.source);
        this._producer = new Producer(this._options.target);
        this._transformer = new Transformer(this._options.transform);
    }

    /**
     * Starts service.
     * @return {Promise<null>} -
     */
    async start() {
        const producerStream = await this._producer.start();
        const consumerStream = await this._consumer.start();

        const transformerStream = await this._transformer.start();

        try {
            await pipeline(
                consumerStream,
                transformerStream,
                producerStream
            );

            this._log('Data is processed.');

        } catch (error) {
            this._logError('Error on processing data.');
            return this.stop(error);
        }

        return this.stop();
    }

    /**
     * Stops service.
     * @return {Promise<null>} service is stopped.
     */
    async stop(error) {
        await this._producer.stop();
        await this._consumer.stop();
        await this._transformer.stop();

        return process.exit(error? 1 : 0)
    }

}

module.exports = Service;
