'use client';
import { useEffect, useContext, useRef } from 'react';
import { ChatContext, LastSeen } from '../ChatContext';
import ChatBox from '@/components/ChatBox';
import Bar from '@/components/Bar';
import ConversationBox from '@/components/ConversationBox';
import UserDetail from '@/components/UserDetail';
import socket from '../socket.config';
import Profile from '@/components/Profile';
import Notificstion from '@/components/Notification';
import Settings from '@/components/Settings';
import { useRouter } from 'next/navigation';

// select tab
const tab: any = {
  chat: <ConversationBox />,
  profile: <Profile />,
  notification: <Notificstion />,
  setting: <Settings />,
};

export default function Chat() {
  //consume context
  const { rooms, setRooms, currentOpenChatId, setCurrentOpenChatId, typing, setTyping, setIsAllChatsLoading, isAllChatsLoading, setUser, user, barCurrentTab, setFriendRequests, friendRequests, setIsUserNotAbleToSendFriendRequest } = useContext(ChatContext);

  // router
  const router = useRouter();

  // ref
  const notificationRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('logInToken');
    if (!token) return router.push('/');

    const user = JSON.parse(localStorage.getItem('user') as string);

    // authenticate user( emit)
    socket.emit('AuthenticateUser', {
      token,
      user,
    });

    // set up user or redirect to login page.
    socket.on('AuthenticateUser', (data) => {
      if (data.status === 'ok') {
        // user is authenticated & set up
        socket.emit('SetupUser', data.user);
      } else {
        // user is not authenticated
        router.push('/');
      }
    });

    socket.on('JoinUserOnline', (data) => console.log('JoinUserOnline', data));

    return () => {
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
    // on reload set user data.
    if (Object.keys(user).length) return;
    setUser(JSON.parse(localStorage.getItem('user') as string));
  }, []);

  useEffect(() => {
    // load all chats.
    setIsAllChatsLoading(true);
    fetch(`http://localhost:4040/api/loadchats/${JSON.parse(localStorage.getItem('user') as string).userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // "Authorization": `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAllChatsLoading(false);
        if (data.status === 'ok') {
          inititateRoom(data, setRooms);
        } else {
        }
      });

    // fetch all friend request.
    fetch(`http://localhost:4040/api/user/friend-requests/${JSON.parse(localStorage.getItem('user') as string).userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // "Authorization": `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFriendRequests(data.user); // users wanting requst.
      });
  }, []);

  // listen for friend request
  socket.on('FriendRequestAccepted', (data) => {
    inititateRoom(data, setRooms);
    setCurrentOpenChatId(data.roomId);
  });

  // connection not successful
  socket.on('user:sendFriendRequest', (data) => {
    const { status, message, statusCode } = data;
    console.log(status, message, statusCode);
  });

  socket.on('user:declinedFriendRequest', (data) => {
    console.log('halahfksdljfasldfjaskdfjsdflas');
    setIsUserNotAbleToSendFriendRequest(true);
    setTimeout(() => {
      setIsUserNotAbleToSendFriendRequest(false);
    }, 5000);
  });

  socket.on('user:accepted-request', (data) => {});

  socket.on('user:typing', (data) => {
    const { id, typing: isTyping, initiatedBy, sender, receiver } = data;

    // console.log('user:typing', isTyping);
    const updateTyping = typing.map((chat) => {
      if (chat.id === id) {
        return { ...chat, typing: isTyping };
      } else {
        return chat;
      }
    });
    setTyping(updateTyping);
  });

  // listen for a new message
  socket.on('user:chatmessage', (data) => {});

  // user is online, push notification.
  socket.on('PushFriendRequestNotification', (data) => {
    setFriendRequests([...friendRequests, data]);

    if (notificationRef.current) notificationRef.current.play();
  });

  // when my friend is disconnected, notify me.
  socket.on('user:disconnected', (data) => {});

  // when my friend is connected, notify me.

  socket.on('user:connected', (data) => {
    console.log('user:connected', data);
  });

  if (!rooms.size && isAllChatsLoading) return <div className='h-screen w-full bg-black flex items-center justify-center text-skin-base text-2xl font-bold text-center  '>loading</div>;

  return (
    <div className='w-full flex'>
      <Bar />
      <div className=' h-screen max-h-screen flex flex-col gap-xs bg-skin-muted md:min-w-[30%] lg:min-w-[20%]'>{tab[barCurrentTab]}</div>
      <ChatBox />
      {false && <UserDetail />}
      <audio ref={notificationRef} src='/sound-effects/notification.wav' />
    </div>
  );
}

function inititateRoom(data: any, setRooms: any) {
  const map = new Map();
  data.rooms.forEach((room: any) => {
    map.set(room.roomId, {
      roomId: room.roomId,
      userOneId: room.userOneId,
      userTwoId: room.userTwoId,
      createdAt: room.createdAt,
      friend: room.user,
      messages: room.message,
    });
  });
  setRooms(map);
}

// https://www.npmjs.com/package/linkify-html
// https://www.npmjs.com/package/link-preview-js
// https://linkify.js.org/docs/plugin-mention.html
// https://www.npmjs.com/package/open-graph-scraper

// {
//   (async function getOGS(url) {
//     const options = { url };
//     const res = await ogs(options);
//     const data = await res.result;
//     console.log(data);
//   })('https://www.npmjs.com/package/better-image-optimizer-next');
// }

/*
  ogSiteName: 'YouTube',
  ogUrl: 'https://www.youtube.com/watch?v=zqeqdepYkcw',
  ogTitle: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',
  ogDescription: "Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...",
ogDate
    ogType: 'article',
  ogUrl: 'https://www.bbc.com/news/entertainment-arts-65585413',
    ogImage: [
    {
      height: '720',
      url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
      width: '1280',
      type: 'jpg'
    }
  ],

  image url might not be absolute path. so we need to check if it is absolute path or not.
    */

/*

  siteName: 'YouTube',[]
  url: 'https://www.youtube.com/watch?v=zqeqdepYkcw',[]
  title: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',[]
  description: "Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG..."[]
  date: '2021-03-03T16:00:00.000Z',[]
  type: 'article',[]
  image:{
    url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
    width: '1280',
    height: '720'
    type: 'jpg'
  }[]


  */
/*

🔗 https://www.youtube.com/watch?v=zqeqdepYkcw
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Fusce aliquam nisi ut felis euismod fringilla. Integer
mollis placerat eleifend. Nam semper auctor ipsum, a dapibus
nulla efficitur et.


    https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg
    Youtube
    Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023
    Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...

    Video | 📅 2 months ago

link:{
  siteName: 'YouTube',
  url: 'https://www.youtube.com/watch?v=zqeqdepYkcw',
  title: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',
  description: "Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023
    Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...",
  type: 'video',
 date: '2021-03-03T16:00:00.000Z',
 image:{
    url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
    width: '1280',
    height: '720'
    type: 'jpg'
 }
}
*/
