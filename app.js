const http = require('http');
const server = require('./server');

const port = process.env.SERVER_URL || 5000;

const serv = http.createServer(server);

serv.listen(port);
