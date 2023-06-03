import React from 'react';
import './CreateRoom.css'
import SocketStore from '../store/SocketStore';

import GameStore from '../store/GameStore';

const  CreateRoom = ({setCreated}) => {
    const [alert, setAlert] = React.useState('');
    const [roomName, setRoomName] = React.useState('');
    const [number, setNumber] = React.useState(1000);

    function numberBlur(e){
        let num = 0;
        if(e.target.value <= 9999 && e.target.value >=1000) {
            num = e.target.value 
        } 
        else if(e.target.value > 9999){num=9999}
        else if(e.target.value < 1000){num=1000}
        setNumber(num);
    }

    function createRoom(e) {
        if(roomName) {
        const nums = String(number).split('');
        const checkUniq= nums.reduce((cur, num, ind, arr)=>{
            for(let i = ind+1; i< arr.length; i++) {
                if(+num == +arr[i])  {
                    cur++;
                }
            }
            return cur
        },0)

        if(!checkUniq) {
                e.target.disabled = true;
                const message ={
                    event:'createRoom',
                    roomName,
                    playerNumber: number,
                }

                GameStore.loaderText = 'Создание комнаты';
                GameStore.Loader = true;
                e.target.disabled = false;
                setCreated(false);
                SocketStore.socket.send(JSON.stringify(message));
            }
            else{
                setAlert('Введите число с неповторяющимися цифрами')
            }
        }
    }
    return (
        <div style={{
            width:'100%',
            height:'100%',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }}>
            <form className='CreateRoomForm' onSubmit={e=>e.preventDefault()}>
                <h1 style={{
                    textAlign:'center',
                    color:'white'
                }}>Создание комнаты</h1>
                <div className='InputWrap'>Имя комнаты: <input 
                    className='RoomName'
                    required
                    maxLength={30}
                    placeholder='Введите имя комнаты(максимум 30 символов)'
                    value={roomName}
                    onChange={e=>setRoomName(e.target.value)}></input></div>
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
                <button 
                    className='ButtonCreateRoom'
                    onClick={e=>createRoom(e)}
                >Создать</button>
            </form>
        </div>
    );
};

export default CreateRoom;