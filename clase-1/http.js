const http = require('http')
const { findAviablePort } = require('./free-port.js')

const server = http.createServer((req, res) => {
    console.log('request received')
    res.end('Hello Ana')
})

findAviablePort(5432).then(port => {
    server.listen(port, () => {
        console.log(`server listening on port http://localhost:${port}`)
    })
})
