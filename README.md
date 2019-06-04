# http-log #

Simple node app to log http request right into your console.

## How it works ##

Run `httplog --help` to see how it works.

Use the following command to start a local http server running at port 8080.

```bash
httplog 8080
```

You can now redirect your traffic to the started http server. Your request data will dumped into you console.

### Options ###

- `--ngrok`: Use the ngrok option to make you http log server availavble voer the public internet. It will automatically expose you port the the ngrok service.
