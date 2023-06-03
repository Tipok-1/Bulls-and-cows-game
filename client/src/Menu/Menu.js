import React from 'react';
import Chat from '../Chat/Chat';
import './Menu.css'
import Rooms from '../Rooms/Rooms';
import background from '../assets/background.jpg'

const Menu = () => {
    return (
        <div className='Menu' style ={{
            backgroundImage:`url(${background})`
        }}>
            <div className='ChatDiv'><Chat/></div>
            <div className='RoomsDiv'><Rooms/></div>
        </div>
    );
};

export default Menu;