import { createContext, React, useState, useEffect } from "react";
import { io } from "socket.io-client";

const Context = createContext();
export const Provider = ({ children }) => {
  const [isConnected, setisConnected] = useState(false);
const [userData, setuserData] = useState();
  

  return (
    <Context.Provider value={{ isConnected,userData,setuserData }}>
      {children}
    </Context.Provider>
  );
};
export default Context;
