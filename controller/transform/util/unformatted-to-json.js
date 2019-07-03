'use strict';

const TYPE = {
    ERROR: 'ERROR'
};

module.exports = stash => {
    const data = {
        type: TYPE.ERROR,
        message: stash
    };

    return data;
}