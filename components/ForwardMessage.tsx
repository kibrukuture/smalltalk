import { useEffect, useRef, useState } from 'react';
import { Message } from '@/app/ChatContext';
import { RiCloseFill, RiShareForward2Line } from 'react-icons/ri';
import { getInitials, getColorFromName } from '@/app/util.fns';

// create a list of friends with different names and usernames
const initialProp = [
  {
    name: 'Kibru J. Kuture',
    username: '@kibrukuture',
    id: '1',
  },
  {
    name: 'Adam K. Matt',
    username: '@adamk.matt',
    id: '2',
  },
  {
    name: 'Larry M. Page',
    username: '@larrypage',

    id: '3',
  },
];

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
  const [searchItem, setSearchItem] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [friends, setFriends] = useState(initialProp);

  //   handlers
  const onFilterFriends = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const filteredFriends = initialProp.filter((friend) => friend.name.toLowerCase().includes(value.toLowerCase()) || friend.username.toLowerCase().includes(value.toLowerCase()));
    console.log(filteredFriends);
    setFriends(filteredFriends);
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
        {/* search friend */}

        <div className='flex items-center gap-md '>
          <input value={searchItem} onChange={onFilterFriends} type='text' className='w-full  p-lg rounded-md  text-skin-base border-2 border-gray-700 outline-none focus:border-teal-400 focus:outline-none transition duration-500 bg-transparent placeholder:text-gray-500' placeholder='find to whom you want to forward the message' />
        </div>

        {/* list of friends */}

        <div className='mt-10 font-mono select-none flex gap-md flex-col'>
          {friends.map((friend) => (
            <div className=''>
              <div key={friend.id} className='flex flex-column items-center gap-2'>
                {/* a friend */}
                <label className='flex items-center gap-md cursor-pointer w-full'>
                  <div className=''>
                    <input type='checkbox' id={friend.id} onChange={(e) => (selectedFriends.includes(friend.username) ? setSelectedFriends(selectedFriends.filter((item) => item !== friend.username)) : setSelectedFriends([...selectedFriends, friend.username]))} />
                  </div>
                  <div className='flex gap-xs items-center'>
                    <p className={`relative overflow-hidden text-skin-muted min-w-10 min-h-10 w-10 h-10  flex items-center justify-center   rounded-full flex-wrap  `} style={{ backgroundColor: getColorFromName(friend.name), color: 'whitesmoke' }}>
                      {false && <img className='object-cover h-10 w-10 ' src='' alt='' />}
                      {!false && <span className='text-xs  w-10 h-10 flex items-center justify-center'>{getInitials(friend.name)}</span>}
                    </p>
                    <div className=''>
                      <p className=' '>{friend.name}</p>
                      <p className='text-xs text-skin-muted'>{friend.username}</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          ))}
          {friends.length === 0 && (
            <p className='text-xs text-skin-muted text-center'>
              <img src='/illustrations/no-data.svg' alt='' />
              No friends found
            </p>
          )}
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
