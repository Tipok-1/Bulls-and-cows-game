import {makeAutoObservable} from 'mobx'
import RoomStore from './RoomStore';
import MessageStore from './MessageStore';
import GameStore from './GameStore';

class SocketStore{
    constructor(){
        makeAutoObservable(this);
        console.log('start');
        this.connect();
    }
    socket = new WebSocket('ws://localhost:5000');
    connected = false;

    connect(){
        this.socket.onopen = ()=>{
            console.log('Соединение открыто');
            this.connected = true;
            this.socket.send(JSON.stringify({event:'getAllRooms'}));
        }

        this.socket.onmessage = (m)=>{
            const message = JSON.parse(m.data);
            switch(message.event) {
                case 'getAllRooms':
                    RoomStore.setAllRoms(message.rooms);
                    break;
                case 'createRoom':
                    RoomStore.addRoom(message.room);
                    break;
                case 'changeRoom':
                    RoomStore.changeRoom(message.room.id, message.room);
                    break;
                case 'message':
                    console.log(message)
                    MessageStore.addMessage({
                        from: message.from,
                        data:message.data,
                        type: message.type
                    })
                    break;
                case 'joinTheRoom':
                    GameStore.joinTheRoom(message)
                    break;
                case 'deleteRoom':
                    RoomStore.removeRoom(message.room.id);
                    break;
                case 'secondPlayerJoined':
                    GameStore.myRoom = message.room;
                    setTimeout( ()=>GameStore.secondPlayerFound = true);
                    break;
                case 'error':
                    GameStore.Loader = false;
                    GameStore.errorText = message.error;
                    setTimeout(()=>GameStore.errorText = '', 2000);
                    break;
                case 'leaveTheRoom':
                    GameStore.leaveTheRoom();
                    break;
                case 'secondPlayerLeave':
                    GameStore.errorText = 'Второй игрок покинул комнату';
                    setTimeout(()=>GameStore.errorText = '', 2000);
                    GameStore.GameInfo = '';
                    GameStore.myAttemps='';
                    GameStore.opponentAttemps='';
                    GameStore.myRoom = {id:GameStore.myRoom.id};
                    GameStore.secondPlayerFound=false;
                    break;
                case 'makeMove':
                    GameStore.makeMove = true;
                    GameStore.GameInfo = message.info;
                    break;
                case 'waitMove':
                    GameStore.makeMove = false;
                    GameStore.GameInfo = message.info;
                    break;
                case 'yourMove':
                    GameStore.myAttemps += '\n';
                    GameStore.myAttemps += message.info;
                    break;
                case 'opponentMove':
                    GameStore.opponentAttemps += '\n';
                    GameStore.opponentAttemps += message.info;
                    break;
                case 'Win':
                    GameStore.myAttemps += '\n';
                    GameStore.makeMove = false;
                    GameStore.myAttemps += message.info;
                    break;
                case 'Loze':
                    GameStore.myAttemps += '\n';
                    GameStore.makeMove = false;
                    GameStore.myAttemps += message.info;
                    break;
            }
        }

        this.socket.onclose = ()=>{
            console.log('Соединение закрыто');
            this.connected = false;
            if(GameStore.inRoom) {
                const message ={
                    event:'leaveTheRoom',
                    roomID: GameStore.myRoom.id
                }
                this.socket.send(JSON.stringify(message));
            }
        }

        this.socket.onerror = (e)=>{
            console.log(e.message);
        }
    }
}

export default new SocketStore();