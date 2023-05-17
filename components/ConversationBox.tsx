'use client';
import socket from '@/app/socket.config';
import { useState, useContext } from 'react';
import { ChatContext, AllChats, SearchResult, User, Alert, Room } from '@/app/ChatContext';
import { formatAmPm } from '@/app/util.fns';
import { getColorFromName, getInitials } from '@/app/util.fns';

export default function ConversationBox() {
  //state
  const [searchItem, setSearchItem] = useState<string>(''),
    [searchResult, setSearchResult] = useState<User[]>([]),
    [searchResultLoading, setSearchResultLoading] = useState<boolean>(false),
    [searchResultError, setSearchResultError] = useState<string>(''),
    [isOnSearchInterface, setIsOnSearchInterface] = useState<boolean>(false);

  // consume context
  const { setCurrentOpenChatId, setAlert, rooms, allChats, isUserNotAbleToSendFriendRequest, setIsUserNotAbleToSendFriendRequest } = useContext(ChatContext);

  console.log('in box ', allChats);
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //reset search result
    setSearchResult([]);
    setSearchResultError('');

    // on search interface & loading
    setSearchResultLoading(true);
    setIsOnSearchInterface(true);

    if (searchItem === '') return;

    const res = await fetch('http://localhost:4040/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('logInToken')}`,
      },
      body: JSON.stringify({ searchItem }),
    });
    const { status, message, data } = await res.json();

    console.log(data, 'after search result');

    if (status === 'error') setSearchResultError(message);
    else if (status === 'ok') setSearchResult([...data]);
    setSearchResultLoading(false);
    setSearchItem('');
    console.log('ConversationBox: Search Result: ', data);

    setIsUserNotAbleToSendFriendRequest(false);
  };

  const onSearchResult = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const searchResultId = e.currentTarget.id;
    console.log('Conversation Box, current open chat id: ', searchResultId);

    const findItem = searchResult.find((item) => item.userId === searchResultId) as User;

    console.log('ConversationBox: find Item: ', findItem);
    const user = JSON.parse(localStorage.getItem('user') as string) as User;
    if (findItem.userId === user.userId) return alert('You can not send friend request to yourself');
    // send a friend request
    socket.emit('SendFriendRequest', {
      sender: user,
      receiver: findItem,
    });

    setIsOnSearchInterface(false);
    setSearchResult([]);

    // set alert
    setAlert({
      title: 'Friend Request',
      message: `Friend request sent to ${findItem.name}`,
      type: 'success',
      show: true,
    });

    // after 5 seconds, hide alert
    setTimeout(() => {
      setAlert({
        title: '',
        message: '',
        type: '',
        show: false,
      });
    }, 5000);
  };
  return (
    <>
      <form className='p-md flex items-center justify-center ' onSubmit={onFormSubmit}>
        <input value={searchItem} onChange={(e) => setSearchItem(e.target.value)} type='text' className='font-mono bg-skin-muted   w-full  p-lg rounded-md   text-skin-muted border-2   outline-none border-gray-300 focus:border-teal-400 focus:outline-none transition duration-500' placeholder='@search' />
      </form>
      {!isOnSearchInterface && <div className='overflow-y-auto grow '>{rooms.size > 0 && Array.from(rooms.values()).map((room) => <Conversation key={room.roomId} room={room} />)}</div>}

      {searchResult.length > 0 &&
        isOnSearchInterface &&
        searchResult.map((result) => (
          <div key={result.userId} className='flex  gap-xs p-md bg-skin-muted '>
            <p className={`relative overflow-hidden text-skin-muted min-w-8 min-h-8 w-8 h-8  flex items-center justify-center   rounded-full flex-wrap  `} style={{ backgroundColor: getColorFromName(result.name), color: 'whitesmoke' }}>
              {result.avatarUrl && <img className='object-cover h-10 w-10 ' src={result.avatarUrl} alt='' />}
              {!result.avatarUrl && <span className='text-xs  w-8 h-8 flex items-center justify-center'>{getInitials(result.name)}</span>}
            </p>
            <div className='flex flex-col items-start grow'>
              <p>{result.name}</p>
              <p className='text-xs text-skin-muted'>@{result.userName}</p>
              <button id={result.userId} onClick={onSearchResult} className='text-xs grow self-end w-fit p-md bg-green-300 hover:bg-green-400 text-skin-base rounded-sm'>
                Send Request
              </button>
            </div>
          </div>
        ))}

      {searchResultError && (
        <div className='flex flex-col items-center justify-center text-sm font-mono'>
          <p>{searchResultError}</p>
          <button
            onClick={() => {
              setSearchResultError('');
              setSearchResult([]);
              setIsOnSearchInterface(false);
            }}
            className='font-mono text-xs text-skin-muted underline underline-offset-2'
          >
            Go to Chats
          </button>
        </div>
      )}
      {/* {isUserNotAbleToSendFriendRequest && (
        <div className='flex flex-col items-center justify-center text-sm font-mono'>
          <p className='text-red-400'>You can not send friend request to this person.</p>
          <button
            onClick={() => {
              setSearchResultError('');
              setSearchResult([]);
              setIsOnSearchInterface(false);
            }}
            className='font-mono text-xs text-skin-muted underline underline-offset-2'
          >
            Go to Chats
          </button>
        </div>
      )} */}
      {searchResultLoading && (
        <div className='flex flex-col items-center justify-center'>
          <div className='animate-spin'></div>
        </div>
      )}
    </>
  );
}

function Conversation({ room }: { room: Room }) {
  // { avatar = '/dog.jpg', name = 'Kibru Kuture', lastMessage = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.', lastMessageAt = '2:30 PM', unreadMessages = 2, status = 'offline', id = '123123123' }: { avatar?: string; name?: string; lastMessage?: string; lastMessageAt?: string; unreadMessages?: number; status?: 'online' | 'offline'; id?: string }

  let { roomId, friend, createdAt, messages } = room;
  const user = JSON.parse(localStorage.getItem('user') as string) as User;

  const statusColor = 'online' === 'online' ? 'bg-green-400' : 'bg-red-400';
  let lastMessage = messages ? messages[messages.length - 1].text : '',
    lastMessageAt = messages ? messages[messages.length - 1].createdAt : '',
    unreadMessages = 3,
    avatarUrl = friend.avatarUrl,
    name = friend.name,
    status = 'online';

  const { setCurrentOpenChatId, setIsChatRoomTapped } = useContext(ChatContext);

  //
  const onCurrentOpenChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentOpenChatId(e.currentTarget.id);
    setIsChatRoomTapped(true);
  };

  return (
    <button onClick={onCurrentOpenChat} id={roomId} className='hover:bg-green-300 relative w-full block p-sm'>
      <div className='flex gap-xs p-md bg-skin-muted  '>
        <div className='relative'>
          <span className={`h-2 w-2 ${statusColor} rounded-full z-10 absolute top-0 left-0`}></span>
          <p className={`relative overflow-hidden text-skin-muted min-w-8 min-h-8 w-8 h-8  flex items-center justify-center   rounded-full flex-wrap  `} style={{ backgroundColor: getColorFromName(name), color: 'whitesmoke' }}>
            {avatarUrl && <img className='object-cover h-10 w-10 ' src={avatarUrl} alt='' />}
            {!avatarUrl && <span className='text-xs  w-8 h-8 flex items-center justify-center'>{getInitials(name)}</span>}
          </p>
        </div>
        <div className='flex flex-col grow '>
          <div className='text-sm flex items-center justify-between'>
            <p>{name}</p>
            <p className='text-skin-muted text-xs'>{formatAmPm(lastMessageAt as string)}</p>
          </div>
          <p className='flex  text-skin-muted text-xs'>{lastMessage.length > 30 ? lastMessage.slice(0, 30) + '...' : lastMessage}</p>
        </div>
      </div>
      {unreadMessages > 0 && (
        <div className='absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-teal-500 rounded-full text-xs text-white'>
          <p>{unreadMessages}</p>
        </div>
      )}
    </button>
  );
}
