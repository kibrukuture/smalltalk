import express from 'express';
import cors from 'cors';
import signInRouter from './signin/index.js';
import signUpRouter from './signup/index.js';
import searchRouter from './search/index.js';
import userRouter from './user/index.js';
import chatLoadRouter from './dataloader/index.js';
import bodyParser from 'body-parser';

export const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// app.use(cors({

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true,
  }),
);
// increase file upload limit to 50mb
// app.use(bodyparser.json({ limit: '50mb' }));
// app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));

app.use('/signin', signInRouter);
app.use('/signup', signUpRouter);
app.use('/api/search', searchRouter);
app.use('/api/user', userRouter);
app.use('/api/loadchats', chatLoadRouter);

// clients++;
// // io.sockets.emit('broadcast', { description: clients + ' clients connected!' });
// const room = 'room-1';
// socket.join(room);

// socket.on('create-room', ({ sender, recipient, message }) => {
//   socket.broadcast.in(room).emit('new-room', {
//     sender,
//     recipient,
//     message,
//   });
// });

// nsp.sockets.in('room-1').emit('event in room-1', 'anyone in room 1 yet?');

// socket.broadcast.in('room-1').emit('event in room-1', 'anyone in room 1 yet?');

// socket.emit('newclientconnect', { description: 'Hey, welcome!' });
// socket.broadcast.emit('newclientconnect', { description: clients + ' clients connected!' });

// socket.on('disconnect', function () {
//   console.log('A user disconnected');
// });
//   console.log(socket.id, socket.rooms, socket.data, socket.recovered);
// socket.on('chat', (data, callback) => {
// room
// const room = [data.recipient, socket.id].sort().join('-');
// socket.join(room);
// socket.on('private message', ({ sender, message }) => {
//   socket.broadcast.to(room).emit('private message', {
//     sender,
//     message,
//   });
// });
//   socket.broadcast.emit('xyz', data);
//   callback({
//     ok: true,
//   });
// });
//sends
// socket.emit('message-from-server', 'Welcome to the websocket server!!', (res) => {
//   console.log(res);
// });

// socket.send('Welcome to the websocket server!!,... ping pong...');
// socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });
// socket on id :
// socket.on('ping-first', ({ sender, recipient }) => {
//   const room = [sender, recipient].sort().join('-');
//   console.log('Fr: S: ', sender, 'R: ', recipient, 'Room: ', room);
//   socket.join(room); // join room

//   console.log('R: ', socket.rooms);
//   socket.on('ping-last', ({ sender, recipient, message }) => {
//     console.log('Sc: S: ', sender, 'R: ', recipient, 'Room: ', room);
//     socket.broadcast.to(room).emit('pong-last', {
//       sender,
//       recipient,
//       message,
//     });
//   });
// });
// });

// io.listen(4040, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     // 'Access-Control-Allow-Origin': '*', // <-- location of the react app were connecting to
//   },
// });

// listen to the port 4040

//  rest api benefits from caching whree as websockets dont.

// The io.on event handler handles connection, disconnection, etc., events in it, using the socket object. The socket object is the connection object of the client. The socket object has a lot of properties and methods, which can be used to implement various functions. For example, the socket.id property is the unique identifier of the client, and the socket.on method is used to listen for the message sent by the client. The socket.emit method is used to send a message to the client.

// The io.listen method is used to start the server and listen to the specified port. The io.listen method has two parameters, the first parameter is the port number, and the second parameter is the configuration object. The configuration object has a cors property, which is used to configure the cross-domain policy. The cors property is an object, which has an origin property, which is used to configure the domain name of the client that can be accessed. The methods property is used to configure the request method that can be accessed. The origin property can also be set to * to allow all domain names to access.

// reserverd key words used by socket.io ( server side )
// connect, connect_error, connect_timeout, connecting, disconnect, error, reconnect, reconnect_attempt, reconnect_failed, reconnect_error, reconnecting, ping, pong, "message", join, leave, ack, error, disconnecting, newListener, removeListener, and removeAllListeners.

// emit is to send message to the client & server both way .
//  on listens to event from client & server both way .

// namespacing : means assigning different endpoints or paths for socket.io to listen to. This is useful when you have different types of users connecting to your server. For example, you may have a chat application where you have users and admins. You can create a namespace for each type of user and then listen to events on that namespace.
// Namespaces are created on the server side. However, they are joined by clients by sending a request to the server.

// Within each namespace, you can also define arbitrary channels that sockets can join and leave. These channels are called "rooms". Rooms are used to further-separate concerns. Rooms also share the same socket connection like namespaces. One thing to keep in mind while using rooms is that they can only be joined on the server side.

/* : server side
var express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  rooms = {},
  users = {};

io.on("connection", function(socket) {
  // Get the user's name from the request headers.
  var name = socket.handshake.headers["name"];

  // Create a new user object for the user.
  users[name] = {
    socket: socket,
    rooms: []
  };

  // Add the user to the list of online users.
  io.emit("users", Object.keys(users));

  // Listen for the "join" event from the user.
  socket.on("join", function(room) {
    // Add the user to the room.
    rooms[room].push(name);

    // Broadcast a message to the room informing everyone that the user has joined.
    io.to(room).emit("join", name);
  });

  // Listen for the "leave" event from the user.
  socket.on("leave", function(room) {
    // Remove the user from the room.
    var index = rooms[room].indexOf(name);
    rooms[room].splice(index, 1);

    // Broadcast a message to the room informing everyone that the user has left.
    io.to(room).emit("leave", name);
  });

  // Listen for the "message" event from the user.
  socket.on("message", function(message) {
    // Broadcast the message to the room that the user is in.
    io.to(rooms[message.room]).emit("message", message);
  });
});

*/

/**
 *
 * var socket = io();
// When the client connects, join the default room.
socket.on("connect", function() {
  socket.join("default");
});

// When the client receives a "message" event, display the message in the chat box.
socket.on("message", function(message) {
  document.getElementById("chat").innerHTML += message + "<br>";
});

// When the client clicks the "Send" button, send the message to the server.
document.getElementById("send").onclick = function() {
  var message = document.getElementById("message").value;
  socket.emit("message", message);
};

 */
