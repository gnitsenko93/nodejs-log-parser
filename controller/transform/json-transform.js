'use strict';

const { Transform } = require('stream');

const util = require('./util');

const Logger = require('../../lib/logger');

/**
 * @class JsonTransformStream
 * @extends Transform
 */
class JsonTransformStream extends Transform {

    /**
     * @typedef {Object} TransformOptions
     * @property {string[]} [filter] message types to be filtered
     */

    /**
     *
     * @param {TransformOptions} options -
     * @constructor
     */
    constructor(options) {
        super();
        this._filter = options.filter || [];
        this._stash = '';

        this._logger = new Logger();
    }

    /**
     * Pushes data to read queue.
     * @param {Object[]} chunks -
     * @returns {null} data is pushed.
     */
    push(chunks) {
        (chunks || []).forEach(chunk => super.push('\n' + JSON.stringify(chunk, null, 2)));

        return null;
    }

    /**
     * Flushes data to read queue before closing stream.
     * @param {Function} callback -
     * @return {void} -
     * @private
     */
    _flush(callback) {
        const stash = this._stash;

        if (stash !== '') {
            this.push(this._parseUnformattedLog(stash));
        }

        return callback();
    }

    /**
     * Transforms data chunk.
     * @param {Buffer[]} chunk -
     * @param {string} encoding -
     * @param {Function} callback -
     * @return {void} -
     * @private
     */
    _transform(chunk, encoding, callback) {
        this._log(`New chunk. Meta=${JSON.stringify({size: chunk.length})}`);

        const lines = chunk.toString().split('\n');

        this._log(`Chunk is splitted into lines. Meta=${JSON.stringify({count: lines.length})}`)

        const data = lines.reduce((acc, line) => {
            return acc.concat(this._processLine(line).filter(v => !this._filter.includes(v.type)))
        }, []);

        this._log(`Chunk is processed and filtered.`);

        return callback(null, data);
    }

    /**
     * Processes log line.
     * @param {string} line -
     * @return {Object[]} pre-processed log lines.
     * @private
     */
    _processLine(line) {
        let data = null;

        try {
            data = this._parseClientLog(line);

            this._log('Client log line is processed.');
        } catch (error) {
            const isRfc5424 = /^<\d+>/.test(line);

            if (isRfc5424) {
                data = this._parseServerLog(line);

                this._log('Server log is processed.');
            }
        }

        const stash = this._stash;

        let result = [];

        if (data) {

            if (stash !== '') {
                const parsedStash = this._parseUnformattedLog(stash);
                this._log('Error stack trace is processed.');

                result.push({ timestamp: data.timestamp, ...parsedStash});

                this._unstashUnformattedLog();
            }

            result.push(data);
        } else {
            const isNewError = !(/\.js\:\d+/.test(line));

            if (isNewError && stash !== '') {
                const parsedStash = this._parseUnformattedLog(stash);
                this._log('Error stack trace is processed.');

                result.push(parsedStash);

                this._unstashUnformattedLog();
            }
            this._stashUnformattedLog(line);
        }

        return result;
    }

    /**
     * Processes client log line.
     * @param {string} line -
     * @throws {Error} Will throw an error if a log line is not a serialized JSON.
     * @return {Object} -
     * @private
     */
    _parseClientLog(line) {
        return util.jsonToJson(line);
    }

    /**
     * Processes server log line.
     * @param {string} line -
     * @return {Object} -
     * @private
     */
    _parseServerLog(line) {
        return util.rfc5424ToJson(line);
    }

    /**
     * Processes stashed error trace lines.
     * @param {string} stash -
     * @return {Object} -
     * @private
     */
    _parseUnformattedLog(stash) {
        return util.unFormattedToJson(stash);
    }

    /**
     * Stashes error trace line in controller's in-memory buffer.
     * @param {string} line -
     * @return {string} updated stash value.
     * @private
     */
    _stashUnformattedLog(line) {
        this._stash += line;

        return this._stash;
    }

    /**
     * Unstashed controller's in-memory buffer.
     * @return {string} stash value before removing.
     * @private
     */
    _unstashUnformattedLog() {
        const stash = this._stash;

        this._stash = '';

        return stash;
    }

    _log(msg) {
        this._logger.log(`[${this.constructor.name}] ${msg}`);
    }

    _logError(msg) {
        this._logger.logError(`[${this.constructor.name}] ${msg}`);
    }
}

module.exports = JsonTransformStream;
