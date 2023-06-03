import React from 'react';
import RoomStore from '../store/RoomStore';
import OneRoom from '../OneRoom/OneRoom';
import {observer} from 'mobx-react-lite'
import './RoomList.css'

const RoomList = observer(() => {
    return (
        <div className='allRooms'>
        {
            RoomStore.rooms.map((room, ind)=><OneRoom key={room.id}  index ={ind+1} room={room} />)
        }
        </div>
    );
});

export default RoomList;