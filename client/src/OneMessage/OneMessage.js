import React from 'react';
import './OneMessage.css'

const OneMessage = ({from, data, type, ind}) => {
    return (
        <div className = {type==='message' ? 'OneMessage' :'Join'}
        style={{
            animation: ind  ? 'show .5s 1' : 'none',
        }}>
            {data}
            {type==='message'?
            <div className='from'>От: {from}</div>
            : null
            }
        </div>
    );
};

export default OneMessage;