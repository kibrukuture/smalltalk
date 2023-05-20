import { useEffect, useRef } from 'react';
import { RiPlayFill, RiDownloadLine } from 'react-icons/ri';
import { BinFile, Attachment } from '@/app/ChatContext';
import { formatFileSize, formatTime, abbreviateName, getFileTypeColors } from '@/app/util.fns';

export default function DocumentFile({ attachment }: { attachment: Attachment }) {
  return (
    <a href={attachment.url} download={attachment.name}>
      <div className='flex   justify-between p-2 gap-sm  w-full'>
        <div className='flex gap-xs  '>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'>
            <path d='M10 5 L40 5 L45 10 L45 40 L5 40 L5 10 Z' fill={`${getFileTypeColors(abbreviateName(attachment.ext))[0]}`} />
            <path d='M45 10 L40 5 L40 10 Z' fill={`${getFileTypeColors(abbreviateName(attachment.ext))[1]}`} />
            <text x='25' y='28' textAnchor='middle' fontSize='10' fill='white' fontFamily='Arial, sans-serif'>
              {abbreviateName(attachment.ext.toUpperCase()).toUpperCase()}
            </text>
          </svg>
          <div className='flex flex-col  '>
            <div className='break-all font-mono text-xs '>{attachment.name}</div>
            <div className='flex items-center gap-xs text-xs text-skin-muted'>
              <span>{formatFileSize(attachment.size!)} &bull; </span>
            </div>
          </div>
        </div>
        <div className=' '>
          <RiDownloadLine size={15} />
        </div>
      </div>
    </a>
  );
}
