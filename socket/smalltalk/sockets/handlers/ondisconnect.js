import { supabase } from '../../../db/index.js';
import { users } from '../../datastr/index.js';

async function onDisconnect(socket, lastSeen) {
  //user id
  const lastSeenUserId = lastSeen[socket.customId]?.id;

  const lastSeenAt = new Date().toISOString();
  //update last seen
  const { data, error } = await supabase.from('last_seen').update({ at: lastSeenAt }).eq('user_id', lastSeenUserId).select('*');
  // error
  if (error) {
    console.log('onDisconnect: ', error.message);
  }

  // notify users connected to this socket.
  // users[socket.username].rooms.forEach((room) => {
  //   socket.to(room).emit('user_disconnected', { roomId: room, username: socket.username, userId: socket.customId, lastSeenAt });
  // });

  //   // user is online

  // remove user from lastSeen
  // delete lastSeen[lastSeenUserId];

  // remove user from online users
  delete users[socket.userName];

  //
  console.log('User', socket.userName, ' disconnected', ' ======> ', 'In Online Users List', !!users[socket.userName]);

  //
}

export default onDisconnect;
