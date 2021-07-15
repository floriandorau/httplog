
const { join } = require('path');
const { existsSync } = require('fs');
const { readFileSync } = require('fs');

const getMimeType = (fileExtension) => {
    const mimeTypes = {
        'json': 'text/json'
    };

    return mimeTypes[fileExtension] || 'text/plain';
};

class ResponseHandler {
    constructor(response) {
        if (response) {
            let responseFile = join(process.cwd(), response);
            if (!existsSync(responseFile)) {
                throw Error(`Cannot find response file ${responseFile}`);
            }
            this.responseFile = responseFile;
        }
    }

    sendResponse(response, { accept }) {
        if (this.responseFile) {
            const data = readFileSync(this.responseFile, 'utf8');
            const { status, type, data: jsonData } = JSON.parse(data);
            console.log(status, type, jsonData);
            response.writeHead(status, { 'Content-Type': getMimeType(type) });
            response.end(JSON.stringify(jsonData));
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