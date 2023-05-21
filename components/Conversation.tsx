'use client';
import { useState, useRef, useCallback } from 'react';
import { RiLinksFill, RiCheckDoubleLine, RiDeleteBinLine, RiCheckLine, RiReplyLine, RiFileCopy2Line, RiShareForward2Line } from 'react-icons/ri';
import { formatAmPm } from '@/app/util.fns';
import { Message, User, Attachment, BinFile } from '@/app/ChatContext';
import { distanceToNow } from '@/app/util.fns';
import { getColorFromName, getInitials } from '@/app/util.fns';
import Link from 'next/link';
import AudioFile from './chatbox-sub-comp/attachment-related/AudioFile';
import ImageFile from './chatbox-sub-comp/attachment-related/ImageFile';
import VideoFile from './chatbox-sub-comp/attachment-related/VideoFile';
import DocumentFile from './chatbox-sub-comp/attachment-related/DocumentFile';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
// import ImageViewer from './ImageViewer';

/**
 React.Dispatch<React.SetStateAction<{
    show: boolean;
    attachment: Attachment;
    user: User;
}>>
 */
export default function Conversation({
  message,
  friend,
  setImageViewer,
}: {
  message: Message;
  friend: User;
  setImageViewer: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      attachment: Attachment;
      user: User;
    }>
  >;
}) {
  const user = JSON.parse(localStorage.getItem('user') as string) as User;

  const isFromMe = message.senderId === user.userId;

  const messageBelongsTo = isFromMe ? user : friend;

  let AttachmentFile;
  if (message.attachment) {
    console.log('*************************', message.attachment?.type?.toLocaleUpperCase());
    switch (message.attachment.type) {
      case 'audio':
        AttachmentFile = <AudioFile attachment={message.attachment} />;
        break;
      case 'image':
        AttachmentFile = <ImageFile user={messageBelongsTo} attachment={message.attachment} setImageViewer={setImageViewer} />;
        break;
      case 'video':
        AttachmentFile = <VideoFile attachment={message.attachment} />;
        break;
      case 'document':
        AttachmentFile = <DocumentFile attachment={message.attachment} />;
        break;
    }
  }

  console.log('inside conversation: ', message.text);
  return (
    <div
      className={` ${isFromMe ? 'self-end' : 'self-start'} flex relative   flex-col bg-transparent gap-xs  items-center
  max-w-[70%]  sm:max-w-[60%  md:max-w-[50%]  lg:max-w-[40%]  xl:max-w-[30%] `}
    >
      <ContextMenuTrigger id={message.messageId}>
        <div onClick={() => {}} className={` ${isFromMe ? 'rounded-t-xl rounded-bl-xl ' : 'rounded-t-xl rounded-br-xl '}   rounded bg-skin-muted shadow-default relative    grow w-full  ${isFromMe ? 'bg-skin-sender' : 'bg-skin-receiver'} break-words`}>
          {message.link && (
            <div className='text-skin-muted flex gap-sm items-center text-xs font-mono    '>
              <RiLinksFill className='inline-block' />
              <a className='break-all block' href={message.link.url} target='_blank'>
                {message.link.url!.length > 30 ? message.link.url!.slice(0, 30) + '...' : message.link.url!}
              </a>
            </div>
          )}
          {message.attachment && AttachmentFile}
          <div className='p-lg'>{linkify(message.text)}</div>

          {/* {false && (
          <div className='ml-sm border-l-2 border-l-gray-800 rounded   bg-transparent   p-2 flex flex-col gap-sm font-mono my-4  '>
            <Link href={message.link!.url} target='_blank'>
              <img src={message.link!.imageUrl} alt={message.link!.title} className='block w-full rounded-md' />
            </Link>
            <p className='text-xs'>{message.link!.siteName}</p>
            <p className='text-md'>{message.link!.title}</p>
            <p className='text-sm'>{message.link!.description}</p>
            <p className='text-xs'>
              {message.link!.type} • {distanceToNow(message.createdAt)}
            </p>
          </div>
        )} */}
          <p className=' flex pr-sm  justify-end gap-xs text-skin-muted font-mono text-xs    items-center'>
            <RiCheckDoubleLine className='inline-block' />
            Delivered
          </p>
        </div>
      </ContextMenuTrigger>
      <div className={`font-mono flex ${isFromMe && 'flex-row-reverse justify-start'} gap-xs text-xs  items-center pl-lg w-full  `}>
        <button className={`relative overflow-hidden text-skin-muted min-w-6 min-h-6 w-6 h-6  flex items-center justify-center   rounded-full flex-wrap  `} style={{ backgroundColor: getColorFromName(messageBelongsTo.name), color: 'whitesmoke' }}>
          {messageBelongsTo.avatarUrl && <img className='object-cover h-8 w-8 ' src={messageBelongsTo.avatarUrl} alt='' />}
          {!messageBelongsTo.avatarUrl && <span className='text-xs w-full h-full flex items-center justify-center text-white'>{getInitials(messageBelongsTo.name)}</span>}
        </button>
        <p>{messageBelongsTo.name}</p>
        <p className='text-skin-muted'>{formatAmPm(message.createdAt)}</p>
      </div>

      <div className='z-50'>
        <ContextMenu id={message.messageId}>
          <ContextMenuList message={message} />
        </ContextMenu>
      </div>
    </div>
  );
}

const emojis = ['😀', '😂', '😍', '🤔', '🤯', '👍', '👎', '👀', '🙌', '👏', '🔥', '💩', '🌈', '🍕', '🍔', '🍟', '🍩', '🍦', '🍭', '🍫'];
export const ContextMenuList = ({ message }: { message: Message }) => {
  const [copyText, setCopyText] = useState('');
  return (
    <div className='h-36   flex   gap-sm max-w-fit items-start font-mono text-skin-base text-sm z-50    '>
      <div className='choose-emoji-scroll-bar bg-skin-muted p-sm h-36  overflow-y-auto flex flex-col   items-center gap-xs rounded-xl   '>
        {emojis.map((emoji) => (
          <MenuItem data={{ emoji }} onClick={console.log}>
            <button key={emoji} className=''>
              {emoji}
            </button>
          </MenuItem>
        ))}
      </div>
      <div className='h-full p-lg  flex flex-col    bg-skin-muted   rounded'>
        <MenuItem data={{ reply: 'reply' }} onClick={console.log} className='grow'>
          <button className='flex h-full   w-full items-center hover:bg-skin-hover grow px-md gap-md'>
            <RiReplyLine />
            <span>Reply</span>
          </button>
        </MenuItem>

        <MenuItem data={{ copy: 'copy' }} onClick={() => updateClipboard(message.text + (message.attachment ? message.attachment?.name : ''))} className='grow'>
          <button className='flex h-full  w-full items-center hover:bg-skin-hover grow px-md gap-md'>
            <RiFileCopy2Line />
            <span>Copy</span>
          </button>
        </MenuItem>

        <MenuItem data={{ forward: 'forward' }} onClick={console.log} className='grow'>
          <button className='flex h-full  w-full items-center hover:bg-skin-hover grow px-md gap-md'>
            <RiShareForward2Line />
            <span>Forward</span>
          </button>
        </MenuItem>
        <MenuItem data={{ delete: 'delete' }} onClick={console.log} className='grow'>
          <button className='flex h-full   w-full items-center hover:bg-skin-hover grow px-md gap-md'>
            <RiDeleteBinLine />
            <span>Delete</span>
          </button>
        </MenuItem>
      </div>
    </div>
  );
};

function updateClipboard(newClip: string) {
  navigator.clipboard.writeText(newClip).then(
    () => {}, //success
    () => {}, //todo:handle error
  );
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/;
  if (!urlRegex.test(text)) return text;

  return text.split(' ').map((word) => {
    if (urlRegex.test(word)) {
      return (
        <a href={`${/https?:\/\/?/.test(word) ? '' : 'https://'}${word}`} target='_blank' rel='noopener noreferrer' className='underline text-blue-500 underline-offset-2 pr-1'>
          {word}
        </a>
      );
    }
    return <span className='pr-1'>{word}</span>;
  });
}

// hello world https://www.google.com hello world this is the future https://www.google.com.eg hello world
