import React from 'react';
import {v4 as uuid} from "uuid";
import MessageStore from '../store/MessageStore';
import OneMessage from '../OneMessage/OneMessage';
import {observer} from 'mobx-react-lite'
import './MessageList.css'

const MessageList = observer(({width, height}) => {
    return (
        <div className = 'MessageList' style={{
            width:width+'%',
            height:height+'%',
            flexDirection: 'column-reverse',
            margin:'30px 0 0 0',
            display:'flex',
            alignItems:'flex-end',
            
        }}>
            {MessageStore.messages.map((mes, ind, allMes)=><OneMessage key={uuid()} from={mes.from} data={mes.data} type={mes.type} ind={ind == allMes.length -1 ? 1 : 0}/>)}
        </div>
    );
});

export default MessageList;