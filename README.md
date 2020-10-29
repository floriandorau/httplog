# httplog

[![Build Status](https://travis-ci.org/floriandorau/httplog.svg?branch=master)](https://travis-ci.org/floriandorau/httplog)

Simple node app to log http request right into your console.

## Installation

Run the following to install httplog globally on your system.

```bash
npm install -g @floriandorau/httplog
```

After that run `httplog --help` to see how it works.

## How it works

Use the following command to start a local http server running at port 8080.

```bash
httplog --port 8080
```

You can now redirect your traffic to the started http server. Your request data will dumped into your console.

### Full commands

```shell
Usage: httplog [options]

Simple tool to log http requests into your terminal

Options:
  -V, --version             Outputs current version number
  -p, --port <port>         Port to listen for incoming requests
  -f, --file <file>         Incoming requests will be logged to <file>
  -n --ngrok                Exposes httplog to public internet using ngrok
  -d, --debug               Enable debug logging
  --proxy-mode <host:port>  [BETA] Runs httplog in a proxy mode where incoming request will be forwared to "host:port"
  -h, --help                output usage information
```

## Options

### file

Use this option to log incoming requests into a file, e.g.

```bash
httplog --port 8080 --file requests.txt
```

### ngrok

Use this option to make your _httplog_ server available over the public internet, e.g.

```bash
httplog --port 8080 --ngrok
```

With the above command the port `8080` will be exposed using the [ngrok](https://ngrok.com/) service.

### proxy-mode [Beta]

Use this option to make _httplog_ acting as a proxy, e.g.

```bash
httplog --port 8080 --proxy-mode localhost:8081
```

With this each incoming request at port `8080` will be forwarded to port `8081` too.
