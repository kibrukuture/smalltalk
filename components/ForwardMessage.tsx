import { useEffect, useRef, useState, useContext } from 'react';
import { Message, ChatContext } from '@/app/ChatContext';
import { RiCloseFill, RiShareForward2Line } from 'react-icons/ri';
import { getInitials, getColorFromName } from '@/app/util.fns';
import { User } from '@/app/ChatContext';

export default function ForwardMessage({
  setForwardMessage,
  forwardMessage,
}: {
  setForwardMessage: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: Message;
      to: string[];
    }>
  >;
  forwardMessage: {
    show: boolean;
    message: Message;
    to: string[];
  };
}) {
  // from local storage

  const user = JSON.parse(localStorage.getItem('user')!) as User;
  const localStorageFriendsInRoom = (JSON.parse(localStorage.getItem('friends')!) as { friend: User; roomId: string }[]) || []; // localstorage.

  //states
  const [searchItem, setSearchItem] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [friendsInRoom, setFriendsInRoom] = useState<{ friend: User; roomId: string }[]>([]);
  const [filteredFriendsInRoom, setFilteredFriendsInRoom] = useState<{ friend: User; roomId: string }[]>([]);

  // consume context
  const { rooms } = useContext(ChatContext);

  useEffect(() => {
    // all-connected-friends
    if (localStorageFriendsInRoom.length > 0) {
      setFriendsInRoom(localStorageFriendsInRoom);
      setFilteredFriendsInRoom(localStorageFriendsInRoom);
      return;
    }
    (async function () {
      const res = await fetch(`http://localhost:4040/api/user/all-connected-friends/${user.userId}`);

      const data = await res.json();

      if (data.status === 'ok') {
        // reset db.
        //

        console.log(data);
        const tempFriendsInRoom = data.data.map((room) => {
          return {
            friend: rooms.get(room.roomId)?.friend,
            roomId: room.roomId,
          };
        });
        localStorage.setItem('friends', JSON.stringify(tempFriendsInRoom)); // store in localstorage.
        setFriendsInRoom(tempFriendsInRoom); // set state.
        setFilteredFriendsInRoom(tempFriendsInRoom); // set state.
      } else {
        console.log('Error in retrieveing users.');
      }
    })();
  }, []);

  //   handlers
  const onFilterFriends = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const tempFilteredFriendsInRoom = friendsInRoom.filter((friendInRoom) => friendInRoom.friend.name.toLowerCase().includes(value.toLowerCase()) || friendInRoom.friend.userName.toLowerCase().includes(value.toLowerCase()));
    setFilteredFriendsInRoom(tempFilteredFriendsInRoom);
    setSearchItem(value);
  };

  const onForwardMessage = () => {
    // check to.
    if (selectedFriends.length === 0) return;

    //   reset
    setForwardMessage(() => ({ message: {} as Message, to: [], show: false }));
  };

  return (
    <div
      id='forward-message-container'
      onClick={(e) => {
        // e.stopPropagation();
        if (e.target.id === 'forward-message-container') {
          setForwardMessage((prev) => ({ ...prev, show: false }));
        }
      }}
      className=' text-gray-400 fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm flex flex-col items-center  overflow-y-auto p-0 z-50'
    >
      <div className='flex flex-col overflow-y-auto relative mx-auto top-10 w-[80%] sm:w-[70%] md:w-[50%] lg:w-[40%] p-lg max-h-9/12     bg-black rounded-md '>
        <div className=''>
          <div className='flex items-center gap-md my-sm'>
            <button onClick={() => setForwardMessage((prev) => ({ ...prev, show: false }))} className='h-5 w-5 rounded-full flex items-center justify-center bg-skin-base text-skin-base p-md text-gray-700 hover:bg-red-300'>
              <RiCloseFill />
            </button>
            <p>Forward Message</p>
          </div>
        </div>
        {/* search friend input field */}
        <div className='flex items-center gap-md '>
          <input value={searchItem} onChange={onFilterFriends} type='text' className='w-full  p-lg rounded-md  text-skin-base border-2 border-gray-700 outline-none focus:border-teal-400 focus:outline-none transition duration-500 bg-transparent placeholder:text-gray-500' placeholder='find to whom you want to forward the message' />
        </div>

        {/* list of friends */}
        <div className='mt-10 font-mono select-none flex gap-md flex-col'>
          {filteredFriendsInRoom.map((friendInRoom) => (
            <div key={friendInRoom.friend.userId} className='flex flex-column items-center gap-2'>
              {/* a friend */}
              <label className='flex items-center gap-md cursor-pointer w-full'>
                <div className=''>
                  <input type='checkbox' id={friendInRoom.friend.userId} onChange={(e) => (selectedFriends.includes(friendInRoom.friend.userName) ? setSelectedFriends(selectedFriends.filter((item) => item !== friendInRoom.friend.userName)) : setSelectedFriends([...selectedFriends, friendInRoom.friend.userName]))} />
                </div>
                <div className='flex gap-xs items-center'>
                  <p className={`relative overflow-hidden text-skin-muted min-w-10 min-h-10 w-10 h-10  flex items-center justify-center   rounded-full flex-wrap  `} style={{ backgroundColor: getColorFromName(friendInRoom.friend.name), color: 'whitesmoke' }}>
                    {false && <img className='object-cover h-10 w-10 ' src='' alt='' />}
                    {!false && <span className='text-xs  w-10 h-10 flex items-center justify-center'>{getInitials(friendInRoom.friend.name)}</span>}
                  </p>
                  <div className=''>
                    <p className=' '>{friendInRoom.friend.name}</p>
                    <p className='text-xs text-skin-muted'>{friendInRoom.friend.userName}</p>
                  </div>
                </div>
              </label>
            </div>
          ))}
          {filteredFriendsInRoom.length === 0 && <p className='text-xs text-skin-muted text-center'>No friends found</p>}
        </div>
        {/* selected friends */}
        <div className='flex items-center gap-sm mt-10 flex-wrap'>
          {selectedFriends.map((friend) => (
            <p key={friend} className='text-xs text-gray-100 p-md bg-green-300 bg-opacity-20 rounded-md backdrop-blur-sm'>
              {friend}
            </p>
          ))}
        </div>

        <button onClick={onForwardMessage} className='p-md text-sm rounded-full flex items-center gap-sm self-end mt-sm'>
          <RiShareForward2Line />
          <p>Forward</p>
        </button>
      </div>
    </div>
  );
}
