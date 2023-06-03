import {makeAutoObservable} from 'mobx'

class GameStore{
    constructor(){
        makeAutoObservable(this);
    }
    inRoom = false;
    secondPlayerFound = false;
    loaderText='';
    errorText='';
    Loader = false;
    joingRoom = false;
    joinedRoom={}
    myRoom={};
    numberAttempts = [];
    makeMove=false;
    GameInfo = '';
    myAttemps = '';
    opponentAttemps = '';
    leaveTheRoom(){
        this.secondPlayerFound=false;
        this.inRoom = false;
        this.Loader = false;
        this.joingRoom = false;
        this.joinedRoom = {};
        this.myRoom = {};
        this.makeMove = false;
        this.GameInfo = '';
        this.myAttemps='';
        this.opponentAttemps='';
    }
    joinTheRoom(message){
        this.Loader = false;
        this.loaderText = '';
        this.inRoom = true;
        this.myRoom = message.room;
    }
}

export default new GameStore();