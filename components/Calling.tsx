import { useRef, useEffect } from 'react';
import { RiPhoneFill } from 'react-icons/ri';
import Draggable from 'react-draggable';
import socket from '@/app/socket.config';

// remotePeer={remotePeerVideoCalling} showAnsweringVideoCall={showAnsweringVideoCall} setRemotePeerVideoCalling={setRemotePeerVideoCalling}
export default function Calling({ remotePeer, setShowAnsweringVideoCall, setRemotePeerVideoCalling }) {
  // ref to audio
  const playAudioRef = useRef<HTMLButtonElement>(null);
  const incomingCallAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (incomingCallAudioRef.current) {
      incomingCallAudioRef.current.play();
    }
  }, []);

  const onAcceptCall = () => {
    console.log('accepted call');
    setShowAnsweringVideoCall(true);
    setRemotePeerVideoCalling((prev) => ({
      ...prev,
      isCalling: false,
    }));

    //
    socket.emit('VideoCallingAccepted', {
      roomId: remotePeer.roomId,
      callingPeer: remotePeer.peer,
    });
  };
  const onRejectCall = () => {
    console.log('rejected call call');
    setShowAnsweringVideoCall(false);
    setRemotePeerVideoCalling((prev) => ({
      isCalling: false,
      peer: {},
      roomId: '',
    }));

    // close the remote peer video stream
    socket.emit('VideoCallingRejected', {
      roomId: remotePeer.roomId,
      callingPeer: remotePeer.peer,
    });
  };
  return (
    <Draggable>
      <div className='z-50 cursor-auto  flex gap-sm rounded-full items-center bg-black text-skin-muted fixed top-5 right-5 p-lg '>
        <div className='relative'>
          <button className='relative overflow-hidden text-skin-muted w-8 h-8 shadow-default flex items-center justify-center   rounded-full '>
            <img className='object-cover h-12 w-12 ' src={remotePeer.avatarUrl} alt='' />
          </button>
        </div>
        <div className='flex flex-col '>
          <p>{remotePeer.name}</p>
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
