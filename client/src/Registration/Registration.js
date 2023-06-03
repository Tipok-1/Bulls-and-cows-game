import React from 'react';
import background from '../assets/background.jpg'
import './Registration.css'
import SocketStore from '../store/SocketStore';

const Registration = ({setRegistered}) => {
    const [name, setN] = React.useState('');
    function setName(e){
        const message ={
            event:'message',
            type: 'join',
            data:(name.length > 0 ? name : 'guest')+ ' присоеденился',
        }
        SocketStore.socket.send(JSON.stringify(message));
        setRegistered(true);
    }
    return (
        <div className = 'Registration' style ={{
            backgroundImage:`url(${background})`
        }}>
            <div className='registrationForm'>
                <input placeholder='Введите имя' value={name} onChange={e=>setN(e.target.value)} className='playerNameInput'></input>
                <button className='buttonRegistration' onClick={e=>setName(e)}>Далее</button>
            </div>
        </div>
    );
};

export default Registration;