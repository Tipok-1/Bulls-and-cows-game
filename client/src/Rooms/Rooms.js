import React from 'react';
import './Rooms.css'
import CreateRoom from '../CreateRoom/CreateRoom';
import RoomList from '../RoomList/RoomList';
import GameStore from '../store/GameStore';
import GameField from '../GameField/GameField';
import {observer} from 'mobx-react-lite'
import Loader from '../Loader/Loader';
import JoingRoom from '../JoingRoom/JoingRoom';

const Rooms = observer(() => {
    const [created, setCreated] = React.useState(false);
    return (
        (!GameStore.inRoom) ?
        <div className='Rooms'>
            
            {GameStore.errorText ? <div className='errorWrap' style={
                {
                    position:'absolute',
                    fontSize:'40px',
                    color:'red'
                }
            }>{GameStore.errorText}</div> : null}

            {!(GameStore.joingRoom) ?
            <div style={{
                        height:'100%',
                        width:'100%'
                    }}>
                {(!GameStore.Loader) ?
                    <div style={{
                        height:'100%',
                        width:'100%'
                    }}>
                        {(!created) ?
                            <div>
                                <h1 className='title'>Все комнаты</h1>
                                <RoomList/>
                            </div>
                            :<CreateRoom setCreated={setCreated}></CreateRoom>
                        }
                        <div className='createRoom'onClick={e=>{
                            e.target.classList.toggle('Rotate');
                            setCreated(!created);
                        }}>+</div> 
                    </div>
                :<Loader text={GameStore.loaderText} height={80} width={80}/>}
            </div>
            : <JoingRoom/>}
        </div> 
        :<GameField/>
    );
});

export default Rooms;
