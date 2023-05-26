import { useEffect, useRef, useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { User } from '@/app/ChatContext';
import { ChatContext } from '@/app/ChatContext';
import ChatRoomContext from '@/app/ChatRoomContext';
import { RiMicFill, RiMicOffFill, RiPhoneFill, RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';

import socket from '@/app/socket.config';

export default function VoiceCallDisplayer({
  setShowVoiceCallDisplayer,
  // outGoingCallAudioRef,
  // localPeer,
  remotePeerOnlineStatus,
}: // remotePeerVideoCalling,
{
  setShowVoiceCallDisplayer: (val: boolean) => void;
  // localPeer: Peer | null;
  remotePeerOnlineStatus: {
    isOnline: boolean;
    remotePeer: User;
    roomId: string;
  };
  outGoingCallAudioRef: any;
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
  const [audioStream, setAudioStream] = useState<MediaStream>();

  // video refs
  const localAudioRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLVideoElement>(null);
  //   let backgroundTime = useRef(0);
  //   let backgroundTimeInterval;

  //consume context
  const { currentOpenChatId, rooms } = useContext(ChatContext);
  const { setLocalPeer, localPeer, caller, setCaller, isCallAnswered } = useContext(ChatRoomContext);

  //user from locak storage
  const user = JSON.parse(localStorage.getItem('user')!) as User;
  const friend = rooms.get(currentOpenChatId)?.friend!;

  useEffect(() => {
    //get local video
    let localStream: MediaStream;

    if (typeof navigator !== 'undefined') {
      (async () => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setAudioStream(localStream);
        // setLocalUseraudioStream(localStream);

        if (localAudioRef.current) {
          localAudioRef.current.srcObject = localStream;
          localAudioRef.current.muted = true;
          localAudioRef.current.addEventListener('loadedmetadata', () => {
            localAudioRef.current!.play();
          });
        }

        if (!caller.userId) {
          // call the remote peer
          const call = localPeer!.call(friend.userId!, localStream);

          call.on('stream', (stream) => {
            console.log('I am a caller ');
            if (remoteAudioRef.current) {
              remoteAudioRef.current.srcObject = stream;
              // setRemoteaudioStream(stream);
              remoteAudioRef.current.addEventListener('loadedmetadata', () => {
                remoteAudioRef.current!.play();
              });
            }
          });

          call.on('close', function () {
            console.log('// Do something when the call is closed.');
          });

          call.on('error', function (err) {
            console.log(':Error on call:', err);
          });

          call.on('iceStateChanged', (state) => console.log('Ice state changed to: ', state));
        }
        //listen to incoming call
        else {
          localPeer!.on('call', (call) => {
            call.answer(localStream);
            call.on('stream', (stream) => {
              console.log('I am a listener ');
              if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = stream;
                //  setRemoteaudioStream(stream);
                remoteAudioRef.current.addEventListener('loadedmetadata', () => {
                  remoteAudioRef.current!.play();
                });
              }
            });
          });
        }

        localPeer!.on('disconnected', (val) => {
          // console.log('Who is disconnecting....', val);
        });

        localPeer?.on('connection', (conn) => {
          conn.on('data', (data) => {
            console.log('data received: ', data);
          });
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

  useEffect(() => {
    socket.on('RemotePeerVideoCallEnd', (data) => {
      const { callEndedBy, roomId, peer } = data;
      localAudioRef.current && (localAudioRef.current.srcObject = null);
      audioStream && audioStream.getTracks().forEach((track) => track.stop());
      setCaller({} as User);
      localPeer!.destroy(); // distory localPeer.
      setLocalPeer(null);
      setShowVideoCallDisplayer(false);
    });

    socket.on('VideoCallRejected', (data) => {
      const { callRejectedBy, roomId, peer } = data;
      localAudioRef.current && (localAudioRef.current.srcObject = null);
      audioStream &&
        audioStream.getTracks().forEach((track) => {
          track.stop();
        });
      localPeer!.destroy(); // distory localPeer.
      setLocalPeer(null);
      setShowVideoCallDisplayer(false);
    });

    // video call accepted
    socket.on('VideoCallAccepted', (data) => {
      const { caller, friend, roomId } = data;
      setIsStillNotAnswered(false);
      // setCaller(caller);
    });
  }, [audioStream]);

  // handlers
  const onMic = () => {
    setMicMuted(!micMuted);
    // if (localAudioRef.current) {
    //   localAudioRef.current.srcObject!.getAudioTracks()[0].enabled = !micMuted;
    // }
  };

  const onWideOrSmall = () => {
    setIsWide(!isWide);
  };

  const onLeaveVideoCall = () => {
    // close remote peer's user media as well.

    localAudioRef.current && (localAudioRef.current.srcObject = null);
    remoteAudioRef.current && (remoteAudioRef.current.srcObject = null);

    // remove streams;
    audioStream && audioStream.getTracks().forEach((track) => track.stop());
    //  remoteaudioStream && remoteaudioStream.getTracks().forEach((track) => track.stop());

    setCaller({} as User);
    localPeer!.destroy();
    setLocalPeer(null);
    setShowVideoCallDisplayer(false);

    // console.log('\n After Destroying: LocalPeer: \n ', localPeer);

    socket.emit('RemotePeerVideoCallEnd', {
      roomId: currentOpenChatId,
      callEndedBy: user,
      peer: friend,
    });
  };

  return (
    <Draggable axis={isWide ? 'x' : 'both'}>
      <div className={` ${isWide ? 'w-full md:2/3 lg:w-1/2 h-full' : 'w-1/3 md:w-1/4 lg:1/5 h-1/3'}  p-sm z-40 text-sm font-mono text-white fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-0 rounded-md`}>
        {/* remote video feed */}
        {user.userId !== caller.userId ? <video ref={remoteAudioRef} src='' className='bg-black min-w-full min-h-full w-full h-full object-cover  rounded-xl' /> : !isStillNotAnswered && <video ref={remoteAudioRef} src='' className='bg-black min-w-full min-h-full w-full h-full object-cover  rounded-xl' />}
        {isStillNotAnswered && user.userId === caller.userId && (
          <div className={`flex gap-md flex-col items-center justify-center h-full bg-black`}>
            <span className='text-md text-gray-300'>{friend.name}</span>
            <span className='text-lg animate-pulse'> {remotePeerOnlineStatus.isOnline ? 'Ringing' : 'Calling...'}</span>
          </div>
        )}
        {/* local video feed  */}
        <Draggable bounds='parent'>
          <video ref={localAudioRef} src='' className={` absolute top-5 right-5 h-[150px] w-[150px] shadow-default  rounded-xl object-cover ${!isWide && 'hidden'}`} />
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
            <div className='flex items-center gap-xs'>{user.userId !== caller.userId ? <AudioTimer /> : !isStillNotAnswered ? <AudioTimer /> : <span>00:00:00</span>}</div>
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
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  const formattedHours = hours > 0 ? String(hours).padStart(2, '0') + ':' : '';
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

export function AudioTimer() {
  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTime);
    }, 1000);

    return () => {
      clearInterval(interval);
      // console.log('unmounted');
    };
  }, [startTime]);

  const formattedTime = formatTime(currentTime);

  return (
    <>
      <span>{formattedTime}</span> &bull;
    </>
  );
}
