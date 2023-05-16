'use client';
import { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext, Message, Connection, AllChats, Room } from '@/app/ChatContext';
import { RiVidiconFill, RiImageLine, RiFileLine, RiAttachmentLine, RiPhoneFill, RiMore2Fill, RiSendPlaneFill, RiLock2Fill } from 'react-icons/ri';
import { BsEmojiLaughingFill } from 'react-icons/bs';
import Conversation from './Conversation';
import socket from '@/app/socket.config';
import Link from 'next/link';
import { formatAmPm } from '@/app/util.fns';
import ThreeDotAnimation from './chatbox-sub-comp/TypingAnim';
import { v4 as uuidv4 } from 'uuid';
import Attachment from './chatbox-sub-comp/Attachment';

export default function ChatBox() {
  const [showAttachment, setShowAttachment] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  // console.log(typing);
  const { currentOpenChatId, lastSeen, rooms, setRooms, typing: typingState, wallpaper } = useContext(ChatContext);

  let currentRoom: Room;
  if (rooms.size) currentRoom = rooms.get(currentOpenChatId as string)!;

  console.log(lastSeen);
  const isUserTyping = typingState.find((user) => user.id === currentOpenChatId)?.typing || false;

  const typingIntervalRef = useRef<string>('');

  let typingInterval: string | number | NodeJS.Timeout | undefined;

  // use ref
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);

  // scroll to bottom
  useEffect(() => {
    chatBoxRef.current?.addEventListener('contextmenu', (e) => e.preventDefault());
  }, []);

  // open attachment
  const onAttachment = () => {
    setShowAttachment(!showAttachment);
  };

  const onChatMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatMessage === '') return;

    socket.emit('user:chatmessage', {});
    setChatMessage(''); // clear chat message

    const lastChild = chatContentRef.current?.lastElementChild as HTMLDivElement;
    // scroll to bottom
    chatContentRef.current && lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const onInputFieldChange = (e: any) => {
    setChatMessage((prev) => {
      if (prev.length !== e.target.value.length) setTyping(true);
      else setTyping(false);
      return e.target.value;
    });
  };

  const onInputFieldBlur = (e: any) => {
    setIsFocus(false);
    setTyping(false);
    clearInterval(typingInterval);
  };

  useEffect(() => {
    if (!isFocus) return clearInterval(typingInterval);

    typingInterval = setInterval(() => {
      if (typingIntervalRef.current === chatMessage) return setTyping(false);
      setTyping(true);
      typingIntervalRef.current = chatMessage;
    }, 500);
    return () => clearInterval(typingInterval);
  }, [typing]);

  const onMessageInputField = (e: any) => {
    setChatMessage(e.target.value);
    // const user = JSON.parse(localStorage.getItem('user') as string);
    // socket.emit('user:typing', { sender: user, receiver, id: currentOpenChatId, initiatedBy: user });
    // setTyping(true);
  };
  // key up
  const onMessageInputFieldKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.keyCode);
  };

  // console.log(allChats.length);
  if (!currentOpenChatId || rooms.size === 0)
    // no chat selected
    return <NoChatSelected />;
  const user = JSON.parse(localStorage.getItem('user') as string);
  return (
    //
    <div ref={chatBoxRef} className='flex flex-col max-h-screen h-screen w-full '>
      <header className='pointer w-full flex justify-between text-sm shadow-default z-10 p-xl text-skin-muted '>
        <div className='flex   gap-sm'>
          <div className='relative'>
            <span className='h-2 w-2 bg-green-500 rounded-full z-10 absolute    '></span>
            <button className='relative overflow-hidden text-skin-muted w-8 h-8 shadow-default flex items-center justify-center   rounded-full '>
              <img className='object-cover h-12 w-12 ' src={currentRoom.friend.avatarUrl} alt='' />
            </button>
          </div>
          <div className='flex flex-col '>
            <p>{currentRoom.friend.name} </p>

            <div className='flex items-center gap-sm'>
              <div className=''>
                {true && <p className=' text-green-400 text-xs'>Online</p>}
                {false && <p className='text-skin-muted text-xs'>last seen 2:30 PM</p>}
              </div>
              {isUserTyping && (
                <p className='flex items-center gap-tiny  text-skin-muted text-xs text-green-400'>
                  Typing <ThreeDotAnimation />
                </p>
              )}
            </div>
          </div>
        </div>
        <div className='flex gap-sm items-center  '>
          <button className=' '>
            <RiVidiconFill className='font-bold' />
          </button>
          <button className=''>
            <RiPhoneFill className='font-bold' />
          </button>
          <button className=''>
            <RiMore2Fill className='font-bold' />
          </button>
        </div>
      </header>
      <div
        style={{
          backgroundImage: `${wallpaper === 'default' && 'url(./wallpaper/default.png)'}`,
        }}
        ref={chatContentRef}
        className='grow gap-sm overflow-y-auto p-lg  md:p-2xl flex flex-col w-full'
      >
        {currentRoom.messages.length > 0 &&
          currentRoom.messages.map((message, id) => {
            if (id === 0)
              return (
                <div className='p-lg flex flex-col font-mono gap-sm justify-center items-center text-skin-muted text-xs my-sm  bg-green-200 text-green-500 w-fit mx-auto rounded' key={message.messageId}>
                  <div className=''>
                    <p> Welcome to a new chat</p>
                    <p> Chats are end-to-end encypted</p>
                  </div>
                  <p className='flex gap-sm font-tiny p-md rounded '>
                    <span>
                      {new Intl.DateTimeFormat('en', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }).format(new Date(message.createdAt))}
                    </span>
                    {formatAmPm(message.createdAt)}
                  </p>
                </div>
              );
            return <Conversation key={message.messageId} friend={currentRoom.friend} message={message} />;
          })}
      </div>
      {/* bottom part  */}
      <form onSubmit={onChatMessageSend} className='flex gap-xs items-center text-skin-muted rounded p-md z-10'>
        <div className='flex items-center  basis-0 shrink grow bg-black p-md rounded'>
          <button>
            <BsEmojiLaughingFill />
          </button>
          <input onKeyUp={onMessageInputFieldKeyUp} onBlur={() => setTyping(false)} onChange={onMessageInputField} value={chatMessage} placeholder='Message' className='block w-0 grow outline-none border-none p-md bg-black text-skin-muted pl-lg font-mono' type='text' />
          <div className=''>
            {showAttachment && <Attachment setShowAttachment={setShowAttachment} />}
            <button onClick={onAttachment}>
              <RiAttachmentLine />
            </button>
          </div>
        </div>
        {false && <button>d</button>}
        <button type='submit' className='text-skin-base flex items-center justify-center bg-black w-10 h-10 rounded-full'>
          <RiSendPlaneFill />
        </button>

        {/* attachment */}
        {/* {showAttachment && <Attachment setShowAttachment={setShowAttachment} />} */}
      </form>
    </div>
  );
}

function NoChatSelected() {
  return (
    <div className='flex select-none w-full flex-col max-h-screen h-screen  items-center justify-center   '>
      <div className='text-skin-muted font-mono flex flex-col items-center '>
        <h1 className='font-code text-2xl md:text-4xl my-xl '>smalltalk</h1>

        <div className='w-1/4'>
          <img src='/social.svg' alt='' className='pointer-events-none select-none' />
        </div>
        <p className='text-skin-muted text-lg md:text-2xl my-sm '>Start a conversation</p>
        <div className='flex flex-col text-sm gap-xs'>
          <p className='flex gap-xs items-center select-none'>
            <RiLock2Fill /> End to end encrypted
          </p>
          <p>
            Check out how chat
            <Link target='_blank' href='/doc/end-to-end/' className='underline underline-offset-2 pl-1'>
              encryption works
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}