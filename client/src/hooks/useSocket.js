import { useEffect, useState, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import useAuth from './useAuth';

const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    const socket = connectSocket(token);
    socketRef.current = socket;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [isAuthenticated, token]);

  const emit = (event, data) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  };

  const on = (event, handler) => {
    const socket = socketRef.current || getSocket();
    if (socket) {
      socket.on(event, handler);
      return () => socket.off(event, handler);
    }
    return () => {};
  };

  return { socket: socketRef.current, isConnected, emit, on };
};

export default useSocket;
