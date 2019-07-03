'use strict';

const { Transform } = require('stream');

const util = require('./util');

class JsonTransformStream extends Transform {

    constructor(options) {
        super();
        this._filter = options.filter || [];
        this._stash = '';
    }

    push(chunks) {
        (chunks || []).forEach(chunk => super.push('\n' + JSON.stringify(chunk, null, 2)));
    }

    _flush(callback) {
        const stash = this._stash;

        if (stash !== '') {
            this.push(this._parseUnformattedLog(stash));
        }

        return callback();
    }

    _transform(chunk, encoding, callback) {
        console.log(`New chunk. Meta=${JSON.stringify({size: chunk.length})}`);

        const lines = chunk.toString().split('\n');

        console.log(`Chunk is splitted into lines. Meta=${JSON.stringify({count: lines.length})}`)

        const data = lines.reduce((acc, line) => {
            return acc.concat(this._processLine(line).filter(v => !this._filter.includes(v.type)))
        }, []);

        return callback(null, data);
    }

    _processLine(line) {
        console.log(`Processing log. Meta=${JSON.stringify({line})}`);

        let data = null;

        try {
            data = this._parseClientLog(line);

            console.log('Client log is processed.');
        } catch (error) {
            const isRfc5424 = /^<\d+>/.test(line);

            if (isRfc5424) {
                data = this._parseServerLog(line);

                console.log('Server log is processed.');
            }
        }

        const stash = this._stash;

        let result = [];

        if (data) {

            if (stash !== '') {
                result.push({ timestamp: data.timestamp, ...this._parseUnformattedLog(stash)});
                this._unstashUnformattedLog();
            }

            result.push(data);
        } else {
            const isNewError = !(/\.js\:\d+/.test(line));

            if (isNewError && stash !== '') {
                result.push(this._parseUnformattedLog(stash));
                this._unstashUnformattedLog();
            }
            this._stashUnformattedLog(line);
        }

        return result;
    }

    _parseClientLog(line) {
        return util.jsonToJson(line);
    }

    _parseServerLog(line) {
        return util.rfc5424ToJson(line);
    }

    _parseUnformattedLog(stash) {
        return util.unFormattedToJson(stash);
    }

    _stashUnformattedLog(line) {
        this._stash += line;

        return this._stash;
    }

    _unstashUnformattedLog() {
        const stash = this._stash;

        this._stash = '';

        return stash;
    }
}

module.exports = JsonTransformStream;
