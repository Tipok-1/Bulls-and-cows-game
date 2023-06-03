import React from 'react';
import './OneRoom.css'
import SocketStore from '../store/SocketStore';
import GameStore from '../store/GameStore'
import {observer} from 'mobx-react-lite'

const OneRoom = ({index,room}) => {
    return (
        <div className='OneRoom' onClick={()=> {
            if(!room.player1Name || !room.player2Name) {
                GameStore.joinedRoom = room;
                GameStore.joingRoom = true
            } else {
                GameStore.errorText = 'В комнате нет мест'
                setTimeout(()=>GameStore.errorText = '', 2000);
            }
            }}>
            {room.id ? room.roomName : ''} <br/>
            player 1: {room.player1 ? room.player1Name : 'Свободно'} <br/>
            player 2: {room.player2 ? room.player2Name : 'Свободно'}<br/>
        </div>
    );
};

export default OneRoom;