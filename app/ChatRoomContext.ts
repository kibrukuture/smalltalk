import { createContext } from 'react';
import { User } from './ChatContext';

export type RemotePeerVideoCallingStatus = {
  isCalling: boolean;
  peer: User;
  roomId: string;
};
const ChatRoomContext = createContext({
  // start;

  // remote video calling status
  remotePeerVideoCalling: {} as RemotePeerVideoCallingStatus,
  setRemotePeerVideoCalling: (value: RemotePeerVideoCallingStatus) => {},

  //   show or hide video displayer
  showVideoCallDisplayer: false,
  setShowVideoCallDisplayer: (value: boolean) => {},

  //   local user video stream
  localUserVideoStream: {} as MediaStream | undefined,
  setLocalUserVideoStream: (value: MediaStream | undefined) => {},

  // caller
  caller: {} as User,
  setCaller: (value: User) => {},

  //   has the local user answered the call
  isCallAnswered: false,
  setIsCallAnswered: (value: boolean) => {},

  // end;
});
export default ChatRoomContext;
/*
 isCallAnswered,setIsCallAnswered

*/
