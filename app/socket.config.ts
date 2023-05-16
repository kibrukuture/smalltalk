import { io } from 'socket.io-client';
const socket = io('ws://localhost:4040/', { transports: ['websocket'] });
export default socket;
