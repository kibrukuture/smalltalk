import { useContext } from 'react';
import { ChatContext } from '@/app/ChatContext';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { RiUser6Line, RiEraserLine, RiCloseLine, RiDeleteBinLine } from 'react-icons/ri';

export default function ChatBoxContextMenu() {
  // use context
  const { currentOpenChatId, setCurrentOpenChatId } = useContext(ChatContext);
  return (
    <ContextMenu id={currentOpenChatId}>
      <div className='h-36   flex   gap-sm max-w-fit items-start font-mono text-skin-base text-sm z-50    '>
        <div className='h-full p-lg  flex flex-col    bg-skin-muted   rounded'>
          <MenuItem data={{ reply: 'reply' }} onClick={console.log} className='grow'>
            <button className='flex h-full   w-full items-center hover:bg-skin-hover grow px-md gap-md'>
              <RiUser6Line />
              <span>Contact Info</span>
            </button>
          </MenuItem>
          <MenuItem data={{ copy: 'copy' }} onClick={console.log} className='grow'>
            <button className='flex h-full  w-full items-center hover:bg-skin-hover grow px-md gap-md'>
              <RiEraserLine />
              <span>Clear Chats</span>
            </button>
          </MenuItem>
          <MenuItem data={{ forward: 'forward' }} onClick={() => setCurrentOpenChatId('')} className='grow'>
            <button className='flex h-full  w-full items-center hover:bg-skin-hover grow px-md gap-md'>
              <RiCloseLine />
              <span>Close Chats</span>
            </button>
          </MenuItem>
          <MenuItem data={{ delete: 'delete' }} onClick={console.log} className='grow'>
            <button className='flex h-full   w-full items-center hover:bg-skin-hover grow px-md gap-md'>
              <RiDeleteBinLine />

              <span>Delete Chats</span>
            </button>
          </MenuItem>
        </div>
      </div>
    </ContextMenu>
  );
}
