const xmlFormatter = require('xml-formatter');

const { info, debug } = require('../logger');

const XML_TYPE = ['text/xml', 'application/xml'];
const JSON_TYPE = ['text/json', 'application/json'];

const runCatching = (formatterFn) => {
    try {
        return formatterFn();
    } catch (e) {
        return e.message;
    }
};

const formatXml = (data) => runCatching(() => xmlFormatter(data));
const formatJson = (data) => runCatching(() => JSON.stringify(JSON.parse(data), null, 2));

const format = function (contentType, data) {
    debug(`Format data for content-type [${contentType}]`);

    if (XML_TYPE.includes(contentType)) {
        info('Formatting as xml');
        return formatXml(data.toString());
    } else if (JSON_TYPE.includes(contentType)) {
        info('Formatting as json');
        return formatJson(data);
    }
    else {
        info(`No formatter found for content-type [${contentType}]. Using unformatted string`);
        return data.toString();
    }
};

module.exports = { format };