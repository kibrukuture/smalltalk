import { users } from '../../datastr/index.js';
export default function onVideoCallAccepted(socket, data) {
  const { callingPeer, roomId } = data;

  // Handshake with remote peer
  if (users[callingPeer.userName]) {
    // console.log('Handshake Over Websockt, Remote Peer Id:', friend.userId);
    socket.join(roomId);
    users[callingPeer.userName].socket.join(roomId);

    // broadcast to all except sender
    users[callingPeer.userName].socket.emit('VideoCallAccepted', {
      roomId,
      callingPeer,
    });
  }
}