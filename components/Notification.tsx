// Date: 09/10/21
import { distanceToNow } from '@/app/util.fns';
import { RiCloseFill } from 'react-icons/ri';
import { useContext, useEffect, useState } from 'react';
import { ChatContext, User } from '@/app/ChatContext';
import socket from '@/app/socket.config';
import { getColorFromName, getInitials } from '@/app/util.fns';

export default function Notificstion() {
  const { friendRequests, setFriendRequests, setCurrentOpenChatId } = useContext(ChatContext);

  return (
    <div className='flex flex-col gap-sm text-sm text-skin-muted p-lg bg-skin-muted  '>
      <h1 className='font-mono text-md text-skin-muted'>#. Notifications</h1>
      {friendRequests.map((request) => {
        return <ConnectionRequest key={request.userId} {...request} />;
      })}
      {friendRequests.length === 0 && <p className='text-xs text-skin-muted self-center'>No new notifications</p>}
    </div>
  );
}

function ConnectionRequest(friendRequestSendingUser: User) {
  const { friendRequests, setFriendRequests } = useContext(ChatContext);
  // handlers
  const onConnectionRequest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, action: string) => {
    //  user from localstorage
    const user = JSON.parse(localStorage.getItem('user') as string);

    socket.emit('AcceptOrDeclineFriendRequest', { friendRequestSendingUser, friendRequestReceivingUser: user, action });

    setFriendRequests(friendRequests.filter((request) => request.userId !== friendRequestSendingUser.userId));
  };

  const onNotificationRemove = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // remove notification purgatory_state
    const isAccepted = await processFriendRequest(friendRequestSendingUser.userId!, 'purgatory_state');
    setFriendRequests(friendRequests.filter((request) => request.userId !== friendRequestSendingUser.userId)); // remove notification from state
  };

  return (
    <div className='flex flex-col gap-1 p-lg shadow relative text-xs '>
      <p>Connection Request</p>
      <div className='flex gap-xs p-md bg-skin-muted  '>
        <p className={`relative overflow-hidden text-skin-muted min-w-8 min-h-8 w-8 h-8  flex items-center justify-center   rounded-full flex-wrap  `} style={{ backgroundColor: getColorFromName(friendRequestSendingUser.name), color: 'whitesmoke' }}>
          {friendRequestSendingUser.avatarUrl && <img className='object-cover h-10 w-10 ' src={friendRequestSendingUser.avatarUrl} alt='' />}
          {!friendRequestSendingUser.avatarUrl && <span className='text-xs  w-8 h-8 flex items-center justify-center'>{getInitials(friendRequestSendingUser.name)}</span>}
        </p>
        <div className='flex flex-col grow '>
          <p className='text-skin-base'>{friendRequestSendingUser.name}</p>
          <p className='text-xs'>@{friendRequestSendingUser.userName} </p>
        </div>
      </div>
      <div className='flex items-center  justify-end gap-sm text-skin-base'>
        <button data-user-id='' onClick={(e) => onConnectionRequest(e, 'accept')} className=' bg-green-300  p-sm px-md rounded'>
          Accept
        </button>
        <button data-user-id='' onClick={(e) => onConnectionRequest(e, 'decline')} className=' bg-red-300    p-sm px-md rounded'>
          Decline
        </button>
      </div>
      <button onClick={onNotificationRemove} aria-label='close' className='text-skin-muted absolute right-1 top-1 p-1'>
        <RiCloseFill />
      </button>
    </div>
  );
}

async function processFriendRequest(id: string, action: string) {
  const receiverId = JSON.parse(localStorage.getItem('user') || '{}').userId;

  const res = await fetch('http://localhost:4040/api/user/accept-decline-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ senderId: id, receiverId, action }),
  });

  const data = await res.json();
  console.log('friend request response', data);
  if (data.status === 'ok') {
    return true;
  }
  return false;
}
