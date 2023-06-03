import React from 'react';
import './JoingRoom.css'
import GameStore from '../store/GameStore';
import SocketStore from '../store/SocketStore';

const JoingRoom = () => {
    const [number, setNumber] = React.useState(1000);
    const [alert, setAlert] = React.useState('');
    function numberBlur(e){
        let num = 0;
        if(e.target.value <= 9999 && e.target.value >=1000) {
            num = e.target.value 
        } 
        else if(e.target.value > 9999){num=9999}
        else if(e.target.value < 1000){num=1000}
        setNumber(num);
    }
    
    function joinTheRoom(e){
        const nums = String(number).split('');
        const checkUniq= nums.reduce((cur, num, ind, arr)=>{
            for(let i = ind+1; i< arr.length; i++) {
                if(+num == +arr[i])  {
                    console.log('tru')
                    cur++;
                }
            }
            return cur
        },0)
        if(!checkUniq) {
            console.log('iD ' +  GameStore.joinedRoom.id)
           e.target.disabled = true;
           GameStore.joingRoom = false;
           GameStore.loaderText = 'Присоединение к комнате';
           GameStore.Loader = true;
           const message ={
                event:'joinTheRoom',
                roomID: GameStore.joinedRoom.id,
                playerNumber:number
            }
            SocketStore.socket.send(JSON.stringify(message));
        }
        else{
            setAlert('Введите число с неповторяющимися цифрами')
        }
    }
    return (
        <div className='JoingRoom'>
            
                <div className='title' style={{
                    fontSize:'30px',
                    paddingBottom:'20px',
                }}>{GameStore.joinedRoom.roomName}</div>
                <div style={{
                width:'500px',
                height:'300px',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-around'
            }}>
                <div className='InputWrap'>Загадайте четырёхзначное число с неповторяющимися цифрами<input 
                        className='Number' 
                        min='1000' 
                        max='9999' 
                        type='number'
                        value={number}
                        onChange={(e)=>setNumber(e.target.value)}
                        onBlur={numberBlur}></input>
                        </div>
                    <div className='Alert'>{alert} </div>
                    <button className='joinRoomButton' onClick={e=>joinTheRoom(e)}>Присоединится к комнате</button>
                    <div className='createRoom Rotate' onClick={()=>GameStore.joingRoom = false}>+</div> 
                </div>
        </div>
    );
};

export default JoingRoom;