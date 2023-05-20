import { useEffect, useRef, useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { User } from '@/app/ChatContext';
import { ChatContext } from '@/app/ChatContext';
import { RiMicFill, RiMicOffFill, RiPhoneFill, RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import Peer from 'peerjs';
import socket from '@/app/socket.config';

export default function AnsweringVideoCall({ onVideoCallDisplayUserMedia, localPeer, remotePeerVideoCalling }: { onVideoCallDisplayUserMedia: (val: boolean) => void; localPeer: Peer }) {
  const [micMuted, setMicMuted] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [caller, setCaller] = useState({} as User);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  //consume context
  const { currentOpenChatId, rooms } = useContext(ChatContext);

  //user from locak storage
  const user = JSON.parse(localStorage.getItem('user')!) as User;

  useEffect(() => {
    //get local video

    let localStream: MediaStream;

    if (typeof navigator !== 'undefined') {
      (async () => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          // localVideoRef.current.muted = true;
          localVideoRef.current.addEventListener('loadedmetadata', () => {
            localVideoRef.current!.play();
          });
        }

        console.log('\n########################call started: I got the stream.################################\n');
        const call = localPeer.call(remotePeerVideoCalling.peer.userId, localStream);
        call.on('stream', (stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            // localVideoRef.current.muted = true;
            remoteVideoRef.current.addEventListener('loadedmetadata', () => {
              remoteVideoRef.current!.play();
            });
          }
        });
      })();

      localPeer.on('call', (call) => {
        console.log('\n########################call received################################\n');
        call.answer(localStream);
        call.on('stream', (stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        });
      });

      // localPeer.on('open', (id) => {
      //   // PeerServer
      //   console.log('#######################PeerServer started################################\n', id);
      //   socket.emit('StartVideoCall', {
      //     roomId: currentOpenChatId,
      //     sender: user,
      //     friend: rooms.get(currentOpenChatId)?.friend,
      //   });
      // });

      socket.on('VideoCallAccepted', (data) => {
        const { roomId, callingPeer } = data;
        setCaller(callingPeer);
      });
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
    }
    onVideoCallDisplayUserMedia(false);
  };
  //w-full md:2/3 lg:w-1/2
  return (
    <div className={`absolute top-0 left-0 ${isWide ? 'w-full md:2/3 lg:w-1/2 h-full' : 'w-1/3 md:w-1/4 lg:1/5 h-1/3'}  p-sm z-40 text-sm font-mono text-white `}>
      {/* remote video feed */}
      <video ref={remoteVideoRef} src='' className='bg-black min-w-full min-h-full w-full h-full object-cover  rounded-xl' />
      {/* local video feed  */}
      <Draggable bounds='parent'>
        <video ref={localVideoRef} src='' className={` absolute top-5 right-5 h-[150px] w-[150px] shadow-default  rounded-xl object-cover ${!isWide && 'hidden'}`} />
      </Draggable>
      {/* controls */}
      {isWide && (
        <div className='flex items-center justify-around gap-sm p-lg transform translate-x-1/2 absolute w-1/2 md:2/3 lg:w-1/2 bottom-10  left-0  h-[50px] bg-black opacity-50 backdrop-blur-md  rounded-full '>
          <div className='flex items-center gap-xs'>
            <button onClick={onMic} title='Microphone' className=' rounded-full flex items-center justify-center p-md'>
              {!micMuted && <RiMicFill size={20} />}
              {micMuted && <RiMicOffFill size={20} />}
            </button>
            <button onClick={onLeaveVideoCall} title='close' className='bg-red-500  p-md gap-xs   rounded-full flex items-center justify-center '>
              <RiPhoneFill size={20} />
              <span>Leave</span>
            </button>
          </div>
          {/* time  */}
          <div className='flex items-center gap-xs'>
            <span className='text-xs'>
              <AudioTimer />
            </span>
          </div>
        </div>
      )}
      {/* wide or small */}
      <div onClick={onWideOrSmall} className=' absolute top-5 left-5  '>
        <button className='p-sm md:p-md flex items-center justify-center bg-black opacity-50 backdrop-blur-md  rounded-full'>{isWide ? <RiArrowDropDownLine size={20} /> : <RiArrowDropUpLine size={20} />}</button>
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
