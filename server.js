const express = require('express')
const app = express()
const http = require('http').Server(app)

const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))

http.listen(port, () => console.log(`Server na porta ${port}`))