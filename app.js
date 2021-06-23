const http = require('http');
const server = require('./server');

const port = process.env.PORT || 5000;

const serv = http.createServer(server);

serv.listen(port);
