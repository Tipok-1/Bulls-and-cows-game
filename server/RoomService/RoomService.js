const uuid = require('uuid').v4;
const {broadcastMessage, findOne} = require('../userInteraction/userInteraction')

class RoomService{

    ALL_ROOMS = [];
    createRoom(ws, message) {
        const room ={
            id:uuid(),
            roomName:message.roomName,
            player1:ws.id,
            player1Name:ws.name,
            player1Number:message.playerNumber,
            player2: null,
            player2Name:null,
            player2Number:null,
        }
        
        this.ALL_ROOMS.push(room);
        const mes = {
            event: 'joinTheRoom',
            room:{id:room.id}
        }
        ws.send(JSON.stringify(mes));
        const hideNumberRoom = this.hideOpponentNumber(room, 'player1Number');
        this.RoomsChanged('createRoom', hideNumberRoom);
    }

    hideOpponentNumber(room, hideProperty){
        const r = {...room};
        r[String(hideProperty)] = 'XXXX';
        return r;
    }

    joinTheRoom(ws, message) {
        console.log('join');
        const room = this.ALL_ROOMS.find(room=>room.id == message.roomID);
        const errorMessage = {
            event: 'error',
            error:'',
        }
        
        if(!room){
            errorMessage.error = 'Комната не найдена';
            return ws.send(JSON.stringify(errorMessage));
        };
        
        if(room.player1 && room.player2){
            errorMessage.error = 'В комнате нет мест';
            return ws.send(JSON.stringify(errorMessage));
        };
        const mes1 = {
            event: 'joinTheRoom',
            room:{id:room.id}
        }
        
        if(room.player1) {
            room.player2 = ws.id;
            room.player2Name = ws.name;
            room.player2Number = message.playerNumber
            ws.send(JSON.stringify(mes1));

            const hideFirstNumber = this.hideOpponentNumber(room, 'player1Number');
            const mes2 = {
                event: 'secondPlayerJoined',
                room:hideFirstNumber,
            }
            ws.send(JSON.stringify(mes2));

            const hideSecondNumber = this.hideOpponentNumber(room, 'player2Number');
            mes2.room = hideSecondNumber;
            if(findOne(room.player1))
                findOne(room.player1).send(JSON.stringify(mes2))
            
        } else if(room.player2) {
            room.player1 = ws.id;
            room.player1Name = ws.name;
            room.player1Number = message.playerNumber
            ws.send(JSON.stringify(mes1));

            const hideSecondNumber = this.hideOpponentNumber(room, 'player2Number');
            const mes2 = {
                event: 'secondPlayerJoined',
                room:hideSecondNumber,
            }
            ws.send(JSON.stringify(mes2));

            const hideFirstNumber = this.hideOpponentNumber(room, 'player1Number');
            mes2.room = hideFirstNumber;
            if(findOne(room.player2))
                findOne(room.player2).send(JSON.stringify(mes2))

        }
        if(errorMessage.error)
            ws.send(JSON.stringify(errorMessage));
        if(room.player1 && room.player2) {
            this.startGame(room);
        }
        this.RoomsChanged('changeRoom', room);
    }
    startGame(room){
        const pl1 = findOne(room.player1);
        pl1.send(JSON.stringify({
            event:'makeMove',
            info:'Ваш ход'
        }))
        const pl2 = findOne(room.player2);
        pl2.send(JSON.stringify({
            event:'waitMove',
            info:'Ход игрока ' + room.player1Name
        }))
    }
    makeMove(ws, message){
        const room = this.ALL_ROOMS.find(room=>room.id == message.roomID);
        const pl = ws.id == room.player1 || ws.id == room.player2;
        if(room.player1 && room.player2 && pl) {
            const opponent = ws.id == room.player1 ? room.player2: room.player1;

            const num = ws.id == room.player1 ? room.player2Number : room.player1Number
            if(message.number == num) {
                const winMes ={
                    event:'Win',
                    info:'Победа, вы отгадали число оппонента - ' + num
                }
                ws.send(JSON.stringify(winMes));
                const lozeMes = {
                    event:'Loze',
                    info:'Поражение, оппонент отгадал ваше число. Число оппонента - ' + (ws.id == room.player1 ? room.player1Number : room.player2Number)
                }
                findOne(opponent).send(JSON.stringify(lozeMes));
            } else {
                let hiddenNumber =  num.split('');
                let moveNumber = message.number.split('');

                let cows = 0;
                let bulls = 0;

                moveNumber.forEach((n, i) => {
                    if(moveNumber[i] == hiddenNumber[i]) {
                        bulls++;
                    } else {
                        if(hiddenNumber.find(num=> num==n)) {
                            cows++;
                        }
                    }
                });

                const mes1 = {
                    event:'yourMove',
                    info:`Число ${message.number} --- ${cows}-коров ${bulls}-быков`
                }
                const mes2 = {
                    event:'waitMove',
                    info:'Ход игрока ' + (ws.id == room.player1 ? room.player2Name : room.player1Name)
                }
                ws.send(JSON.stringify(mes1));
                ws.send(JSON.stringify(mes2));

                const mes3={
                    event:'opponentMove',
                    info:`Число ${message.number} --- ${cows}-коров ${bulls}-быков`
                }
                const mes4={
                    event:'makeMove',
                    info:'Ваш ход'
                }
                findOne(opponent).send(JSON.stringify(mes3));
                findOne(opponent).send(JSON.stringify(mes4));


            }

        }
    }
    leaveTheRoom(ws, id){
        const room = this.ALL_ROOMS.find(room=>room.id == id);
        let secondPlayer = null;  
        if(room.player1 == ws.id) {
            
            room.player1 = null;
            room.player1Name = null;
            room.player1Number  = null;
            secondPlayer = room.player2;
        } else if(room.player2 == ws.id) {
            room.player2 = null;
            room.player2Name = null;
            room.player2Number  = null;
            secondPlayer = room.player1;
        }
    

        if(!room.player1 && !room.player2) {
            this.ALL_ROOMS = this.ALL_ROOMS.filter(r=> r.id != id);
            const mes = {
                event:'leaveTheRoom',
            }
            ws.send(JSON.stringify(mes));
            this.RoomsChanged('deleteRoom', room);
        } else{
            const mes = {
                event:'leaveTheRoom',
            }
            
            ws.send(JSON.stringify(mes));
            const mes2 = {
                event:'secondPlayerLeave'
            }
            if(secondPlayer)
                findOne(secondPlayer).send(JSON.stringify(mes2))
            this.RoomsChanged('changeRoom', room);
        }
    }

    getAllRooms(ws){
         const message = {
            event:'getAllRooms',
            rooms:this.ALL_ROOMS,
        }
        
        ws.send(JSON.stringify(message));
    }

    RoomsChanged(event, room){
        const message = {
            event,
            room
        }
        broadcastMessage(message);
    }
}

module.exports = new RoomService();