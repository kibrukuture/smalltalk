// configs & util fns
import { Server } from 'socket.io';
import { app } from '../index.js';
import { createServer } from 'http';
import { lastSeen } from './datastr/index.js';

// handlers
import onDisconnect from './sockets/handlers/ondisconnect.js';
import onUserAuth from './sockets/handlers/onUserAuth.js';
import onUserSetup from './sockets/handlers/onUserSetup.js';
import onSendFriendRequest from './sockets/handlers/onSendFriendRequest.js';
import onChatMessage from './sockets/handlers/onChatMessage.js';
import onUserTyping from './sockets/handlers/onUserTyping.js';
import onAcceptOrDeclineFriendRequest from './sockets/handlers/onAcceptOrDeclineFriendRequest.js';
import onStartVideoCall from './sockets/handlers/onStartVideoCall.js';
import onVideoCallReject from './sockets/handlers/onVideoCallReject.js';
import onEndVideoCall from './sockets/handlers/onEndVideoCall.js';
import onVideoCallAccepted from './sockets/handlers/onVideoCallAccepted.js';
import onRemotePeerVideoCallEnd from './sockets/handlers/onRemotePeerVideoCallEnd.js';
import onDeleteConversation from './sockets/handlers/onDeleteConversation.js';

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
  socket.on('VideoCallRejected', (data) => onVideoCallReject(socket, data)); // video call rejection
  socket.on('StartVideoCall', (data) => onStartVideoCall(socket, data)); // start video call   ;
  socket.on('EndVideoCall', (data) => onEndVideoCall(socket, data)); // end video call
  socket.on('VideoCallAccepted', (data) => onVideoCallAccepted(socket, data)); // end video call
  socket.on('RemotePeerVideoCallEnd', (data) => onRemotePeerVideoCallEnd(socket, data)); // end video call
  socket.on('DeleteConversation', (data) => onDeleteConversation(socket, data));
  socket.on('disconnect', () => onDisconnect(socket, lastSeen)); // disconnect
});

// listen for connection
server.listen(4040, () => {
  console.log('listening on port : 4040');
});

export default io;
