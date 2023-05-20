'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext, Message, Room, BinFile, User } from '@/app/ChatContext';
import { RiVidiconFill, RiImageLine, RiFileLine, RiArrowGoBackFill, RiAttachmentLine, RiPhoneFill, RiMore2Fill, RiSendPlaneFill, RiLock2Fill, RiMic2Line, RiDeleteBin6Line, RiDeleteBin6Fill } from 'react-icons/ri';
import { BsEmojiLaughingFill } from 'react-icons/bs';
import Conversation from './Conversation';
import socket from '@/app/socket.config';
import Link from 'next/link';
import { formatAmPm } from '@/app/util.fns';
import ThreeDotAnimation from './chatbox-sub-comp/TypingAnim';
import { v4 as uuidv4 } from 'uuid';
import Attachment from './chatbox-sub-comp/Attachment';
import BinaryFileModal from './chatbox-sub-comp/BinaryFileModal';
import BinFileLoading from './chatbox-sub-comp/BinFileLoadig';
import { addNewMessage } from '@/app/util.fns';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ContextMenuTrigger } from 'react-contextmenu';
import ChatBoxContextMenu from './ChatBoxContextMenu';
import AnsweringVideoCall from './AnsweringVideoCall';
import AnsweringAudioCall from './AnsweringAudioCall';
import Calling from './Calling';
// import { formatTime } from '@/app/util.fns';
import Peer from 'peerjs';

export default function ChatBox() {
  const user = JSON.parse(localStorage.getItem('user')!) as User;

  // state
  const [showAttachment, setShowAttachment] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [showBinaryFileModal, setShowBinaryFileModal] = useState(false);
  const [binFile, setBinFile] = useState({} as BinFile);
  const [binFileLoading, setBinFileLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);
  const [showAnsweringVideoCall, setShowAnsweringVideoCall] = useState(false);
  const [showAnsweringAudioCall, setShowAnsweringAudioCall] = useState(false);
  const [isAudioBeingRecorded, setIsAudioBeingRecorded] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder>();
  const [recordingState, setRecordingState] = useState('stopped');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [remotePeerVideoCalling, setRemotePeerVideoCalling] = useState({
    isCalling: false,
    peer: {} as User,
    roomId: '',
  });
  // const [isVideoBeingRecorded, setIsVideoBeingRecorded] = useState(false);
  // const [videoRecorder, setVideoRecorder] = useState<MediaRecorder>();
  const [localPeer, setLocalPeer] = useState<Peer>(
    new Peer(user.userId!, {
      host: '/',
      port: 3001,
    }),
  );
  // console.log(typing);
  const { currentOpenChatId, setIsChatRoomTapped, lastSeen, rooms, setRooms, typing: typingState, wallpaper } = useContext(ChatContext);

  let currentRoom: Room;
  if (rooms.size) currentRoom = rooms.get(currentOpenChatId as string)!;

  // use ref
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const audioTimerRef = useRef<number>(0);
  const outGoingCallAudioRef = useRef<HTMLAudioElement>(null);

  // scroll to bottom
  useEffect(() => {
    chatBoxRef.current?.addEventListener('contextmenu', (e) => e.preventDefault());

    // set inner width
    if (typeof window !== 'undefined') {
      setInnerWidth(window.innerWidth);
    }

    // accept or reject call.
    socket.on('AcceptOrRejectVideoCall', (data) => {
      setRemotePeerVideoCalling({
        isCalling: true,
        peer: data.sender,
        roomId: data.roomId,
      });
    });
    // video call rejected.
    socket.on('VideoCallAcceptingPeerRejected', (data) => {
      setShowAnsweringVideoCall(false);
    });
    // video call ended ( by either of the peers)
    socket.on('EndVideoCall', (data) => {
      console.log('remote peer ended video call.');
      setShowAnsweringVideoCall(false);
    });
  }, []);

  useEffect(() => {
    // check if audiorecorder exist

    if (audioRecorder) {
      // console.log('fuck that shit');
      audioRecorder.ondataavailable = (e) => {
        console.log('fuck that shit', e.data);
        // chunks.push(e.data);
        setAudioChunks((prev) => [...prev, e.data]);
      };
      audioRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(blob);
      };
    }
  }, [recordingState]);

  // open attachment
  const onAttachment = () => {
    setShowAttachment(!showAttachment);
  };

  const onChatMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatMessage === '' && !isAudioBeingRecorded) return;

    const messageId: string = uuidv4();
    console.log('the audio recorder', audioRecorder);

    let tempAttachment = null;

    console.log('audio recorder:', audioRecorder);

    if (audioRecorder) {
      const audioURL = URL.createObjectURL(audioBlob);

      // console.log('audioURL', audioURL);
      tempAttachment = {
        url: audioURL,
        type: 'audio',
        name: 'audio.ogg',
        size: audioBlob.size,
        dur: null,
        messageId,
        ext: 'ogg',
        height: null,
        width: null,
      };
      setAudioChunks([]);
      setIsAudioBeingRecorded(false);
    }

    const message: Message = {
      messageId,
      roomId: currentOpenChatId,
      senderId: user.userId!,
      text: chatMessage,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      message: [],
      replyId: null,
      emoji: '',
      link: null,
      attachment: tempAttachment,
    };

    socket.emit('ExchangeChatMessage', {
      message,
      roomId: currentOpenChatId,
      sender: user,
      friend: currentRoom.friend,
    });

    //update rooms with new message
    addNewMessage(currentOpenChatId, message, setRooms);

    // update local message.
    setChatMessage(''); // clear chat message

    const lastChild = chatContentRef.current?.lastElementChild as HTMLDivElement;
    // scroll to bottom
    chatContentRef.current && lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const onMessageInputField = (e: any) => {
    setChatMessage(e.target.value);
  };

  const onVideoCallDisplayUserMedia = (val: boolean) => {
    setShowAnsweringVideoCall(val);

    // remove the remote users from
  };

  localPeer.on('open', (id) => {
    console.log('local peer id is : ', id);
  });
  const onStartVideoCall = () => {
    setShowAnsweringVideoCall(true);
    // emit informatin to remote peer

    //ringing until remote user answers.
    outGoingCallAudioRef.current && outGoingCallAudioRef.current.play();

    socket.emit('StartVideoCall', {
      roomId: currentOpenChatId,
      sender: user,
      friend: currentRoom.friend,
    });
  };

  const onStartAudioRecording = async () => {
    if (typeof window !== 'undefined') {
      // run only in browser environment.
      setIsAudioBeingRecorded(true);

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // audioRecorder = new MediaRecorder(audioStream);

      const recoder = new MediaRecorder(audioStream);
      setAudioRecorder(recoder);
      recoder.start();
      setRecordingState(recoder.state);
      console.log('recorder state', recoder.state);
    }
  };

  const onAudioRecordRemove = () => {
    // chunks.length = 0;
    // audioRecorder.ondataavailable = null;
    console.log('the audio recorder', audioChunks);
    setIsAudioBeingRecorded(false);
    setRecordingState('stopped');
    setAudioChunks([]);
  };
  socket.on('StartVideoCall', (data) => {
    onVideoCallDisplayUserMedia(true);
    const { sender, friend, roomId } = data;

    console.log('\n########################call started: I got the stream.################################\n');
  });

  console.log('chat box rendering');
  if (!currentOpenChatId || rooms.size === 0) return <NoChatSelected />;
  return (
    <div ref={chatBoxRef} className='flex flex-col max-h-screen h-screen w-full '>
      {remotePeerVideoCalling.isCalling && <Calling remotePeer={remotePeerVideoCalling} setShowAnsweringVideoCall={setShowAnsweringVideoCall} setRemotePeerVideoCalling={setRemotePeerVideoCalling} />}
      {false && <audio ref={outGoingCallAudioRef} loop={true} src='/sound-effects/caller.wav' preload='auto' />}
      <div className='flex items-center   '>
        {/* arrow back button   */}
        {innerWidth <= 768 && (
          <button className='grow-0 p-md ' onClick={() => setIsChatRoomTapped(false)}>
            <RiArrowGoBackFill className='font-bold' size={20} />
          </button>
        )}
        <header className='grow pointer w-full flex justify-between text-sm shadow-default z-10 p-xl text-skin-muted '>
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
              </div>
            </div>
          </div>
          <div className='flex gap-sm items-center  '>
            {/* video  */}
            <button title={`${showAnsweringVideoCall ? "Already calling.Can't restart another" : 'Video call'}`} disabled={showAnsweringVideoCall} onClick={onStartVideoCall} className={`${showAnsweringVideoCall && 'cursor-not-allowed'}`}>
              <RiVidiconFill className='font-bold' />
            </button>
            {/* audio  */}
            <button title={`${showAnsweringAudioCall ? "Already calling.Can't restart another" : 'Audio call'}`} disabled={showAnsweringAudioCall} onClick={() => setShowAnsweringAudioCall(true)} className={`${showAnsweringAudioCall && 'cursor-not-allowed'}`}>
              <RiPhoneFill className='font-bold' />
            </button>
            <button className=''>
              <RiMore2Fill className='font-bold' />
            </button>
          </div>
        </header>
      </div>

      <div className='grow relative overflow-y-auto'>
        <ContextMenuTrigger id={currentOpenChatId} className='grow'>
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
                    <div className='min-h-full h-full p-lg flex flex-col font-mono gap-sm justify-center items-center text-skin-muted text-xs my-sm  bg-green-200 text-green-500 w-fit mx-auto rounded' key={message.messageId}>
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
          <ChatBoxContextMenu />
        </ContextMenuTrigger>

        {showAnsweringAudioCall && <AnsweringAudioCall />}
        {showAnsweringVideoCall && <AnsweringVideoCall onVideoCallDisplayUserMedia={onVideoCallDisplayUserMedia} localPeer={localPeer} remotePeerVideoCalling={remotePeerVideoCalling} />}
      </div>
      {/* bottom part  */}
      <div className='flex flex-col  '>
        {showEmojiPicker && (
          <div className='max-w-fit  p-lg'>
            <Picker data={data} onEmojiSelect={(emoji: any) => setChatMessage(chatMessage + emoji.native)} onClickOutside={() => setShowEmojiPicker(false)} theme='light' />
          </div>
        )}
        <form onSubmit={onChatMessageSend} className='flex gap-xs items-center text-skin-muted rounded p-md z-10'>
          <div className='flex items-center  basis-0 shrink grow bg-black p-md rounded'>
            <button type='button' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <BsEmojiLaughingFill />
            </button>
            <input onChange={onMessageInputField} value={chatMessage} placeholder='Message' className='block w-0 grow outline-none border-none p-md bg-black text-skin-muted pl-lg font-mono' type='text' />
            <div className=''>
              {showAttachment && <Attachment setBinFileLoading={setBinFileLoading} setShowAttachment={setShowAttachment} setBinFile={setBinFile} setShowBinaryFileModal={setShowBinaryFileModal} />}

              {binFileLoading && /* (binFile.type === 'audio' || binFile.type === 'video') && */ <BinFileLoading />}

              {!isAudioBeingRecorded && (
                <button type='button' onClick={onAttachment}>
                  <RiAttachmentLine />
                </button>
              )}
              {isAudioBeingRecorded && (
                <p className='flex items-center gap-xs text-skin-muted font-mono'>
                  <AudioTimer />
                  <span className='h-3 w-3 bg-red-500 rounded-full animate-pulse '></span>
                </p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-xs'>
            {isAudioBeingRecorded && (
              <button onClick={onAudioRecordRemove} type='button' className='text-skin-base flex items-center justify-center text-red-500 w-10 h-10 rounded-full bg-black'>
                <RiDeleteBin6Fill />
              </button>
            )}
            {(chatMessage.trim().length > 0 || isAudioBeingRecorded) && (
              <button type='submit' className='text-skin-base flex items-center justify-center bg-black w-10 h-10 rounded-full'>
                <RiSendPlaneFill />
              </button>
            )}
            {chatMessage.trim().length === 0 && !isAudioBeingRecorded && (
              <button onClick={onStartAudioRecording} type='button' className='text-skin-base flex items-center justify-center bg-black w-10 h-10 rounded-full'>
                <RiMic2Line />
              </button>
            )}
          </div>

          {/* attachment */}
          {/* {showAttachment && <Attachment setShowAttachment={setShowAttachment} />} */}

          {/* show modal after file is choosen */}
          {showBinaryFileModal && <BinaryFileModal binFile={binFile} setShowBinaryFileModal={setShowBinaryFileModal} />}
        </form>
      </div>
    </div>
  );
}

function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const miliseconds = milliseconds % 1000;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMiliseconds = String(miliseconds).padStart(3, '0');

  return `${formattedMinutes}:${formattedSeconds}:${formattedMiliseconds}`;
}

function AudioTimer() {
  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTime);
    }, 1);

    return () => {
      clearInterval(interval);
      console.log('unmounted');
    };
  }, [startTime]);

  const formattedTime = formatTime(currentTime);

  return (
    <>
      <span>{formattedTime}</span> &bull;
    </>
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

// listen to Handshake with a remote peer
// socket.on('StartVideoCall', (data) => {
//   setShowAnsweringVideoCall(true);
//   console.log('handshake with remote peer', data);

//   const conn = localPeer.connect(data.friend.userId!);
//   // localPeer.on('call', (call) => {
//   //   call.answer(window.localStream);
//   //   call.on('stream', (stream) => {
//   //     console.log('stream', stream);
//   //     setShowAnsweringVideoCall(false);
//   //   });

//   conn.on('open', function () {
//     // Receive messages
//     conn.on('data', function (data) {
//       console.log('Received', data);
//     });

//     // Send messages
//     conn.send('Hello!');
//   });
// });
// localPeer.on('connection', function (conn) {
//   conn.on('data', function (data) {
//     console.log('received data', data);
//   });
// });

/*
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  const [count, setCount]=React.useState(0)

  React.useEffect(()=>{
console.log(count)
setInterval(()=>{
setCount(prev=>prev+1)
},1000)

  }, [])
  return  <div>{count}</div>
}

ReactDOM.render(<App />, document.getElementById('root'))



*/
