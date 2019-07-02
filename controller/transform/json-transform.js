'use strict';

const { Transform } = require('stream');

class JsonTransformStream extends Transform {

    constructor(options) {
        super();
        this._filter = options.filter || [];
        this._stash = '';
    }

    _flush(callback) {
        const data = this._unstashUnformattedLog();

        this.push(data);

        return callback();
    }

    _transform(chunk, encoding, callback) {
        console.log(`New chunk. Meta=${JSON.stringify({size: chunk.length})}`);

        const lines = chunk.toString().split('\n');

        console.log(`Chunk is splitted into lines. Meta=${JSON.stringify({count: lines.length})}`)

        lines.forEach(line => this._processLine(line));

        return callback();
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

        if (data) {

            if (stash !== '') {
                this.push(stash + '\n');
                this._unstashUnformattedLog();
            }

            this.push(data);
        } else {
            const isNewError = !(/\.js\:\d+/.test(line));

            if (isNewError && stash !== '') {
                this.push(stash + '\n');
                this._unstashUnformattedLog();
            }
            this._stashUnformattedLog(line);
        }

        return;
    }

    _parseClientLog(line) {
        const parsedLine = JSON.parse(line);

        return JSON.stringify(parsedLine) + '\n';
    }

    _parseServerLog(line) {
        return line + '\n';
    }

    _stashUnformattedLog(line) {
        this._stash += line;
    }

    _unstashUnformattedLog() {
        const stash = this._stash + '\n';

        this._stash = '';

        return stash;
    }
}

module.exports = JsonTransformStream;
