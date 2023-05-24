import { useRef, useEffect, useContext } from 'react';
import { RiPhoneFill } from 'react-icons/ri';
import { User } from '@/app/ChatContext';
import Draggable from 'react-draggable';
import socket from '@/app/socket.config';
import ChatRoomContext, { RemotePeerVideoCallingStatus } from '@/app/ChatRoomContext';
import { ChatContext } from '@/app/ChatContext';

const user = JSON.parse(localStorage.getItem('user')!) as User;

export default function Calling() {
  // consume context
  const { setIsCallAnswered, remotePeerVideoCalling, setRemotePeerVideoCalling, setShowVideoCallDisplayer, showVideoCallDisplayer } = useContext(ChatRoomContext);
  const { setCurrentOpenChatId } = useContext(ChatContext);
  // ref to audio
  const playAudioRef = useRef<HTMLButtonElement>(null);
  const incomingCallAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (incomingCallAudioRef.current) {
      incomingCallAudioRef.current.play();
    }
  }, []);

  // call accepted
  const onAcceptCall = () => {
    // console.log('accepted call');
    setCurrentOpenChatId(remotePeerVideoCalling.roomId);
    setShowVideoCallDisplayer(true);
    setIsCallAnswered(true);

    //
    socket.emit('VideoCallAccepted', {
      roomId: remotePeerVideoCalling.roomId,
      caller: remotePeerVideoCalling.peer,
      friend: user,
    });

    setRemotePeerVideoCalling({
      isCalling: false,
      peer: {} as User,
      roomId: '',
    });
  };

  // call rejected
  const onRejectCall = () => {
    console.log('rejected call call');
    setShowVideoCallDisplayer(false);
    setIsCallAnswered(false);
    // close the remote peer video stream
    socket.emit('VideoCallRejected', {
      roomId: remotePeerVideoCalling.roomId,
      caller: remotePeerVideoCalling.peer,
      friend: user,
    });

    setRemotePeerVideoCalling({
      isCalling: false,
      peer: {} as User,
      roomId: '',
    });
  };
  return (
    <Draggable>
      <div className='z-50 cursor-auto  flex gap-sm rounded-full items-center bg-black text-skin-muted fixed top-5 right-5 p-lg '>
        <div className='relative'>
          <button className='relative overflow-hidden text-skin-muted w-8 h-8 shadow-default flex items-center justify-center   rounded-full '>
            <img className='object-cover h-12 w-12 ' src={remotePeerVideoCalling.peer.avatarUrl} alt='' />
          </button>
        </div>
        <div className='flex flex-col '>
          <p>{remotePeerVideoCalling.peer.name}</p>
          <p className='text-xs font-mono flex items-center gap-sm '>
            <span>Calling </span>
            <span className='relative flex h-3 w-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-sky-500'></span>
            </span>
          </p>
        </div>
        <div className='flex gap-sm items-center '>
          <button onClick={onRejectCall} title='close' className='bg-red-500 text-white h-8 w-8 rounded-full flex items-center justify-center p-sm'>
            <span className='transform rotate-[135deg] cursor-pointer'>
              <RiPhoneFill />
            </span>
          </button>
          <button onClick={onAcceptCall} title='answer' className='bg-green-500 text-white h-8 w-8 rounded-full flex items-center justify-center p-sm'>
            <RiPhoneFill className='cursor-pointer' />
          </button>
        </div>
        {/* incoming call audio  */}
        <button ref={playAudioRef} className='sr-only'></button>
        <audio ref={incomingCallAudioRef} loop={true} src='/sound-effects/incoming-call.wav' preload='auto' />
      </div>
    </Draggable>
  );
}
