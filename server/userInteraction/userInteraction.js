const ws = require('ws');

const PORT = 5000;

const wss = new ws.Server({
    port:PORT,
}, console.log(`Server started on ${PORT}`))

module.exports = {
    wss,
    broadcastMessage(message) {
        wss.clients.forEach(client=> {
            client.send(JSON.stringify(message));
        })
    },
    findOne(id){
       return [...wss.clients].find(w=>w.id == id);
    }

    
}