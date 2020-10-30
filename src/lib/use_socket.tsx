import { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

// @ts-ignore
const SocketContext = createContext<UseAuth>();

function SocketProvider(props: any) {
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", function() {
      socket.emit("events", { test: "test" });

      socket.emit("identity", 0, function(response: any) {
        console.log("Identity:", response);
      });
    });

    socket.on("events", function(data: any) {
      console.log("event", data);
    });

    socket.on("exception", function(data: any) {
      console.log("exception", data);
    });

    socket.on("disconnect", function() {
      console.log("Disconnected");
    });

    return () => {
      socket.disconnect()
    };
  }, []);

  return <SocketContext.Provider value={{
  }} {...props} />;
}

type UseSocket = {
}

const useSocket = () => useContext<UseSocket>(SocketContext);

export { SocketProvider, useSocket };
