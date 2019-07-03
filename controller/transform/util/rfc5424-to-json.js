'use strict';

const parse = require('nsyslog-parser');

const LOGSOURCE = {
    SERVER: 'server'
};

const TYPE = {
    0: 'ERROR',
    1: 'ERROR',
    2: 'ERROR',
    3: 'ERROR',
    4: 'WARNING',
    5: 'INFO',
    6: 'INFO',
    7: 'DEBUG'
};

const SERVER_PROP = {
    APP: 'appName',
    HOST: 'host',
    MSG: 'message',
    TS: 'ts',
    DATA: 'structuredData',
    PID: 'pid',
    MID: 'messageid'
};

module.exports = line => {
    const parsedLine = parse(line);

    const { prival } = parsedLine;
    const severity = prival % 8;

    const data = Object.keys(parsedLine).reduce((acc, prop) => {
        switch (prop) {
            case SERVER_PROP.MSG:
                return Object.assign({message: parsedLine[prop]}, acc);
            case SERVER_PROP.HOST:
                return Object.assign({host: parsedLine[prop]}, acc);
            case SERVER_PROP.TS:
                return Object.assign({timestamp: parsedLine[prop]}, acc);
            case SERVER_PROP.APP:
                return Object.assign({program: parsedLine[prop]}, acc);
            case SERVER_PROP.PID:
            case SERVER_PROP.MID:
                return Object.assign(acc, {
                    _data: { ...acc._data, [prop]: parsedLine[prop]}
                });
            case SERVER_PROP.DATA:
                const structuredData = parsedLine[prop] || {};

                const { env } = structuredData.find(data => data.env) || {};

                return Object.assign({ env } ,acc, {
                    _data: {...acc._data, ...structuredData}
                });
            default:
                return acc;
        }
    }, {
        logsource: LOGSOURCE.SERVER,
        type: TYPE[severity]
    });

    return data;
};
