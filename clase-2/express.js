const express = require("express");
const app = express();

const PORT = process.env.PORT ?? 5432;

app.get('/pokemon/ditto', (req, res) => {
    res.send('Home Page')
});

app.post('/pokemon/ditto', (req, res) => {
    let body = '';

    // Escuchar el evento 'data'
    req.on('data', chunk => {
        body += chunk.toString();
    });

    // Escuchar el final de la recepción de datos
    req.on('end', () => {
        const data = JSON.parse(body);
        data.timestam = Date.now()
        res.status(201).json(data)
    });
});

app.use((req,res) => {
    res.status(404).send('404 - Not Found')
});

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}/pokemon/ditto`)
});