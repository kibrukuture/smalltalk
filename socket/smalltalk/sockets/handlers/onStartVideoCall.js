import { users } from '../../datastr/index.js';
export default function onStartVideoCall(socket, data) {
  const { caller, friend, roomId } = data;

  // remote peer online
  if (users[friend.userName]) {
    socket.join(roomId);
    users[friend.userName].socket.join(roomId);

    // emit to remote peer
    users[friend.userName].socket.emit('IncomingVideoCall', {
      caller,
      friend,
      roomId,
    });
    console.log(caller.name, ' is handshaking with ', friend.name);
    // emit to caller, change status to calling (online)
    socket.emit('RemotePeerOnline', { ...data });
  } else {
    // emit to caller, change status to calling (offline)
    socket.emit('RemotePeerOffline', { ...data });

    console.log('Remote Peer ', friend.name, ' is offline ', ' =====> Caller: ', caller.name);
  }
}
