# httplog #

Simple node app to log http request right into your console.

## Installation ##

Run `npm install -g @floriandorau/httplog` to install is globally on your system.

After that run `httplog --help` to see how it works.

## How it works ##

Use the following command to start a local http server running at port 8080.

```bash
httplog 8080
```

You can now redirect your traffic to the started http server. Your request data will dumped into you console.

### Options ###

#### ngrok ####

Use this option to make your _httplog_ server available over the public internet, e.g.

```bash
httplog 8080 --ngrok
```

With the above command the port `8080` will be exposed using the [ngrok](https://ngrok.com/) service.

#### proxy-mode [Beta] #####

Use this option to make _httplog_ acting as a proxy, e.g.

```bash
httplog 8080 --proxy-mode localhost:8081
```

With this each incoming request at port `8080` will be forwarded to port `8081` too.
