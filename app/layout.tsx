'use client';
import './globals.css';
import { useEffect, useState, StrictMode } from 'react';
import { useRouter } from 'next/navigation';
import AlertMessage from '@/components/AlertMessage';
import { ChatContext, LastSeen, User, Alert, UserProfile, Room, Error, SearchResult, Chats, AllChats, Typing, Tab, Theme, Connection } from '@/app/ChatContext';
import { RiCloseFill } from 'react-icons/ri';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // all states
  const [error, setError] = useState<Error>({
      signIn: '',
      signUp: '',
    }), //error
    [alert, setAlert] = useState<Alert>({
      show: false,
      message: '',
      title: '',
      type: 'error',
    }), //alert
    [currentOpenChatId, setCurrentOpenChatId] = useState<string>(''),
    [chatFriends, setChatFriends] = useState([] as SearchResult[]),
    [chats, setChats] = useState([] as Chats[]),
    [allChats, setAllChats] = useState([] as AllChats[]),
    [typing, setTyping] = useState([] as Typing[]),
    [isAllChatsLoading, setIsAllChatsLoading] = useState(false),
    [barCurrentTab, setBarCurrentTab] = useState<Tab>('chat'),
    [wallpaper, setWallpaper] = useState(''),
    [theme, setTheme] = useState('light' as Theme),
    [gallery, setGallery] = useState([] as string[]),
    [friendRequests, setFriendRequests] = useState([] as User[]),
    [isUserNotAbleToSendFriendRequest, setIsUserNotAbleToSendFriendRequest] = useState(false),
    [lastSeen, setLastSeen] = useState({} as LastSeen),
    [userProfile, setUserProfile] = useState({ url: '' } as UserProfile),
    [user, setUser] = useState({} as User),
    [rooms, setRooms] = useState(new Map<string, Room>()), //rooms
    [isChatRoomTapped, setIsChatRoomTapped] = useState(false);

  // router
  const router = useRouter();

  // useEffect(() => {
  //   if (!allChats.length) return;
  //   setTyping(
  //     allChats
  //       .map((chat) => chat.id)
  //       .map((id) => ({
  //         id,
  //         typing: false,
  //       })),
  //   );
  //   return () => setTyping([]); //empty typing array on unmount
  // }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stunServer = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.stunprotocol.org:3478' },
        { urls: 'stun:stun.services.mozilla.com:3478' },
        //more stun servers
      ];
      // Create a RTCPeerConnection object
      const peerConnection = new RTCPeerConnection({ iceServers: stunServer });
      peerConnection.addEventListener('icecandidate', (event) => console.log(event.candidate));

      console.log(peerConnection);
    }
  }, []);

  const onUserSignIn = async (usr: { email: string; password: string }) => {
    const data = await handleFetch('http://localhost:4040/signin', 'POST', usr);

    if (data.status === 'ok') {
      console.log(data);
      //set token
      localStorage.setItem('logInToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user); // set user
      setAlert({
        show: true,
        message: 'Welcome back!',
        title: 'Logged In',
        type: 'success',
      });
      // after 4 seconds, remove alert
      setTimeout(() => {
        setAlert({
          show: false,
          message: '',
          title: '',
          type: '',
        });
      }, 10000);

      setError({
        signIn: '',
        signUp: '',
      });
      // success sign in
      router.push('/chat');
    } else setError((prev) => ({ ...prev, signIn: data.message })); // could not sign in
  };

  const onUserSignUp = async (usr: User) => {
    //{ email: '', password: '', name: '', userName: '' }
    const data = await handleFetch('http://localhost:4040/signup', 'POST', usr);
    if (data.status === 'ok') {
      setError({
        signIn: '',
        signUp: '',
      });
      // success alert
      setAlert({
        show: true,
        message: 'You have successfully signed up!',
        title: 'Success',
        type: 'success',
      });
      // after 4 seconds, remove alert
      setTimeout(() => {
        setAlert({
          show: false,
          message: '',
          title: '',
          type: '',
        });
      }, 10000);
      // success sign in
      router.push('/');
    } else setError((prev) => ({ ...prev, signUp: data.message })); // could not sign in
  };

  const onAlertClose = () => {
    setAlert({
      show: false,
      message: '',
      title: '',
      type: 'error',
    });
  };

  // console.log('all rooms: ', rooms, currentOpenChatId);
  return (
    <html lang='en'>
      <head>
        {/* include favicon */}
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
        <link rel='icon' href='/favicon.ico' type='image/x-icon' />
        <title>smalltalk</title>
      </head>
      <body className=' bg-skin-fill  text-skin-base font-sans  '>
        <ChatContext.Provider
          value={{
            onUserSignIn,
            onUserSignUp,
            setError,
            setCurrentOpenChatId,
            setChatFriends,
            setChats,
            setAllChats,
            setTyping,
            setIsAllChatsLoading,
            setBarCurrentTab,
            setWallpaper,
            setTheme,
            setGallery,
            setFriendRequests,
            setIsUserNotAbleToSendFriendRequest,
            setLastSeen,
            setUserProfile,
            setUser,
            setAlert,
            setRooms,
            setIsChatRoomTapped,
            isChatRoomTapped,
            rooms,
            alert,
            user,
            userProfile,
            lastSeen,
            isUserNotAbleToSendFriendRequest,
            friendRequests,
            wallpaper,
            theme,
            gallery,
            barCurrentTab,
            isAllChatsLoading,
            typing,
            allChats,
            chatFriends,
            chats,
            error,
            currentOpenChatId,
          }}
        >
          {children}
          {alert.show && <AlertMessage alert={alert} onAlertClose={onAlertClose} />}
          {isUserNotAbleToSendFriendRequest && (
            <div className='font-mono fixed p-lg w-fit bottom-2 right-2 z-50 bg-red-200 text-red-400 rounded'>
              <div className='h-full w-2 bg-red-500 '></div>
              <div className='text-sm p-lg'>
                <p>Error</p>
                <p>You can not send friend request to this person.</p>
              </div>
              <button onClick={() => setIsUserNotAbleToSendFriendRequest(false)} className='p-lg absolute top-2 right-2 text-white'>
                <RiCloseFill />
              </button>
            </div>
          )}
        </ChatContext.Provider>
      </body>
    </html>
  );
}

const handleFetch = async (
  url: string,
  method: string,
  body: {
    email: string;
    password: string;
  },
) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  return data;
};

/* for group chat
{
  "id": "unique identifier for the chat",
  "name": "the name of the chat",
  "description": "the description of the chat",
  "participants": [
    {
      "id": "the id of the participant",
      "name": "the name of the participant",
      "avatar": "the avatar of the participant"
    }
  ],
  "messages": [
    {
      "id": "unique identifier for the message",
      "text": "the text of the message",
      "senderId": "the id of the sender",
      "receiverId": "the id of the receiver",
      "attachment": "the attachment for the message",
      "links": "the links in the message",
      "createdAt": "the timestamp when the message was created",
      "updatedAt": "the timestamp when the message was updated"
    }
  ],
  "createdAt": "the timestamp when the chat was created",
  "updatedAt": "the timestamp when the chat was updated"
}
 */

//for a single chat:

//  type ChatMessage={
//   "id": string,
//   "createdAt": string,
//   "messages": [
//     {
//       "id": "unique identifier for the message",
//       "text": "the text of the message",
//       "senderId": "the id of the sender",
//       "receiverId": "the id of the receiver",
//       "attachment": "the attachment for the message",
//       "emoji": "the emoji for the message
//       "links": "the links in the message",
//       "createdAt": "the timestamp when the message was created",
//       "updatedAt": "the timestamp when the message was updated",
//       "deletedAt": "the timestamp when the message was deleted",
//       "reply":
//         {
//           "id": "unique identifier for the reply",
//           "text": "the text of the reply",
//           "senderId": "the id of the sender",
//           "receiverId": "the id of the receiver",
//           "attachment": "the attachment for the reply",
//           "emoji": "the emoji for the reply",
//           "links": "the links in the reply",
//           "createdAt": "the timestamp when the reply was created",
//           "updatedAt": "the timestamp when the reply was updated",
//           "deletedAt": "the timestamp when the reply was deleted",
//     }
//   ]

// }

// type AllChats = {
//   id: {
//     id: string;
//     createdAt: string;
//     messages: [
//       {
//         id: string;
//         text: string;
//         senderId: string;
//         receiverId: string;
//         attachment: string;
//         emoji: string;
//         link: string;
//         createdAt: string;
//         updatedAt: string;
//         deletedAt: string;
//         reply: {
//           id: string;
//           text: string;
//           senderId: string;
//           receiverId: string;
//           attachment: string;
//           emoji: string;
//           link: string;
//           createdAt: string;
//           updatedAt: string;
//           deletedAt: string;
//         };
//       },
//     ];
//   };
// };
