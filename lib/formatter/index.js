const xmlFormatter = require('xml-formatter');
const { info, debug } = require('../logger');

const formatXml = (data) => xmlFormatter(data);
const formatJson = (data) => JSON.stringify(data, null, 2);

const format = function (contentType, data) {
    debug(`Format data for content-type '${contentType}'`);

    if (contentType && (contentType.includes('text/xml') || contentType.includes('application/xml'))) {
        debug('Formatting as xml');
        return formatXml(data.toString());
    } if (contentType && (contentType.includes('text/json') || contentType.includes('application/json'))) {
        debug('Formatting as json');
        return formatJson(data);
    } else {
        info(`No formatter found for content-type ${contentType}. Using unformatted string`);
        return data.toString();
    }
};

module.exports = { format };