import React, { useRef, useState } from 'react';
import { User } from '@/app/ChatContext';
import { RiDownloadLine, RiZoomInLine, RiZoomOutLine, RiCloseFill } from 'react-icons/ri';
import { Attachment } from '@/app/ChatContext';
import { formatFileSize } from '@/app/util.fns';
import { format } from 'path';

export default function ImageViewer({
  imageViewer,
  setImageViewer,
}: {
  imageViewer: {
    show: boolean;
    attachment: Attachment;
    user: User;
  };
  setImageViewer: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      attachment: Attachment;
    }>
  >;
  user: User;
}) {
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const onZoom = (type: string) => {
    if (type === 'ZoomIn') {
      if (currentZoomLevel < 5) {
        setCurrentZoomLevel((prev) => prev + 0.1);
      }
    } else {
      if (currentZoomLevel > 0.1) {
        setCurrentZoomLevel((prev) => prev - 0.1);
      }
    }
    const image = imageRef.current as HTMLImageElement;
    image.style.transform = `scale(${currentZoomLevel})`;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target.id === 'image-viewer-container') {
          setImageViewer((prev) => ({ ...prev, show: false }));
        }
      }}
      className='z-50 font-mono fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm
       '
    >
      {/* header */}
      <div className='absolute top-0 left-0 w-full h-[50px] bg-skin-base z-10 flex items-center justify-between p-lg gap-sm '>
        <div className=' flex items-center text-skin-base font-mono gap-2'>
          <div className='relative'>
            <div className='relative overflow-hidden text-skin-muted w-8 h-8 shadow-default flex items-center justify-center   rounded-full '>
              <img className='object-cover h-12 w-12 ' src={imageViewer.user.avatarUrl} alt='' />
            </div>
          </div>
          <div className='flex flex-col '>
            <p>{imageViewer.user.name} </p>
          </div>
        </div>
        {/* controls */}
        <div className='flex items-center gap-sm md:gap-md bg-black p-lg rounded-full '>
          <a href={imageViewer.attachment.url} download>
            <RiDownloadLine size={20} />
          </a>
          <button onClick={() => onZoom('ZoomIn')}>
            <RiZoomInLine size={20} />
          </button>
          <button onClick={() => onZoom('ZoomOut')}>
            <RiZoomOutLine size={20} />
          </button>

          <button
            onClick={() => setImageViewer((prev) => ({ ...prev, show: false }))}
            title='close'
            className='hover:text-red-500
          '
          >
            <RiCloseFill size={20} />
          </button>
        </div>
      </div>
      {/* image */}
      <div id='image-viewer-container' className='flex justify-center items-center mt-lg w-full h-full'>
        <img ref={imageRef} src={imageViewer.attachment.url} alt='' className='w-9/12 max-h-full object-cover block' />
      </div>

      {/* footer */}
      <div className='text-xs absolute bottom-1 right-5 w-fit   bg-black  z-10 flex items-center justify-between p-lg gap-sm rounded-full '>
        <span>
          {imageViewer.attachment.name} &bull; {formatFileSize(imageViewer.attachment.size!)}
        </span>
      </div>
    </div>
  );
}
