import { useEffect, useRef } from 'react';
import { RiPlayFill } from 'react-icons/ri';
import { BinFile, Attachment } from '@/app/ChatContext';
import { formatFileSize } from '@/app/util.fns';

export default function ImageFile({ attachment }: { attachment: Attachment }) {
  return (
    <div>
      <div className=''>
        <div className='  '>
          <img src={attachment.url} alt='' />
        </div>
      </div>
    </div>
  );
}
