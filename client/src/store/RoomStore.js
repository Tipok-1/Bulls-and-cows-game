import {makeAutoObservable} from 'mobx'

class RoomStore{
    rooms = []
    constructor(){
        makeAutoObservable(this);
    }
    setAllRoms(r){
        this.rooms = r;
    }
    addRoom(room){
        this.rooms.push(room);
    }

    removeRoom(id){
        this.rooms = this.rooms.filter(r=>r.id != id);
    }
    changeRoom(id, newRoom) {
        this.rooms = this.rooms.map(r=> r.id == id ? newRoom : r);
    }
}

export default new RoomStore();