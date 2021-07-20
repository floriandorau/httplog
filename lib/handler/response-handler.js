
const { join } = require('path');
const { existsSync, readFileSync } = require('fs');

const { info } = require('../logger');

const getMimeType = (fileExtension) => {
    const mimeTypes = {
        'json': 'text/json'
    };

    return mimeTypes[fileExtension] || 'text/plain';
};

const readResponse = (responseFile) => {
    const fileContent = readFileSync(responseFile, 'utf8');
    const { status, type, data } = JSON.parse(fileContent);
    return { status, type, data };
};

class ResponseHandler {
    constructor(response) {
        if (response) {
            let responseFile = join(process.cwd(), response);
            info(`Providing response from file '${responseFile}'`);
            if (!existsSync(responseFile)) {
                throw Error(`Cannot find response file ${responseFile}`);
            }
            this.responseFile = responseFile;
        }
    }

    sendResponse(response, { accept }) {
        if (this.responseFile) {
            const { status, type, data } = readResponse(this.responseFile);
            response.writeHead(status, { 'Content-Type': getMimeType(type) });
            response.end(JSON.stringify(data));
        } else {
            response.writeHead(200, { 'Content-Type': accept || 'text/plain' });
            response.end();
        }
    }

    handleRequest(request, response) {
        let { headers } = request;
        request.on('end', () => {
            this.sendResponse(response, { accept: headers['accept'] });
        });
    }
}

module.exports = { ResponseHandler };