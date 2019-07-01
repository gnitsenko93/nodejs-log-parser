'use strict';

/**
 *
 * @param {Object} options -
 * @constructor
 */
function Transport(options) {
  /**
   * @type {object}
   */
  this._options = options;
  /**
   * @type {Stream}
   */
  this._stream = null;
}

/**
 * Starts transport.
 * @return {Promise<Stream>} stream instance
 */
Transport.prototype.start = async function () {
    return this._stream;
}

/**
 * Stops transport.
 * @return {Promise<Stream>} -
 */
Transport.prototype.stop = async function () {
    return this._stream.destroy();
}

module.exports = Transport;
