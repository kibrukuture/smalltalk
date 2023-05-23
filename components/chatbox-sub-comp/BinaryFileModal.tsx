import { useState, useContext, useEffect, useRef } from 'react';
import { User, BinFile, Message, Room, Attachment } from '@/app/ChatContext';
import { RiCloseFill, RiSendPlaneFill, RiPlayFill, RiPauseFill } from 'react-icons/ri';
import socket from '@/app/socket.config';
import { ChatContext } from '@/app/ChatContext';
import { v4 as uuidv4 } from 'uuid';
import { addNewMessage, getFileTypeColors, formatTime, abbreviateName, formatFileSize } from '@/app/util.fns';
export default function BinaryFileModal({ binFile, setShowBinaryFileModal }: { binFile: BinFile; setShowBinaryFileModal: (show: boolean) => void }) {
  const user = JSON.parse(localStorage.getItem('user') as string) as User;

  // state
  const [caption, setCaption] = useState('');

  // video ref
  const vidRef = useRef<HTMLVideoElement>(null);

  // consume context.
  const { currentOpenChatId, rooms, setRooms } = useContext(ChatContext);

  const friend = rooms.get(currentOpenChatId)?.friend as User;

  /*
 const message: Message = {
      messageId: uuidv4(),
      roomId: currentOpenChatId,
      senderId: user.userId!,
      text: chatMessage,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      message: [],
      replyId: null,
      emoji: '',
      link: null,
      attachment: null,
    };

  */

  const onSendBinaryFile = () => {
    const messageId = uuidv4();

    const message: Message = {
      messageId,
      roomId: currentOpenChatId,
      senderId: user.userId!,
      text: caption,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      message: [],
      replyId: null,
      emoji: '',
      link: null,
      attachment: {
        messageId,
        type: binFile.type,
        size: binFile.size,
        url: binFile.data,
        width: null,
        height: null,
        dur: binFile.dur,
        name: binFile.name,
        ext: binFile.ext,
      },
    };

    // add new message to context
    addNewMessage(currentOpenChatId, message, setRooms);

    // send file to server
    socket.emit('ExchangeChatMessage', {
      message,
      sender: user,
      friend,
      roomId: currentOpenChatId,
    });

    // close modal
    setShowBinaryFileModal(false);
  };

  const onCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  console.log('binary file', binFile);
  return (
    <div className='flex items-center justify-center  fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 font-mono'>
      <div className='p-md    bg-skin-muted rounded-md flex flex-col gap-sm w-[80%] md:w-[50%] lg:w-[30%]'>
        {/* header */}
        <div className='flex gap-md items-center'>
          <button onClick={() => setShowBinaryFileModal(false)} className='p-md '>
            <RiCloseFill size={20} />
          </button>
          <div className=''>{binFile.type[0].toUpperCase() + binFile.type.slice(1)}</div>
        </div>
        {/* image type*/}
        {binFile.type === 'image' && (
          <>
            <div className='max-h-9/12 h-9/12 overflow-hidden'>
              <img src={binFile.data} alt='' className=' w-full min-w-full object-cover' />
            </div>
            <div className='flex gap-xs items-center text-xs text-skin-muted mt-1'>
              <span>{binFile.name} </span> &bull;<span>{formatFileSize(binFile.size)}</span>
            </div>
          </>
        )}
        {/* audio type. */}
        {binFile.type === 'audio' && (
          <div className='  '>
            <div className='flex gap-xs items-center'>
              <span className='inline-block p-lg rounded-full bg-teal-400'>
                <RiPlayFill size={20} className='text-white' />
              </span>
              <div className='flex flex-col  '>
                <div>{binFile.name}</div>
                <div className='flex items-center gap-xs text-xs text-skin-muted'>
                  <span>{formatTime(binFile.dur!)} </span> &bull;<span>{formatFileSize(binFile.size)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* vidoe type */}
        {binFile.type === 'video' && (
          <div className='flex flex-col  gap-xs items-center overflow-hidden '>
            <div className=' h-[95%] max-h-[95%] '>
              <video className='w-full h-full object-cover' ref={vidRef} src={binFile.data} />
            </div>
            <div className='flex items-center gap-xs text-xs text-skin-muted'>
              <span>{formatTime(binFile.dur!)}</span> &bull;<span>{formatFileSize(binFile.size)}</span>
            </div>
          </div>
        )}

        {/* file type such as pdf , text,  */}
        {binFile.type === 'document' && (
          <div className=''>
            <div className='flex gap-xs items-center'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'>
                <path d='M10 5 L40 5 L45 10 L45 40 L5 40 L5 10 Z' fill={`${getFileTypeColors(binFile.ext)[0]}`} />
                <path d='M45 10 L40 5 L40 10 Z' fill={`${getFileTypeColors(binFile.ext)[1]}`} />
                <text x='25' y='28' textAnchor='middle' fontSize='10' fill='white' fontFamily='Arial, sans-serif'>
                  {abbreviateName(binFile.ext.toUpperCase()).toUpperCase()}
                </text>
              </svg>
              <div className='flex flex-col  '>
                <div>{binFile.name}</div>
                <div className='flex items-center gap-xs text-xs text-skin-muted'>
                  <span>{formatFileSize(binFile.size)} &bull; </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* caption */}
        <div className='flex gap-sm items-center relative'>
          <textarea value={caption} onChange={onCaption} placeholder='Add a caption' rows={2} className='grow   shadow p-lg rounded text-skin-base border-2 border-gray-300 outline-none bg-skin-muted focus:border-teal-400 focus:outline-none transition duration-500'></textarea>
          <button onClick={onSendBinaryFile} type='submit' className='text-skin-base flex items-center justify-center bg-black  min-h-10 min-w-10 h-10 w-10 rounded-full grow-0'>
            <RiSendPlaneFill />
          </button>
        </div>
      </div>
    </div>
  );
}
