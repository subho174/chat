import { useState,useEffect } from 'react'
import './App.css'
import {io} from 'socket.io-client'
import Login from './Login';


function App() {
  // const socket = io('http://localhost:4002',{withCredentials: true});
  // useEffect(() => {
  //   const socket = io('http://localhost:4002',{withCredentials: true});
  //   socket.on('chat', (m) => {
  //     console.log(m);
  //   })
  //   return () => {
  //       socket.disconnect();
  //   }
  // }, [])
  // socket.on('chat', (m) => {
  //   console.log(m);
  // })
  
  return (
    <>
      <Login />
    </>
  )
}

export default App
