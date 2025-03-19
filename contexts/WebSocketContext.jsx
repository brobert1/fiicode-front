import { createContext, useContext, useEffect, useState, useRef } from "react";
import { whoami } from "@functions";
import { store } from "@auth";

const WebSocketContext = createContext({
  onlineUsers: new Set(),
  isConnected: false,
});

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const heartbeatInterval = useRef(null);
  const me = whoami();

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    // Clean up function for closing socket and clearing intervals
    const cleanupSocket = () => {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }

      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
    };

    // Only connect if we have a user and token
    if (me?.me && store.getState()) {
      // Close existing connection if any
      cleanupSocket();

      // Create new WebSocket connection with proper URL based on environment
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      let wsURL;

      // Check if we're in production or development
      if (process.env.NODE_ENV === "production") {
        // In production, use the same host as the current page but with /api/ws path
        wsURL = `${wsProtocol}://${window.location.host}/api/ws?token=${store.getState()}`;
      } else {
        // In development, use the API port
        wsURL = `${wsProtocol}://${window.location.hostname}:${
          process.env.NEXT_PUBLIC_API_PORT || "9000"
        }/ws?token=${store.getState()}`;
      }

      const ws = new WebSocket(wsURL);

      ws.onopen = () => {
        setIsConnected(true);

        // Set up heartbeat interval to maintain online status
        heartbeatInterval.current = setInterval(() => {
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: 'heartbeat' }));
          }
        }, 60000); // Send heartbeat every minute
      };

      ws.onclose = () => {
        setIsConnected(false);

        // Clear heartbeat interval
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = null;
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle different types of messages
          if (data.type === "status_update") {
            setOnlineUsers((prev) => {
              const newSet = new Set(prev);
              if (data.isOnline) {
                newSet.add(data.userId);
              } else {
                newSet.delete(data.userId);
              }
              return newSet;
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      setSocket(ws);

      // Clean up on unmount or when auth changes
      return cleanupSocket;
    }
  }, [me?.me]);

  // Also subscribe to auth store to disconnect when user logs out
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (!store.getState()) {
        // User logged out, clean up socket
        if (socket) {
          socket.close();
          setSocket(null);
          setIsConnected(false);
          setOnlineUsers(new Set());
        }

        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = null;
        }
      }
    });

    return unsubscribe;
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ onlineUsers, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

export default WebSocketContext;
