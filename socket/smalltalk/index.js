import { Server } from 'socket.io';
import { app } from '../index.js';
import { createServer } from 'http';
import onDisconnect from './sockets/handlers/ondisconnect.js';
import onUserAuth from './sockets/handlers/onUserAuth.js';
import onUserSetup from './sockets/handlers/onUserSetup.js';
import onSendFriendRequest from './sockets/handlers/onSendFriendRequest.js';
import onChatMessage from './sockets/handlers/onChatMessage.js';
import onUserTyping from './sockets/handlers/onUserTyping.js';
import onAcceptOrDeclineFriendRequest from './sockets/handlers/onAcceptOrDeclineFriendRequest.js';
import { lastSeen } from './datastr/index.js';

// server setup
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000/',
  },
});

// listen for connection
io.on('connection', (socket) => {
  socket.on('AuthenticateUser', (data) => onUserAuth(socket, data)); // auth user
  socket.on('SetupUser', (data) => onUserSetup(socket, data)); // setup user
  socket.on('SendFriendRequest', (data) => onSendFriendRequest(socket, data)); // friend request
  socket.on('ExchangeChatMessage', (data) => onChatMessage(socket, data)); // chat message
  socket.on('user:typing', (data) => onUserTyping(socket, data)); // typing
  // socket.on('user:stopTyping', (data) => onStopTyping(socket, data)); // stop typing
  // socket.on('user:acceptFriendRequest', (data) => onAcceptFriendRequest(socket, data)); // accept friend request
  // socket.on('user:rejectFriendRequest', (data) => onRejectFriendRequest(socket, data)); // reject friend request
  socket.on('AcceptOrDeclineFriendRequest', (data) => onAcceptOrDeclineFriendRequest(socket, data));
  socket.on('disconnect', () => onDisconnect(socket, lastSeen)); // disconnect
});

// listen for connection
server.listen(4040, () => {
  console.log('listening on port : 4040');
});

export default io;
