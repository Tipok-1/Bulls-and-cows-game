import React from 'react';
import {observer} from 'mobx-react-lite'
import GameStore from '../store/GameStore';
import Loader from '../Loader/Loader';
import SocketStore from '../store/SocketStore';
import './GameField.css'

const GameField = observer(() => {
    const [number, setNumber] = React.useState(1000);
    function myMove(e){
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
           const message = {
                event:'makeMove',
                roomID:GameStore.myRoom.id,
                number,
           }
           SocketStore.socket.send(JSON.stringify(message));
        }
        else{
            GameStore.GameInfo = 'Введите число с неповторяющимися цифрами';
        }
    }
    function numberBlur(e){
        let num = 0;
        if(e.target.value <= 9999 && e.target.value >=1000) {
            num = e.target.value 
        } 
        else if(e.target.value > 9999){num=9999}
        else if(e.target.value < 1000){num=1000}
        setNumber(num);
    }

    const pl = React.useMemo(()=>{
        return GameStore.myRoom.player1Number == 'XXXX' ? [{
            id:GameStore.myRoom.player2,
            name:GameStore.myRoom.player2Name,
            number:GameStore.myRoom.player2Number
        },{
            id:GameStore.myRoom.player1,
            name:GameStore.myRoom.player1Name,
            number:GameStore.myRoom.player1Number
        }]
        :
        [{
            id:GameStore.myRoom.player1,
            name:GameStore.myRoom.player1Name,
            number:GameStore.myRoom.player1Number
        },
        {
            id:GameStore.myRoom.player2,
            name:GameStore.myRoom.player2Name,
            number:GameStore.myRoom.player2Number
        },];
    },[GameStore.secondPlayerFound]);

    function exitGame(){
        const message ={
            event:'leaveTheRoom',
            roomID: GameStore.myRoom.id
        }
        SocketStore.socket.send(JSON.stringify(message));
    }
    return (
        
        <div className='GameField'>
             {GameStore.errorText ? <div className='errorWrap' style={
                {
                    position:'absolute',
                    fontSize:'40px',
                    color:'red',
                    width:'100%',
                    textAlign:'center'
                }
            }>{GameStore.errorText}</div> : null}
           { GameStore.secondPlayerFound ?
            <div style={{
                width:'100%',
                height:'100%',
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignContent:'center'
            }}>
                <div className='roomName'>Комната: {GameStore.myRoom.roomName}</div>
                <div style={{
                width:'100%',
                height:'80%',
                display:'flex'
                }}>
                    <div className='firstPlayerField'>
                        <div className='hiddenNumber'>
                            <div> Игрок {pl[0].name}</div>
                            <div>{pl[1].number}</div>
                        </div>
                        <div className='Attempts'>{GameStore.myAttemps}</div>
                    </div>
                    <div className='secondPlayerField'>
                        <div className='hiddenNumber'>
                            <div>Игрок {pl[1].name}</div>
                            <div>{pl[0].number}</div>
                        </div>
                        <div className='Attempts'>{GameStore.opponentAttemps}</div>
                    </div>
                </div>
                <div className='infoBlock'>{GameStore.GameInfo}</div>
                <div style={{
                    width:'60%',
                    margin:'auto',
                    display:'flex',
                    justifyContent:'space-around'
                }}>
                    <input 
                        onBlur={e=>numberBlur(e)} 
                        className='changeInput' 
                        type='number' 
                        min={1000} 
                        max={9999}
                        value={number}
                        onChange={(e)=>setNumber(e.target.value)}></input>
                    <button className='sendAttempt' disabled={!GameStore.makeMove} onClick={e=>myMove(e)}>Попытаться</button>
                </div>
            </div>
            :
            <Loader text={'Ожидание второго игрока'} height={80} width={80}/>
            }
            <div className='Exit' onClick = {exitGame}> +</div>
        </div>
        
    );
});

export default GameField;