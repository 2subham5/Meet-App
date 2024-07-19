import React, {useMemo} from "react";
import {io} from "socket.io-client";

const SocketContext = React.createContext(null);
export const useSocket = ()=>{
    return React.useContext(SocketContext);
};
export const SocketProvider = (props)=>{
    const socket = useMemo(()=>
        io ('https://vercel.com/2subham5s-projects/meet-backend/G9a33FzDGXhdibDRLJwpbvYpu68m'),
    [])
    return (
        <SocketContext.Provider value={{socket}}>
            {props.children}
        </SocketContext.Provider>
    )
}