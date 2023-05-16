import { supabase } from '../../../db/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { equal } from 'assert';
dotenv.config();

// env variables
const { JWT_SECRET } = process.env;

// authorizes user
async function onUserAuth(socket, data) {
  const { token, user } = data;

  // verify token
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return socket.emit('user:auth', {
        status: 'error',
        message: 'Invalid token',
      });
    }
    // get user data
    const { email } = decoded; // email or username depending on how user signed in.
    const userQuery = await supabase.from('user').select('*').or(`email.eq.${email}, userName.eq.${email}`);

    if (userQuery.error) {
      return socket.emit('AuthenticateUser', {
        status: 'error',
        message: userQuery.error.message,
      });
    }

    if (!userQuery.data.length) {
      return socket.emit('AuthenticateUser', {
        status: 'error',
        message: 'User not found',
      });
    }

    socket.emit('AuthenticateUser', {
      status: 'ok',
      message: 'User authenticated',
      user,
    });
  });

  // console.log('##################################:OnAuth:################################\n\n');

  // const allRoomsQuery = await supabase.from('message').select(`*, link(*), attachment(*),message(*)`).eq('roomId', '788030b5-66c1-452e-9f93-f89c1efc9e04-fba6efe1-fbbb-4617-bd75-92dec14fa3c9').is('replyId', null);
  // const allRoomsQuery = await supabase.from('privateroom').select(`*, user!privateroom_userOneId_fkey(*),message(*,link(*), attachment(*), message(*))`).is('message.replyId', null);
  // const allRoomsQuery = await supabase.from('privateroom').select(`*, message(*,link(*), attachment(*), message(*))`).is('message.replyId', null).or(`userOneId.eq.${user.userId}, userTwoId.eq.${user.userId}`);
  const whichUserId = await supabase.from('privateroom').select('*').or(`userOneId.eq.${'788030b5-66c1-452e-9f93-f89c1efc9e04'}, userTwoId.eq.${'788030b5-66c1-452e-9f93-f89c1efc9e04'}`).single();
  // const fns = await supabase.rpc('get_privateroom_data');
  console.log('##################################:OnAuth:################################\n\n', whichUserId);
}

export default onUserAuth;

// .leftJoin('users', `users.id`, `=`, `privaterooms.user_id`)
// .select(`*, users(id, userName, email)`)
// .eq(`users.id`, `${user.id}`);.select(`*, users(id, userName, email)`).eq(`users.id`, `${user.id}`).eq(`private`, `true`);
/*
const { data, error } = await supabase.from('teams').select(`
  id,
  team_name,
  users ( id, name )
`)
/*/

const hello = [
  {
    messageId: '9f1ccf80-93ce-44e3-89eb-15831b71d87a',
    roomId: '788030b5-66c1-452e-9f93-f89c1efc9e04-fba6efe1-fbbb-4617-bd75-92dec14fa3c9',
    senderId: '788030b5-66c1-452e-9f93-f89c1efc9e04',
    text: 'You are now connected',
    createdAt: '2023-05-15T13:51:42.372821',
    updatedAt: null,
    replyId: null,
    emoji: '',
    messagelinks: {
      messageId: '9f1ccf80-93ce-44e3-89eb-15831b71d87a',
      siteName: 'Youtube',
      url: 'https://www.youtube.com/watch?v=sgHbdddP5-c',
      title: 'Adele Being a Songwriting Genius for 5 minutes\n',
      description: "Hey there! Get ready to join us for an awesome video featuring the one and only Adele! In this video, she shares her thoughts on songwriting and her unique perspective on music. Not only will we get to learn about her creative process, but we'll also get to see her funny side!",
      type: 'video',
      date: null,
      imageWidth: 1000,
      imageHeight: 1000,
      imageUrl: 'https://e3.365dm.com/21/10/2048x1152/skynews-adele-new-song-easy-on-me_5547004.jpg',
    },
    messageattachments: {
      messageId: '9f1ccf80-93ce-44e3-89eb-15831b71d87a',
      type: 'image',
      url: 'https://media.glamourmagazine.co.uk/photos/63e06380ac9cf4159668784b/1:1/w_1920,h_1920,c_limit/ADELE%20060223%20GettyImages-1463270716_SQ.jpeg',
      width: null,
      height: null,
      size: '4mb',
    },
  },
  {
    messageId: 'a9e9b994-462e-429a-abb9-037281d96afa',
    roomId: '788030b5-66c1-452e-9f93-f89c1efc9e04-fba6efe1-fbbb-4617-bd75-92dec14fa3c9',
    senderId: 'fba6efe1-fbbb-4617-bd75-92dec14fa3c9',
    text: 'I think so ',
    createdAt: '2023-05-15T16:13:23.682775',
    updatedAt: null,
    replyId: '9f1ccf80-93ce-44e3-89eb-15831b71d87a',
    emoji: 'lomit.',
    messagelinks: null,
    messageattachments: null,
  },
];
