import { users } from '../../datastr/index.js';

export default function onRemotePeerVideoCallEnd(socket, data) {
  const { roomId, callEndedBy, peer } = data;

  // peer is still online
  if (users[peer.userName]) {
    // close remote peer's video call
    users[peer.userName].socket.emit('RemotePeerVideoCallEnd', {
      roomId,
      callEndedBy,
      peer,
    });
  }
}
