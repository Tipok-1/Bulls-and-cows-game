import React from 'react';
import './Chat.css'
import sendMessage from '../assets/send_message.png'
import SocketStore from '../store/SocketStore';
import MessageList from '../MessageList/MessageList';

const Chat = () => {
    const [text, setText] = React.useState('');
    function sMessage(){
        if(text) {
            const message ={
                event:'message',
                type: 'message',
                data:text,
            }
            SocketStore.socket.send(JSON.stringify(message));
            setText('');
        }
    }
    return (
        <div className='Chat'>
            <MessageList width={90} height={90}/>
            <div className='Message'>
                <input className='Input' value={text} onChange={e=>setText(e.target.value)} placeholder='Введите сообщение'></input>
                <div className='Send' style={{
                    backgroundImage:`url(${sendMessage})`
                }} onClick={sMessage}></div>
            </div>
        </div>
    );
};

export default Chat;