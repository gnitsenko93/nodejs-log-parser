'use strict';

const configPath = process.env.npm_config_config;

const Config = require('./config/' + configPath);
const Service = require('./service');

const service = new Service(Config);

service.start();
