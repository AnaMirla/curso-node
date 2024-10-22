const http = require('http');
const dittoJSON = require('./pokemon/ditto');

const processRequest = (req, res) => {
    const { method, url } = req;

    switch (method) {
        case 'GET':
            switch (url) {
                case '/pokemon/ditto': {
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify(dittoJSON));
                }
                default: {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    return res.end('404 Not Found');
                }
            }
        case 'POST': {
            switch (url) {
                case '/pokemon/': {
                    let body = '';

                    // Escuchar el evento 'data'
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    // Escuchar el final de la recepción de datos
                    req.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify(data));
                        } catch (error) {
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            return res.end(JSON.stringify({ error: 'Invalid JSON' }));
                        }
                    });
                    break;
                }
                default: {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    return res.end('404 Not Found');
                }
            }
        }
        default: {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'text/html');
            return res.end(`${method} is not allowed`);
        }
    }
};

const server = http.createServer(processRequest);

server.listen(5432, () => {
    console.log('Server listening on http://localhost:5432');
});
