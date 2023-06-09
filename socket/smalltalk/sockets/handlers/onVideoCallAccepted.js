import { users } from '../../datastr/index.js';
export default function onVideoCallAccepted(socket, data) {
  const { caller, roomId, friend } = data;

  // accept video call.
  if (users[caller.userName]) {
    socket.join(roomId);
    users[caller.userName].socket.join(roomId);

    // broadcast to all except sender
    users[caller.userName].socket.emit('VideoCallAccepted', {
      roomId,
      caller,
      friend,
    });
  }

  console.log(friend.name, ' accepted video call from ', caller.name);
}
