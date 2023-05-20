import { users } from '../../datastr/index.js';
export default function onStartVideoCall(socket, data) {
  const { sender, friend, roomId } = data;
  console.log('Shaking Hand: ', data, 'users ', users);

  // Handshake with remote peer
  if (users[friend.userName]) {
    console.log('Handshake Over Websockt, Remote Peer Id:', friend.userId);
    socket.join(roomId);
    users[friend.userName].socket.join(roomId);

    // broadcast to all except sender
    users[friend.userName].socket.emit('AcceptOrRejectVideoCall', {
      sender,
      friend,
      roomId,
    });
  }
}
