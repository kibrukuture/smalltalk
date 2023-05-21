import { useEffect, useRef } from 'react';
import { RiPlayFill } from 'react-icons/ri';
import { BinFile, Attachment, User } from '@/app/ChatContext';
import { formatFileSize } from '@/app/util.fns';

export default function ImageFile({
  attachment,
  setImageViewer,
  user,
}: {
  attachment: Attachment;
  setImageViewer: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      attachment: Attachment;
      user: User;
    }>
  >;
  user: User;
}) {
  const onImageViewFullScreen = () => {
    setImageViewer({
      show: true,
      attachment,
      user,
    });
  };

  return (
    <button onClick={onImageViewFullScreen} className='block appearance-none'>
      <img src={attachment.url} alt='' />
    </button>
  );
}
