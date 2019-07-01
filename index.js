'use strict';

const Config = require('./config/file-to-file.json');
const Service = require('./service');

const service = new Service(Config);

service.start();
