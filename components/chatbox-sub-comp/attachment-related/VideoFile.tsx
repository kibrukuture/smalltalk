import { useEffect, useRef } from 'react';
import { RiPlayFill } from 'react-icons/ri';
import { Attachment } from '@/app/ChatContext';
import { formatFileSize, formatTime } from '@/app/util.fns';

export default function VideoFile({ attachment }: { attachment: Attachment }) {
  const vidRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <>
      <div className='w-full  flex-col  rounded-md flex gap-xs items-center'>
        <video className='rounded-md' src={attachment.url} width={'100%'} height={'100%'} controls={true}></video>
      </div>
    </>
  );
}
