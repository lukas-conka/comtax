let Peer = require('simple-peer')
//let socket = io()
const video = document.querySelector('video')
let client = {}

navigator.mediaDevices.getUserMedia({video:true, audio:true})
.then(stream =>{
    socket.emit('NovoCliente')
    video.srcObject = stream
    video.play()

    function InitPeer(type){
        let peer = new Peer({initiator: (type == "init") ? true: false, stream: stream, trickle: false})
        peer.on('stream', function(stream){
            CreateVideo(stream)
        })
        peer.on('close', function(){
            document.getElementById("peerVideo").remove();
            peer.destroy()
        })

        return peer
    }

    function MakePeer(){
        client.gotAnswer = false
        let peer = InitPeer('init')
        peer.on('signal', function(data){
            if(!client.gotResposta){
                socket.emit('Oferta', data)
            }
        })
        client.peer = peer
    }

    function FrontResposta(oferta){
        let peer = InitPeer('noInit')
        peer.on('signal', (data) => {
            socket.emit('Resposta', data)
        })
        peer.signal(oferta)
    }

    function SignalResposta(resposta){
        client.gotResposta = true
        let peer = client.peer
        peer.signal(resposta)

    }

    function CreateVideo(stream){
        let video  = document.createElement('video')
        video.id = 'peerVideo'
        video.srcObject = stream
        video.class="embed-responsive-item"
        document.querySelector("#peerDiv").appendChild(video)
    }

    function SessionActive(){
        document.write('Sessão Ativa!. Por favor volte mais tarde.')
    }

    socket.on('BackOffer', FrontResposta)
    socket.on('BackResposta', SignalResposta)
    socket.on('SessionActive', SessionActive)
    socket.on('CreatePeer', MakePeer)

})
.catch(err =>{
document.write(err)
})