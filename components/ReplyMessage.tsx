import { useContext } from 'react';
import { RiReplyFill, RiCloseLine } from 'react-icons/ri';
import { Message, User, Attachment } from '@/app/ChatContext';
import { ChatContext } from '@/app/ChatContext';
import { formatFileSize, formatTime, getFileTypeColors } from '@/app/util.fns';

export default function ReplyMessage({
  message,
  setReplyMessage,
}: {
  message: Message;
  setReplyMessage: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: Message;
    }>
  >;
}) {
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
    <div className='flex items-center gap-2 relative'>
      <div>
        <RiReplyFill />
      </div>
      {/* vertial link  */}
      <div className='w-1 h-full min-h-full rounded-full bg-gray-400' />

      <div className='flex items-center gap-2'>
        {attachment && <ReplyAttachmentPicture attachment={attachment} />}
        <div className=''>
          <p className='text-sm font-semibold text-skin-muted'>{messageBelongsTo.name}</p>
          <div>
            {attachment ? (
              <div className='flex items-center gap-2 text-xs text-skin-muted'>
                <span>{attachment.name}</span>
                &bull;<span>{attachment.size && formatFileSize(attachment.size)}</span>
                <>
                  {!!attachment.dur && (
                    <>
                      &bull;<span>{formatTime(attachment.dur)}</span>
                    </>
                  )}
                </>
              </div>
            ) : (
              <p>{text.length > 250 ? text.substring(0, 250) + '...' : text}</p>
            )}
          </div>
        </div>
      </div>
      <button onClick={() => setReplyMessage({ show: false, message: {} as Message })} className='text-skin-muted p-md flex items-center justify-center absolute top-0 right-5 bg-black rounded-full w-5 h-5'>
        <RiCloseLine />
      </button>
    </div>
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
