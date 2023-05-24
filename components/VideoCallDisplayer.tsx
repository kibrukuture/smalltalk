import { useEffect, useRef, useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { User } from '@/app/ChatContext';
import { ChatContext } from '@/app/ChatContext';
import ChatRoomContext from '@/app/ChatRoomContext';
import { RiMicFill, RiMicOffFill, RiPhoneFill, RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import Peer from 'peerjs';
import socket from '@/app/socket.config';

export default function ShowVideoCallDisplayer({
  setShowVideoCallDisplayer,
  localPeer,
  remotePeerOnlineStatus,
}: // remotePeerVideoCalling,
{
  setShowVideoCallDisplayer: (val: boolean) => void;
  localPeer: Peer | null;
  remotePeerOnlineStatus: {
    isOnline: boolean;
    remotePeer: User;
    roomId: string;
  };
  // remotePeerVideoCalling: {
  //   isCalling: boolean;
  //   peer: User;
  //   roomId: string;
  // };
}) {
  // state
  const [micMuted, setMicMuted] = useState(false);
  const [isWide, setIsWide] = useState(true);
  // const [caller, setCaller] = useState({} as User);
  const [isStillNotAnswered, setIsStillNotAnswered] = useState(true);
  const [videoStream, setVideoStream] = useState<MediaStream>();

  // video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  //consume context
  const { currentOpenChatId, rooms } = useContext(ChatContext);
  const { localUserVideoStream, setLocalUserVideoStream, caller, isCallAnswered } = useContext(ChatRoomContext);

  //user from locak storage
  const user = JSON.parse(localStorage.getItem('user')!) as User;
  const friend = rooms.get(currentOpenChatId)?.friend!;

  useEffect(() => {
    //get local video

    let localStream: MediaStream;

    if (typeof navigator !== 'undefined') {
      (async () => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setVideoStream(localStream);
        setLocalUserVideoStream(localStream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.muted = true;
          localVideoRef.current.addEventListener('loadedmetadata', () => {
            localVideoRef.current!.play();
          });
        }

        console.log('Remote & Local UserId: ', friend.userId!, user.userId);
        // call the remote peer
        const call = localPeer!.call(friend.userId!, localStream);
        call.on('stream', (stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.addEventListener('loadedmetadata', () => {
              remoteVideoRef.current!.play();
            });
          }
        });

        //listen to incoming call
        localPeer!.on('call', (call) => {
          console.log('\n########################call received################################\n');
          call.answer(localStream);
          call.on('stream', (stream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
          });
        });

        // video call accepted
        socket.on('VideoCallAccepted', (data) => {
          const { caller, friend, roomId } = data;
          setIsStillNotAnswered(false);
          // setCaller(caller);
          console.log(' setIsStillNotAnswered(false);: ');
        });
      })();
    }
    return () => {
      socket.emit('EndVideoCall', {
        roomId: currentOpenChatId,
        remotePeer: user,
      });
    };
  }, []);

  // handlers
  const onMic = () => {
    setMicMuted(!micMuted);
    // if (localVideoRef.current) {
    //   localVideoRef.current.srcObject!.getAudioTracks()[0].enabled = !micMuted;
    // }
  };

  const onWideOrSmall = () => {
    setIsWide(!isWide);
  };

  const onLeaveVideoCall = () => {
    // close remote peer's user media as well.

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current && (remoteVideoRef.current.srcObject = null);
      // setAudioRecorder(null);
      videoStream && videoStream.getTracks().forEach((track) => track.stop());
    }

    setShowVideoCallDisplayer(false);
  };
  //w-full md:2/3 lg:w-1/2
  return (
    <Draggable axis={isWide ? 'x' : 'both'}>
      <div className={` ${isWide ? 'w-full md:2/3 lg:w-1/2 h-full' : 'w-1/3 md:w-1/4 lg:1/5 h-1/3'}  p-sm z-40 text-sm font-mono text-white fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-0`}>
        {/* remote video feed */}
        {(!isStillNotAnswered || isCallAnswered) && <video ref={remoteVideoRef} src='' className='bg-black min-w-full min-h-full w-full h-full object-cover  rounded-xl' />}
        {isStillNotAnswered && user.userId === caller.userId && (
          <div className={`flex gap-md flex-col items-center justify-center h-full bg-black`}>
            <span className='text-md text-gray-300'>{friend.name}</span>
            <span className='text-lg animate-pulse'>Calling...</span>
          </div>
        )}
        {/* local video feed  */}
        <Draggable bounds='parent'>
          <video ref={localVideoRef} src='' className={` absolute top-5 right-5 h-[150px] w-[150px] shadow-default  rounded-xl object-cover ${!isWide && 'hidden'}`} />
        </Draggable>
        {/* controls */}
        {isWide && (
          <div className='flex items-center justify-around gap-sm p-lg transform translate-x-1/2 absolute w-1/2 md:2/3 lg:w-1/2 bottom-10  left-0  h-[50px] bg-black opacity-50 backdrop-blur-md  rounded-full '>
            <div className='flex items-center gap-xs'>
              <button onClick={onMic} title={micMuted ? 'Unmute' : 'Mute'} className=' rounded-full flex items-center justify-center p-md'>
                {!micMuted && <RiMicFill size={20} />}
                {micMuted && <RiMicOffFill size={20} />}
              </button>
              <button onClick={onLeaveVideoCall} title='Close the call' className='bg-red-500  p-md gap-xs   rounded-full flex items-center justify-center '>
                <RiPhoneFill size={20} />
                <span>Leave</span>
              </button>
            </div>
            {/* time  */}
            <div className='flex items-center gap-xs'>
              <span className='text-xs'>00:00:00</span>
            </div>
          </div>
        )}
        {/* wide or small */}
        <div onClick={onWideOrSmall} className=' absolute top-5 left-5  '>
          <button className='p-sm md:p-md flex items-center justify-center bg-black opacity-50 backdrop-blur-md  rounded-full'>{isWide ? <RiArrowDropDownLine size={20} /> : <RiArrowDropUpLine size={20} />}</button>
        </div>
      </div>
    </Draggable>
  );
}

function formatTime(milliseconds: number) {
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
