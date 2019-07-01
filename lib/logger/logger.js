'use strict';

class Logger {

    log(message) {
        console.log(message);
    }

    logError(message) {
        console.error(message);
    }
}

module.exports = Logger;
