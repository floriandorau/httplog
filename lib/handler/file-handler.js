const os = require('os');
const fs = require('fs');

const { format } = require('../formatter');

class FileHandler {

    constructor(filePath) {
        this.writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
    }

    print(data) {
        this.writeStream.write(data);
    }


    println(data) {
        this.writeStream.write(data + os.EOL);
    }

    printHeaderData(method, url, { accept, contentType, contentLength }) {
        this.println('# ---- Incoming Request ---- #');
        this.println(`Received (UTC): ${new Date().toISOString()}`);
        this.println(`Method:         ${method}`);
        this.println(`URL:            ${url}`);
        this.println(`content-type:   ${contentType}`);
        this.println(`content-length: ${contentLength}`);
        this.println(`accept:         ${accept}`);
    }

    handleRequest(request) {
        let { method, url, headers } = request;

        this.printHeaderData(method, url, {
            accept: headers['accept'],
            contentType: headers['content-type'],
            contentLength: headers['content-length']
        });

        const data = [];

        request.on('data', (chunk) => data.push(chunk));

        request.on('end', () => {
            const formatted = format(headers['content-type'], data.toString());

            if (request.method === 'POST') {
                if (data.length == 0) {
                    this.println('post without data');
                } else {
                    this.print(formatted);
                }
            }
        });
    }
}

module.exports = { FileHandler };