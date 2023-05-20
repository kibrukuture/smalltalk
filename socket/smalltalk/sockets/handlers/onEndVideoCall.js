import { users } from '../../datastr/index.js';
export default function onEndVideoCall(socket, data) {
  const { remotePeer, roomId } = data;

  // Handshake with remote peer
  if (users[remotePeer.userName]) {
    console.log('onEndVideoCall');
    socket.join(roomId);
    users[remotePeer.userName].socket.join(roomId);

    // broadcast to all except sender
    users[remotePeer.userName].socket.emit('EndVideoCall', {
      roomId,
    });
  }
}
