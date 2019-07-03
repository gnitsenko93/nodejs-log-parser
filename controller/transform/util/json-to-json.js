'use strict';

const LOGSOURCE = {
    CLIENT: 'client'
};

const TYPE = {
    ERROR: 'ERROR',
    INFO: 'INFO'
};

const CLIENT_PROP = {
    TYPE: 'type',
    MSG: 'message',
    ERROR: 'error',
    TS: 'timestamp',
    ENV: 'environment',
    APP: 'app',
    IP: 'ip'
};

module.exports = line => {
    const parsedLine = JSON.parse(line);

    const type = typeof parsedLine[CLIENT_PROP.ERROR] !== 'undefined'? TYPE.ERROR : TYPE.INFO;

    const data = Object.keys(parsedLine).reduce((acc, prop) => {
        switch (prop) {
            case CLIENT_PROP.ERROR:
            case CLIENT_PROP.MSG:
                return Object.assign({message: parsedLine[prop]}, acc);
            case CLIENT_PROP.IP:
                return Object.assign({host: parsedLine[prop]}, acc);
            case CLIENT_PROP.ENV:
                return Object.assign({env: parsedLine[prop]}, acc);
            case CLIENT_PROP.TS:
                return Object.assign({timestamp: parsedLine[prop]}, acc);
            case CLIENT_PROP.APP:
                return Object.assign({program: parsedLine[prop]}, acc);
            case CLIENT_PROP.TYPE:
                return acc;
            default:
                return Object.assign(acc, {
                    _data: { ...acc._data, [prop]: parsedLine[prop]}
                });
        }
    }, {
        logsource: LOGSOURCE.CLIENT,
        type
    });

    return data;
};
