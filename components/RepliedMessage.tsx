import { useContext } from 'react';
import { Message, User, Attachment } from '@/app/ChatContext';
import { ChatContext } from '@/app/ChatContext';

export default function RepliedMessage({ message, setRepliedMessageClicked }: { message: Message; setRepliedMessageClicked: React.Dispatch<React.SetStateAction<{ messageId: string; isClicked: boolean }>> }) {
  const user = JSON.parse(localStorage.getItem('user') as string) as User;

  // consume the context
  const { currentOpenChatId, rooms } = useContext(ChatContext);
  const friend = rooms.get(currentOpenChatId)?.friend;

  const messageBelongsTo = (message.senderId === user.userId ? user : friend) as User;

  let text = '',
    attachment;
  if (message.text) {
    text = message.text;
  }
  if (message.attachment) {
    attachment = message.attachment;
  }

  return (
    <a
      href={`#${message.messageId}`}
      className='cursor-pointer'
      onClick={() => {
        setRepliedMessageClicked({ messageId: message.messageId, isClicked: true });

        // after 5 seconds, set the isClicked to false
        setTimeout(() => {
          setRepliedMessageClicked({ messageId: '', isClicked: false });
        }, 3000);
      }}
    >
      <div className='flex items-center gap-2 relative ml-sm p-md pl-xl border-0 border-l-2 border-black'>
        <div className='flex items-center gap-2'>
          {attachment && <ReplyAttachmentPicture attachment={attachment} />}
          <div className='font-mono'>
            <p className='text-sm font-semibold text-skin-muted'>{messageBelongsTo.name}</p>
            <p className='text-sm text-skin-base'>{text.length > 250 ? text.substring(0, 250) + '...' : text}</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function ReplyAttachmentPicture({ attachment }: { attachment: Attachment }) {
  return (
    <>
      {attachment.type === 'image' && (
        <div className='max-w-[80px]'>
          <img src={attachment?.url} alt='' className='w-full  rounded object-cover' />
        </div>
      )}
      {(attachment.type === 'video' || attachment.type === 'audio' || attachment.type === 'document') && <div className={`max-w-[100px] p-md  flex items-center justify-center  text-white rounded text-xs font-mono bg-black`}>{attachment.ext}</div>}
    </>
  );
}
