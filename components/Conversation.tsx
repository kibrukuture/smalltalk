import { useContext, useEffect, useRef, useState, TouchEvent, MouseEvent } from 'react';
import { RiAddFill, RiLink, RiCheckDoubleLine, RiDeleteBinLine, RiCheckLine, RiReplyLine, RiFileCopy2Line, RiShareForward2Line } from 'react-icons/ri';
import { formatAmPm, getColorFromName, getInitials } from '@/app/util.fns';
import { Message, User, Attachment, EmojiType, Room } from '@/app/ChatContext';
import { distanceToNow } from '@/app/util.fns';
import { ChatContext } from '@/app/ChatContext';
import Link from 'next/link';
import AudioFile from './chatbox-sub-comp/attachment-related/AudioFile';
import ImageFile from './chatbox-sub-comp/attachment-related/ImageFile';
import VideoFile from './chatbox-sub-comp/attachment-related/VideoFile';
import DocumentFile from './chatbox-sub-comp/attachment-related/DocumentFile';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import RepliedMessage from './RepliedMessage';
import socket from '@/app/socket.config';

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
  repliedMessageClicked,
  setImageViewer,
  setReplyMessage,
  setRepliedMessageClicked,
  setForwardMessage,
}: {
  message: Message;
  friend: User;
  repliedMessageClicked: {
    messageId: string;
    isClicked: boolean;
  };
  setImageViewer: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      attachment: Attachment;
      user: User;
    }>
  >;
  setReplyMessage: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: Message;
    }>
  >;
  setRepliedMessageClicked: React.Dispatch<
    React.SetStateAction<{
      messageId: string;
      isClicked: boolean;
    }>
  >;
  setForwardMessage: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: Message;
      to: string[];
    }>
  >;
}) {
  const user = JSON.parse(localStorage.getItem('user') as string) as User;
  // consume context

  const { rooms, currentOpenChatId, setRooms } = useContext(ChatContext);

  const isFromMe = message.senderId === user.userId;

  const messageBelongsTo = isFromMe ? user : friend;

  let emojiBelongsto: User | null = null,
    emojiAvatarcolor = '';
  if (message.emoji) {
    emojiBelongsto = message.emoji.userId === user.userId ? user : friend;
    emojiAvatarcolor = getColorFromName(emojiBelongsto!.name);
  }

  let AttachmentFile;
  if (message.attachment) {
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

  // handles
  const onRemoveEmoji = () => {
    updateMessageWithEmoji(null, message, rooms, currentOpenChatId, setRooms);
    // also remove from the other users
  };

  return (
    <div className={`w-full flex ${repliedMessageClicked.isClicked && repliedMessageClicked.messageId === message.messageId && 'animate-[heartbit_3s_alternate_infinite_.5s]'} p-xs px-lg  md:px-2xl bg-opacity-50 `}>
      <div
        id={message.messageId}
        className={` ${isFromMe ? 'ml-auto' : 'mr-auto'} flex relative   flex-col bg-transparent gap-xs  items-center
  max-w-[85%]  sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]`}
      >
        <ContextMenuTrigger id={message.messageId}>
          <div onClick={() => {}} className={` ${isFromMe ? 'rounded-t-xl rounded-bl-xl ' : 'rounded-t-xl rounded-br-xl '}   rounded bg-skin-muted shadow-default relative    grow w-full  ${isFromMe ? 'bg-skin-sender' : 'bg-skin-receiver'} break-words`}>
            {message.link && (
              <div className='text-skin-muted flex gap-sm items-center text-xs font-mono  p-md '>
                <RiLink className='inline-block' />
                <a className='break-all block' href={message.link.url} target='_blank'>
                  {message.link.url!.length > 60 ? message.link.url!.slice(0, 60) + '...' : message.link.url!}
                </a>
              </div>
            )}
            {message.attachment && AttachmentFile}
            <div className='p-lg break-all'>
              {message.replyId && <RepliedMessage message={message.message!} setRepliedMessageClicked={setRepliedMessageClicked} />}
              {linkify(message.text)}
            </div>
            {/* ${getColorFromName(emojiBelongsto!.name)} */}
            {message.link && (
              <Link href={message.link.url} target='_blank'>
                <div className='ml-sm border-l-2 border-l-gray-800  bg-transparent   p-2 flex flex-col gap-sm font-mono my-4  '>
                  <img src={message.link.imageUrl} alt={message.link.title} className='' />
                  <p className='text-xs'>{message.link.siteName}</p>
                  <p className='text-md'>{message.link.title}</p>
                  <p className='text-sm'>{message.link.description}</p>
                  <p className='text-xs'>
                    {message.link!.type?.split('.')[0]} • {distanceToNow(message.link.date as string)}
                  </p>
                </div>
              </Link>
            )}
            <p className=' flex pr-sm  justify-between  text-skin-muted font-mono text-xs  items-center'>
              {/* if any emoji */}
              {message.emoji && (
                <button onClick={onRemoveEmoji} className='p-md flex items-center gap-xs bg-skin-muted rounded-full ml-1 mb-1'>
                  {message.emoji.emoji}
                  <span
                    style={{
                      backgroundColor: emojiAvatarcolor,
                    }}
                    className={`text-xs font-mono text-white flex items-center justify-center h-5 w-5 rounded-full `}
                  >
                    {getInitials(emojiBelongsto!.name)}
                  </span>
                </button>
              )}
              <span className='flex grow items-center gap-xs justify-end'>
                <RiCheckDoubleLine className='inline-block' />
                Delivered
              </span>
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
            <ContextMenuList message={message} setReplyMessage={setReplyMessage} setForwardMessage={setForwardMessage} />
          </ContextMenu>
        </div>
      </div>
    </div>
  );
}

const emojis = ['😀', '😂', '😍', '🤔', '🤯', '👍', '👎', '👀', '🙌', '👏', '🔥', '💩', '🌈', '🍕', '🍔', '🍟', '🍩', '🍦', '🍭', '🍫'];
export const ContextMenuList = ({
  message,
  setReplyMessage,
  setForwardMessage,
}: {
  message: Message;
  setReplyMessage: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: Message;
    }>
  >;
  setForwardMessage: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: Message;
      to: string[];
    }>
  >;
}) => {
  const user = JSON.parse(localStorage.getItem('user') as string) as User;

  // consume context
  const { rooms, currentOpenChatId, setRooms } = useContext(ChatContext);

  const onReactWithEmoji = (e: MouseEvent<HTMLButtonElement>, data: any) => {
    const tempEmoji: EmojiType = {
      messageId: message.messageId,
      emoji: data.emoji,
      userId: user.userId as string,
    };
    updateMessageWithEmoji(tempEmoji, message, rooms, currentOpenChatId, setRooms);
  };

  const onDeleteConversation = (e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement, MouseEvent>, data: any) => {
    // delete a conversation

    console.log(message.messageId, currentOpenChatId);
    // ;end

    // fire emit event to server; (if the other peer has not seen the message, it is deletable)

    socket.emit('DeleteConversation', {
      messageId: message.messageId,
      roomId: currentOpenChatId,
      deletedBy: user,
      friend: rooms.get(currentOpenChatId)?.friend,
    });
  };

  return (
    <div className='h-36   flex   gap-sm max-w-fit items-start font-mono text-skin-base text-sm z-50    '>
      <div className='choose-emoji-scroll-bar bg-skin-muted p-sm h-36  overflow-y-auto flex flex-col   items-center gap-xs rounded-xl   '>
        {emojis.map((emoji) => (
          <MenuItem data={{ emoji }} onClick={onReactWithEmoji} key={emoji}>
            <button key={emoji} className=''>
              {emoji}
            </button>
          </MenuItem>
        ))}
        <MenuItem data={{ add: 'add' }} onClick={console.log} key='add more'>
          <button key={'add more emoji'} title='add more emojis'>
            <RiAddFill />
          </button>
        </MenuItem>
      </div>
      <div className='h-full p-lg  flex flex-col    bg-skin-muted   rounded'>
        <MenuItem
          data={{ reply: 'reply' }}
          onClick={() =>
            setReplyMessage({
              show: true,
              message: message,
            })
          }
          className='grow'
          key='reply'
        >
          <button className='flex h-full   w-full items-center hover:bg-skin-hover grow px-md gap-md'>
            <RiReplyLine />
            <span>Reply</span>
          </button>
        </MenuItem>

        <MenuItem data={{ copy: 'copy' }} onClick={() => updateClipboard(message.text + (message.attachment ? message.attachment?.name : ''))} className='grow' key='copy'>
          <button className='flex h-full  w-full items-center hover:bg-skin-hover grow px-md gap-md'>
            <RiFileCopy2Line />
            <span>Copy</span>
          </button>
        </MenuItem>

        <MenuItem data={{ forward: 'forward' }} onClick={() => setForwardMessage({ show: true, message: message, to: [] })} className='grow' key='forward'>
          <button className='flex h-full  w-full items-center hover:bg-skin-hover grow px-md gap-md'>
            <RiShareForward2Line />
            <span>Forward</span>
          </button>
        </MenuItem>
        {message.senderId === user.userId && (
          <MenuItem data={{ delete: 'delete' }} onClick={onDeleteConversation} className='grow' key='delete'>
            <button className='flex h-full   w-full items-center hover:bg-skin-hover grow px-md gap-md'>
              <RiDeleteBinLine />
              <span>Delete</span>
            </button>
          </MenuItem>
        )}
      </div>
    </div>
  );
};

function updateMessageWithEmoji(emoji: EmojiType | null, message: Message, rooms: Map<string, Room>, currentOpenChatId: string, setRooms: (rooms: Map<string, Room>) => void) {
  const tempMessage: Message = { ...message, emoji };

  const currentRoom = rooms.get(currentOpenChatId);
  if (!currentRoom) return;

  const tempMessages = currentRoom.messages.map((msg) => (msg.messageId === tempMessage.messageId ? tempMessage : msg));

  const tempRoom = { ...currentRoom, messages: tempMessages };
  setRooms((prev) => {
    const temp = new Map(prev);
    temp.set(currentOpenChatId, tempRoom);
    return temp;
  });
}

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
        <a href={`${/https?:\/\/?/.test(word) ? '' : 'https://'}${word}`} target='_blank' rel='noopener noreferrer' className='underline underline-offset-2 pr-1 italic'>
          {word}
        </a>
      );
    }
    return <span className='pr-1'>{word}</span>;
  });

  // const links = linkifyMessage.find(text);

  // if (!links.length) return text;

  // links.forEach((link) => {
  //   const tempLink = `<a href=${link.href} target='_blank' rel='noopener noreferrer' className='underline underline-offset-2 pr-1 italic'>
  //   ${link.value}
  //     </a>`;
  //   text.replace(link.value, tempLink);
  // });

  // return text;
}

// hello world https://www.google.com hello world this is the future https://www.google.com.eg hello world
