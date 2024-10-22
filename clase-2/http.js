const http = require('http');
const { findAviablePort } = require('./free-port.js');

const processRequest = (req, res) => {
    if (req.url === '/') {
        res.statusCode = 200; //ok
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Welcome to my Home Page | Ana Mirla</h1>');
    } else if (req.url === '/contacto') {
        res.statusCode = 200; //ok
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Welcome to my Contact Page | Ana Mirla</h1>');
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>404 - Page Not Found</h1>');
    }
    console.log('request received', req.url);
};


const server = http.createServer(processRequest);

findAviablePort(5432).then(port => {
    server.listen(port, () => {
        console.log(`server listening on port http://localhost:${port}`);
    });
});
