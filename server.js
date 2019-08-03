const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function(socket) {
    socket.on('NovoCliente', function(){
        if(clients < 2){
            if(clients == 1){
                this.emit('CreatePeer')
            }
        }
        else{
            this.emit('SessionActive')
            clients++
        }
    })

    socket.on('Oferta', SendOffer)
    socket.on('Resposta', SendReposta)
    socket.on('Desconectado', Disconnect)
})

function Disconnect(){
    if(clients > 0){
        clients--
    }
}

function SendOffer(offer){
    this.broadcast.emit("BackOffer", offer)
}

function SendResposta(data){
    this.broadcast.emit("BackResposta", data)
}

http.listen(port, () => console.log(`Server na porta ${port}`))