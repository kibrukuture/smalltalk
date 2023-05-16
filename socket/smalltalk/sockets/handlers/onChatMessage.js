import { rooms, users } from '../../datastr/index.js';
import saveChatMessageDbHandler from '../../socket_related_db/SaveChatMessageDbHandler.js';
import { supabase } from '../../../db/index.js';

// user:chatmessage event handler
async function onChatMessage(socket, data) {
  const { message, sender, receiver, id, initiatedBy, messageId, createdAt } = data;
  const { data: chatRoom, error } = await supabase.from('all_chats').select('*').eq('id', id);
  // check if users are friends

  if (chatRoom.length) {
    // save message to dbs
    console.log(initiatedBy.name, ' sent ', message + ' to ' + receiver.name);
    const {
      status,
      message: msg,
      statusCode,
    } = await saveChatMessageDbHandler({
      sender: initiatedBy.id === sender.id ? receiver : sender,
      receiver,
      text: message,
      initiatedBy,
      room: id,
      type: 'chat',
      createdAt,
      messageId,
    });

    // chat messages could not be saved to db.
    if (status !== 'success') {
      // on error
      return socket.emit('user:chatmessage', {
        status,
        message: msg,
        statusCode,
      });
    }

    //check if receiver is online
    // if (users[receiver.username]) {
    // users[receiver.username] && users[receiver.username].socket.join(id);
    // users[sender.username] && users[sender.username].socket.join(id);

    // receiver is online

    if (users[msgReceiver.username]) {
      users[msgReceiver.username].socket.emit('user:chatmessage', {
        id, // room id
        sender: initiatedBy.id === sender.id ? receiver : sender,
        receiver,
        message,
        initiatedBy,
        createdAt,
        messageId,
      });
    }
    // io.to(id).emit('user:chatmessage', {
    //   id, // room id
    //   sender,
    //   receiver,
    //   message,
    //   initiatedBy,
    //   createdAt,
    //   messageId,
    // });
  }
}

export default onChatMessage;
