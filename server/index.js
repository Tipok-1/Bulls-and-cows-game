const {wss, broadcastMessage} = require('./userInteraction/userInteraction');
const uuid = require('uuid').v4;
const RoomService = require('./RoomService/RoomService')


wss.on('connection', function connection(ws) {
    console.log('user connected')
    ws.id = uuid();
    ws.on('message', function(message) {
        message = JSON.parse(message);
        switch (message.event) {
            case'message':
            if(message.type === 'join') {
                ws.name = message.data.split(' ')[0];
            }
                mes={
                    event:'message',
                    from:ws.name,
                    data:message.data,
                    type: message.type,
                }
                broadcastMessage(mes);
                break;
            case 'createRoom':
                RoomService.createRoom(ws, message);
                break;
            case 'joinTheRoom':
                RoomService.joinTheRoom(ws, message);
                break;
            case 'leaveTheRoom':
                RoomService.leaveTheRoom(ws, message.roomID);
                break;
            case 'getAllRooms':
                RoomService.getAllRooms(ws);
                break;
            case 'makeMove':
                RoomService.makeMove(ws, message);
                break;
                
        }
    })
})



