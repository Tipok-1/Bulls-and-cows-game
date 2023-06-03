import React, { useEffect, useRef } from 'react';
import SocketStore from '../store/SocketStore';
import Menu from '../Menu/Menu';
import {observer} from 'mobx-react-lite'
import Registration from '../Registration/Registration';

const WebSock = observer(() => {
    const [registered, setRegistered] = React.useState(false);
    return (
        (SocketStore.connected) ?
        <div>
             {!registered ?
                <Registration setRegistered={setRegistered}/>
                :<Menu/>
            }
        </div>
        : <div>
            Соединение не установлено
         </div>
        
    );
});

export default WebSock;