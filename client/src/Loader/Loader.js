import React from 'react';
import './Loader.css'

const Loader = ({text, height, width}) => {
    return (
        <div className='Loader'>
            <h1 style={{
                color:'rgb(210,210,210)'
            }}>{text}</h1>
            <div className='loadCircle'  style={{
            height,
            width
        }}></div>
        </div>
    );
};

export default Loader;