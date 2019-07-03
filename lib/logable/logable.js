'use strict';

const Logger = require('../logger');

class Logable {

    constructor(options) {
        this._logger = options.logger || new Logger(options.log);
    }

    _log(msg) {
        this._logger.log(`[${this.constructor.name}] ${msg}`);
    }

    _logError(msg) {
        this._logger.logError(`[${this.constructor.name}] ${msg}`);
    }
}

module.exports = Logable;
