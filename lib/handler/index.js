const { FileHandler } = require('./file-handler');
const { LogRequestHandler } = require('./log-handler');
const { BrowserHandler } = require('./browser-handler');
const { ResponseHandler } = require('./response-handler');
const { ProxyRequestHandler } = require('./proxy-handler');

module.exports = { FileHandler, LogRequestHandler, BrowserHandler, ResponseHandler, ProxyRequestHandler };