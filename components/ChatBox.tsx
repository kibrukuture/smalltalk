'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext, Message, Room, BinFile, User, Link } from '@/app/ChatContext';
import { RiVidiconFill, RiImageLine, RiFileLine, RiArrowGoBackFill, RiAttachmentLine, RiPhoneFill, RiMore2Fill, RiSendPlaneFill, RiLock2Fill, RiMic2Line, RiDeleteBin6Line, RiDeleteBin6Fill, RiCamera3Line, RiLink } from 'react-icons/ri';
import { BsEmojiLaughingFill } from 'react-icons/bs';
import Conversation from './Conversation';
import socket from '@/app/socket.config';
import Attachment from './chatbox-sub-comp/Attachment';
import { formatAmPm } from '@/app/util.fns';
import ThreeDotAnimation from './chatbox-sub-comp/TypingAnim';
import { v4 as uuidv4 } from 'uuid';
import BinaryFileModal from './chatbox-sub-comp/BinaryFileModal';
import BinFileLoading from './chatbox-sub-comp/BinFileLoadig';
import { addNewMessage, scrapWebsite } from '@/app/util.fns';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ContextMenuTrigger } from 'react-contextmenu';
import ChatBoxContextMenu from './ChatBoxContextMenu';
import AnsweringVideoCall from './AnsweringVideoCall';
import AnsweringAudioCall from './AnsweringAudioCall';
import NoChatSelected from './NoChatSelected';
import Calling from './Calling';
import Timer from './Timer';
import CapturePicture from './CapturePicture';
import ImageViewer from './ImageViewer';
import ReplyMessage from './ReplyMessage';
import * as linkify from 'linkifyjs';
// import { formatTime } from '@/app/util.fns';
import Peer from 'peerjs';

export default function ChatBox() {
  const user = JSON.parse(localStorage.getItem('user')!) as User;

  // state
  const [showAttachment, setShowAttachment] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [linkInMessage, setLinkInMessage] = useState({
    isAny: false,
    url: '',
  });
  const [showBinaryFileModal, setShowBinaryFileModal] = useState(false);
  const [binFile, setBinFile] = useState({} as BinFile);
  const [binFileLoading, setBinFileLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);
  const [showAnsweringVideoCall, setShowAnsweringVideoCall] = useState(false);
  const [showAnsweringAudioCall, setShowAnsweringAudioCall] = useState(false);
  const [isAudioBeingRecorded, setIsAudioBeingRecorded] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [showCapturePicture, setShowCapturePicture] = useState(false);
  const [repliedMessageClicked, setRepliedMessageClicked] = useState({
    messageId: '',
    isClicked: false,
  });
  const [replyMessage, setReplyMessage] = useState({
    show: false,
    message: {} as Message,
  });

  const [imageViewer, setImageViewer] = useState({
    show: false,
    attachment: {},
    user: {} as User,
  });

  const [remotePeerVideoCalling, setRemotePeerVideoCalling] = useState({
    isCalling: false,
    peer: {} as User,
    roomId: '',
  });
  const [localPeer, setLocalPeer] = useState<Peer>(
    new Peer(user.userId!, {
      host: '/',
      port: 3001,
    }),
  );

  const { currentOpenChatId, setIsChatRoomTapped, rooms, setRooms, wallpaper } = useContext(ChatContext);

  let currentRoom: Room;
  if (rooms.size) currentRoom = rooms.get(currentOpenChatId as string)!;

  // use ref
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const outGoingCallAudioRef = useRef<HTMLAudioElement>(null);
  const audioRecordDataRef = useRef([] as Blob[]);

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

  // open attachment
  const onAttachment = () => {
    setShowAttachment(!showAttachment);
  };

  const onChatMessageSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatMessage === '' && !isAudioBeingRecorded) return;

    const messageId: string = uuidv4();
    let tempAttachment = null;

    if (audioRecorder) {
      console.log(':1:');
      audioRecorder.stop();

      const stopPromise = new Promise((resolve) => {
        audioRecorder.onstop = () => {
          const audioBlob = new Blob(audioRecordDataRef.current, { type: 'audio/webm' });

          const fileReader = new FileReader();
          console.log(':2:');
          fileReader.onloadend = () => {
            const audioURL = fileReader.result as string;

            const audio = new Audio(audioURL);
            audio.onloadedmetadata = () => {
              const duration = audio.duration;
              console.log(':3:');
              tempAttachment = {
                url: audioURL,
                type: audioBlob.type.split('/')[0],
                name: 'recording.webm',
                size: audioBlob.size,
                dur: duration,
                messageId,
                ext: 'webm',
                height: null,
                width: null,
              };
              resolve(null);
            };
          };
          fileReader.readAsDataURL(audioBlob);
        };
      });
      await stopPromise;
    }
    console.log(':4:');

    let embedLink: Link | null = null;
    if (linkInMessage.isAny) {
      const { data, status } = await scrapWebsite(linkInMessage.url);

      if (status === 'ok') {
        const { ogSiteName, ogUrl, ogTitle, ogDescription, ogType, ogImage, ogDate } = data;

        const image = ogImage[0];
        embedLink = {
          messageId,
          siteName: ogSiteName || '',
          url: ogUrl || '',
          title: ogTitle || '',
          description: ogDescription || '',
          type: ogType || 'Website',
          imageUrl: image && image.url,
          date: ogDate || '',
          imageHeight: image && image.height,
          imageWidth: image && image.width,
        };
      }
    }

    let reply = null,
      replyId = null;
    if (replyMessage.show) {
      reply = replyMessage.message;
      replyId = replyMessage.message.messageId;
    }

    console.log(embedLink);
    const message: Message = {
      messageId,
      roomId: currentOpenChatId,
      senderId: user.userId!,
      text: chatMessage,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      message: reply,
      replyId,
      emoji: '',
      link: embedLink,
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
    !isAudioBeingRecorded && setChatMessage('');

    const lastChild = chatContentRef.current?.lastElementChild as HTMLDivElement;
    // scroll to bottom
    chatContentRef.current && lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });

    if (isAudioBeingRecorded) {
      setIsAudioBeingRecorded(false);
      setAudioRecorder(null);
      audioStream && audioStream.getTracks().forEach((track) => track.stop());
    }

    // reset
    setLinkInMessage({
      isAny: false,
      url: '',
    });

    // reset reply message
    setReplyMessage({
      show: false,
      message: {} as Message,
    });
  };

  const onMessageInputField = (e: any) => {
    const { value } = e.target;

    setChatMessage(value);
    // there is a link.
    const links = linkify.find(value);
    const isFound = !!links.length;
    isFound
      ? setLinkInMessage({
          isAny: isFound,
          url: links[0].href,
        })
      : setLinkInMessage({
          isAny: false,
          url: '',
        });
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

    // socket.emit('StartVideoCall', {
    //   roomId: currentOpenChatId,
    //   sender: user,
    //   friend: currentRoom.friend,
    // });
  };

  const onStartAudioRecording = async () => {
    if (typeof window !== 'undefined') {
      // run only in browser environment.
      audioRecordDataRef.current.length = 0; //empty previous blobs
      setIsAudioBeingRecorded(true);

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // audioRecorder = new MediaRecorder(audioStream);

      const mediaRecorder = new MediaRecorder(audioStream);

      //when data is available, store it in chunks.
      mediaRecorder.ondataavailable = (e) => {
        audioRecordDataRef.current.push(e.data);
      };

      mediaRecorder.start();
      setAudioRecorder(mediaRecorder);
      setAudioStream(audioStream);
    }
  };

  const onAudioRecordRemove = () => {
    if (audioRecorder) {
      //audioRecorder =mediaRecorder
      audioRecorder.stop();
      audioRecordDataRef.current.length = 0; // remove blobs.
      setIsAudioBeingRecorded(false);
      setAudioRecorder(null);
      audioStream && audioStream.getTracks().forEach((track) => track.stop());
    }
  };

  socket.on('StartVideoCall', (data) => {
    onVideoCallDisplayUserMedia(true);
    const { sender, friend, roomId } = data;
  });

  const onGetCapturePicture = (data: string, size: number) => {
    console.log(data);

    setBinFile({
      name: 'capture.png',
      type: 'image',
      size,
      data: data,
      ext: 'png',
      dur: null,
    });

    setShowBinaryFileModal(true);
  };

  if (!currentOpenChatId || rooms.size === 0) return <NoChatSelected />;
  return (
    <div ref={chatBoxRef} className='flex flex-col max-h-screen h-screen w-full '>
      {remotePeerVideoCalling.isCalling && <Calling remotePeer={remotePeerVideoCalling} setShowAnsweringVideoCall={setShowAnsweringVideoCall} setRemotePeerVideoCalling={setRemotePeerVideoCalling} />}
      {imageViewer.show && <ImageViewer imageViewer={imageViewer} setImageViewer={setImageViewer} />}
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

      <div className='grow relative overflow-y-auto scroll-smooth'>
        {showCapturePicture && <CapturePicture setShowCapturePicture={setShowCapturePicture} onGetCapturePicture={onGetCapturePicture} />}
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
                return <Conversation repliedMessageClicked={repliedMessageClicked} setRepliedMessageClicked={setRepliedMessageClicked} setReplyMessage={setReplyMessage} key={message.messageId} friend={currentRoom.friend} message={message} setImageViewer={setImageViewer} />;
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
        {linkInMessage.isAny && (
          <div className='p-md flex items-center gap-sm border-0 border-l-4 border-black font-mono text-xs'>
            <RiLink />
            <span>{linkInMessage.url}</span>
          </div>
        )}
        {replyMessage.show && <ReplyMessage setRepliedMessageClicked={setRepliedMessageClicked} message={replyMessage.message} setReplyMessage={setReplyMessage} />}
        <form onSubmit={onChatMessageSend} className='flex gap-xs items-center text-skin-muted rounded p-md z-10'>
          <div className='flex items-center  basis-0 shrink grow bg-black p-md rounded'>
            {
              <button title={`${isAudioBeingRecorded ? 'Audio is being recorderd' : 'Emojis'}`} disabled={isAudioBeingRecorded} className={`${isAudioBeingRecorded && 'cursor-not-allowed'}`} type='button' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <BsEmojiLaughingFill />
              </button>
            }
            <input type='text' disabled={isAudioBeingRecorded} onChange={onMessageInputField} value={chatMessage} placeholder='Message' className='resize-none block w-0 grow outline-none border-none p-md bg-black text-skin-muted pl-lg font-mono whitespace-pre-wrap ' />
            <div className=''>
              {showAttachment && <Attachment setBinFileLoading={setBinFileLoading} setShowAttachment={setShowAttachment} setBinFile={setBinFile} setShowBinaryFileModal={setShowBinaryFileModal} />}

              {binFileLoading && /* (binFile.type === 'audio' || binFile.type === 'video') && */ <BinFileLoading />}

              {!isAudioBeingRecorded && (
                <div className='flex items-center gap-sm'>
                  <button type='button' onClick={() => setShowCapturePicture(true)} title='Camera'>
                    <RiCamera3Line />
                  </button>
                  <button title='Attach files' type='button' onClick={onAttachment}>
                    <RiAttachmentLine />
                  </button>
                </div>
              )}
              {isAudioBeingRecorded && (
                <p className='flex items-center gap-xs text-skin-muted font-mono'>
                  <Timer />
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
          {/* show modal after file is choosen */}
          {showBinaryFileModal && <BinaryFileModal binFile={binFile} setShowBinaryFileModal={setShowBinaryFileModal} />}
        </form>
      </div>
    </div>
  );
}
