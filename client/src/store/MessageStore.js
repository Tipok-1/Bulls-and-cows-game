import {makeAutoObservable} from 'mobx'

class MessageStore{
    constructor(){
        makeAutoObservable(this);
    }
    messages = []
    addMessage(message){
        this.messages.push(message);
    }
}

export default new MessageStore();