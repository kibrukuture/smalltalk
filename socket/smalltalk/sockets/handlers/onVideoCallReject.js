import { users } from '../../datastr/index.js';
export default function onVideoCallReject(socket, data) {
  const { caller, roomId, friend } = data;
  console.log('Shaking Hand: ', data, 'users ', users);

  // on video call rejected.
  if (users[caller.userName]) {
    // console.log('Handshake Over Websockt, Remote Peer Id:', friend.userId);
    socket.join(roomId);
    users[caller.userName].socket.join(roomId);

    // broadcast to all except sender
    users[caller.userName].socket.emit('VideoCallRejected', {
      roomId,
      caller,
      friend,
    });
  }
}
