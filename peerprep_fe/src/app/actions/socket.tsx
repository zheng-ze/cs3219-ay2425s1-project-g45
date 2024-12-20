import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../contexts/auth-context";

export const useSocket = () => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const gatewayServiceURL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_GATEWAY_SERVICE_URL
      : `http://localhost:5003`;

  useEffect(() => {
    // Initialize the WebSocket connection to the API gateway
    const socketConnection = io(gatewayServiceURL, {
      auth: {
        token: token,
      },
      transports: ["websocket"],
      secure: true,
    });

    // Handle incoming messages
    socketConnection.on("serverToClient", (data) => {
      setMessage(data);
    });

    // Set the socket
    setSocket(socketConnection);

    // Clean up the connection when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const sendMessage = (message: unknown) => {
    socket?.emit("clientToServer", message);
  };

  return { socket, message, sendMessage };
};
