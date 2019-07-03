# Run
`npm install`

`npm run --config=\<name of file in config folder\>`

e.g. 

`netcat -l 127.0.0.1 1337`

`npm start --config=file-to-tcp.json`

# Developer comments
I have used Node.js LTS (10.16.0). It has a really convenient `pipeline` part of `stream` module that allows
to avoid backpressuring and to handle errors while piping streams.

I have tried to split the application into several layers:

1. Service layer if responsible for starting the application and connecting to data sources, e.g. TCP

2. Transport layer orchestrates connections

3. Controller layer is responsible for data processing and is implemented for logs transforming

As todos I can mention following things:

* Transport layer improvements:
    * reconnection policy must be implemented for TcpSource class.
    * a file watching policy should be implementated to allow to check if a file is changed to provide new log lines.
* Controller improvements:
    * parsing algorithm is primitive and can be optimized.
    * rfc5424 parsing is not perfect for Structured Data.
* Add unit test coverage. 
* Extend configuration file with more parameters (e.g. output format)
