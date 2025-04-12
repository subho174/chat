import React, { useEffect, useState, useMemo, useContext } from "react";
import Context from "./Context";
import { io } from "socket.io-client";

const ChatInterface = () => {
  const { isConnected, userData } = useContext(Context);
  const [socketId, setsocketId] = useState();
  const socket = useMemo(
    () => io("http://localhost:4002", { withCredentials: true }),
    []
  );
  const [message, setmessage] = useState();

  useEffect(() => {
    socket.on("chat", (m) => {
      console.log(m);
    });
    return () => {
      socket.disconnect();
    };
  }, [isConnected]);

  const submit = (e) => {
    e.preventDefault();
    socket.emit("chat", { message, socketId });
  };
  const changeValue = (e) => {
    if (e.target.name === "message") setmessage(e.target.value);
    else setsocketId(e.target.value);
  };

  return (
    <div className="basis-[80%] p-24 rounded-xl bg-gray-200">
      <div className="bg-white h-full flex flex-col justify-between">
        {/* <header className="flex p-2 items-center">
          <div className="h-8 w-8 flex justify-center items-center rounded-[50%] bg-black text-white">
            {userData.username[0].toUpperCase()}
          </div>
          <div>
            <p>{userData.username}</p>
          </div>
        </header> */}
        <section className="border-[1px_0] border-gray-300 h-full"></section>
        <footer className="p-2">
          <form onSubmit={submit} onChange={changeValue} className="flex">
            <label htmlFor="file-attachment" className="style">
              <i className="fa-solid fa-paperclip"></i>
            </label>
            <input type="file" id="file-attachment" className="hidden" />

            <label htmlFor="file-image" className="style">
              <i className="fa-solid fa-image"></i>
            </label>
            <input
              type="file"
              id="file-image"
              accept="image/*"
              className="hidden"
            />
            <input type="text" name="message" className="w-full" required />
            <input type="text" placeholder="socket id" required />
            <button type="submit" className="style">
              <i className="fa-brands fa-telegram"></i>
            </button>
          </form>
        </footer>
      </div>
    </div>
    // <div className="bg-gray-100 h-screen flex flex-col">
    //   <div className="container mx-auto max-w-4xl flex-1 flex flex-col p-4">
    //     <header className="bg-white rounded-t-lg shadow-md p-4 mb-2">
    //       <h1 className="text-2xl font-bold text-gray-800">Chat App</h1>
    //       <p className="text-gray-500 text-sm">
    //         A Vite + JavaScript + Tailwind CSS application
    //       </p>
    //     </header>

    //     <main className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
    //       <div
    //         id="chat-messages"
    //         className="flex-1 p-4 overflow-y-auto space-y-4"
    //       ></div>

    //       <div className="border-t p-4 bg-gray-50">
    //         <form id="message-form" className="flex gap-2">
    //           <input
    //             type="text"
    //             id="message-input"
    //             className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    //             placeholder="Type your message..."
    //             autocomplete="off"
    //           />
    //           <button
    //             type="submit"
    //             className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    //           >
    //             Send
    //           </button>
    //         </form>
    //       </div>
    //     </main>
    //   </div>
    // </div>
  );
};

export default ChatInterface;
