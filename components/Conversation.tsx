'use client';
import { useState, useRef, useCallback } from 'react';
import { RiLinksFill, RiCheckDoubleLine, RiDeleteBinLine, RiCheckLine, RiReplyLine, RiFileCopy2Line, RiShareForward2Line } from 'react-icons/ri';
import { formatAmPm } from '@/app/util.fns';
import { Message, User } from '@/app/ChatContext';
import { distanceToNow } from '@/app/util.fns';
import Link from 'next/link';
export default function Conversation({ message, friend }: { message: Message; friend: User }) {
  const user = JSON.parse(localStorage.getItem('user') as string) as User;

  const isFromMe = message.senderId === user.userId;

  const messageBelongsTo = isFromMe ? user : friend;

  //state
  const [showMenu, setShowMenu] = useState(false),
    [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }),
    menuRef = useRef(null);

  //handlers
  const onContextMenu = (event: any) => {
    event.preventDefault();
    setShowMenu(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const onMenuClose = () => {
    setShowMenu(false);
  };

  // useEffect(() => {
  //   if (showMenu) {
  //     const menuWidth = menuRef.current.offsetWidth;
  //     const menuHeight = menuRef.current.offsetHeight;
  //     const screenWidth = window.innerWidth;
  //     const screenHeight = window.innerHeight;

  //     let x = menuPosition.x;
  //     let y = menuPosition.y;

  //     if (x + menuWidth > screenWidth) {
  //       x -= menuWidth;
  //     }

  //     if (y + menuHeight > screenHeight) {
  //       y -= menuHeight;
  //     }

  //     setMenuPosition({ x, y });
  //   }
  // }, [showMenu]);

  const longPressProps = useLongPress({
    onClick: (ev) => {
      /*console.log('on click', ev.button, ev.shiftKey)*/
      setShowMenu(false);
    },
    onLongPress: (ev) => {
      setShowMenu(true);
    },
  });

  const link = {
    siteName: 'YouTube',
    url: 'https://www.youtube.com/watch?v=zqeqdepYkcw',
    title: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',
    description: `Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...`,
    type: 'video',
    date: '2021-03-03T16:00:00.000Z',
    image: {
      url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
      width: '1280',
      height: '720',
      type: 'jpg',
    },
  };

  return (
    <div
      className={` ${!isFromMe ? 'self-end' : 'self-start'} flex relative   flex-col bg-transparent gap-xs  items-center
  max-w-[70%]  sm:max-w-[60%  md:max-w-[50%]  lg:max-w-[40%]  xl:max-w-[30%] `}
    >
      <div onContextMenu={onContextMenu} onClick={() => {}} className={` ${!isFromMe ? 'rounded-t-xl rounded-bl-xl ' : 'rounded-t-xl rounded-br-xl '}   rounded bg-skin-muted shadow-default relative  p-lg grow w-full  ${!isFromMe ? 'bg-skin-sender' : 'bg-skin-receiver'} break-words`}>
        {message.link && (
          <div className='text-skin-muted flex gap-sm items-center text-xs font-mono    '>
            <RiLinksFill className='inline-block' />
            <a className='break-all block' href={link.url} target='_blank'>
              {message.link.url!.length > 30 ? message.link.url!.slice(0, 30) + '...' : message.link.url!}
            </a>
          </div>
        )}
        {linkify(message.text)}

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
        <p className=' flex  justify-end gap-xs text-skin-muted font-mono text-xs    items-center'>
          <RiCheckDoubleLine className='inline-block' />
          Delivered
        </p>
      </div>

      <div className={`font-mono flex ${!isFromMe && 'flex-row-reverse justify-start'} gap-xs text-xs  items-center pl-lg w-full  `}>
        <button className='overflow-hidden text-skin-muted w-6 h-6 outline outline-offset-2 outline-1 flex items-center justify-center   rounded-full '>
          <img className='object-cover h-10 w-10 ' src='/dog.jpg' alt='' />
        </button>
        <p>{messageBelongsTo.name}</p>
        <p className='text-skin-muted'>{formatAmPm(message.createdAt)}</p>
      </div>
      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
          }}
        >
          <ContextMenu />
        </div>
      )}
    </div>
  );
}

const emojis = ['😀', '😂', '😍', '🤔', '🤯', '👍', '👎', '👀', '🙌', '👏', '🔥', '💩', '🌈', '🍕', '🍔', '🍟', '🍩', '🍦', '🍭', '🍫'];
export const ContextMenu = () => {
  return (
    <div className='h-36   flex   gap-sm max-w-fit items-start font-mono text-skin-muted text-sm    '>
      <div className='choose-emoji-scroll-bar bg-skin-muted p-sm h-36  overflow-y-auto flex flex-col   items-center gap-xs rounded-xl   '>
        {emojis.map((emoji) => (
          <button key={emoji} className=''>
            {emoji}
          </button>
        ))}
      </div>
      <div className='h-full  flex flex-col   bg-skin-muted   rounded'>
        <button className='flex items-center hover:bg-skin-hover grow px-md gap-md'>
          <RiReplyLine />
          <span>Reply</span>
        </button>
        <button className='flex items-center hover:bg-skin-hover grow px-md gap-md'>
          <RiFileCopy2Line />
          <span>Copy</span>
        </button>
        <button className='flex items-center hover:bg-skin-hover grow px-md gap-md'>
          <RiShareForward2Line />
          <span>Forward</span>
        </button>
        <button className='flex items-center hover:bg-skin-hover grow px-md gap-md'>
          <RiDeleteBinLine />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

function preventDefault(e: Event) {
  if (!isTouchEvent(e)) return;

  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault();
  }
}

export function isTouchEvent(e: Event): e is TouchEvent {
  return e && 'touches' in e;
}

interface PressHandlers<T> {
  onLongPress: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
}

interface Options {
  delay?: number;
  shouldPreventDefault?: boolean;
}

function useLongPress<T>({ onLongPress, onClick }: PressHandlers<T>, { delay = 200, shouldPreventDefault = true }: Options = {}) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>) => {
      e.persist();
      const clonedEvent = { ...e };

      if (shouldPreventDefault && e.target) {
        e.target.addEventListener('touchend', preventDefault, { passive: false });
        target.current = e.target;
      }

      timeout.current = setTimeout(() => {
        onLongPress(clonedEvent);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault],
  );

  const clear = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !longPressTriggered && onClick?.(e);

      setLongPressTriggered(false);

      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered],
  );

  return {
    onMouseDown: (e: React.MouseEvent<T>) => start(e),
    onTouchStart: (e: React.TouchEvent<T>) => start(e),
    onMouseUp: (e: React.MouseEvent<T>) => clear(e),
    onMouseLeave: (e: React.MouseEvent<T>) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent<T>) => clear(e),
  };
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
