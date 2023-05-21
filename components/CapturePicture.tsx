import { useEffect, useRef, useState } from 'react';
import { RiCamera3Line, RiArrowRightUpLine } from 'react-icons/ri';

export default function CapturePicture({ onGetCapturePicture, setShowCapturePicture }: { onGetCapturePicture: (data: string, size: number) => void; setShowCapturePicture: (show: boolean) => void }) {
  const [pictureStream, setPictureStream] = useState<MediaStream | null>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (captureVideoRef.current !== null) {
        const video = captureVideoRef.current;
        const constraints = {
          video: true,
        };
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          video.srcObject = stream;
          video.play();
          setPictureStream(stream);
        });
      }
    }
  }, []);

  const onCapturePicture = () => {
    // take picture
    const canvas = document.createElement('canvas');
    canvas.width = captureVideoRef.current!.videoWidth;
    canvas.height = captureVideoRef.current!.videoHeight;
    canvas.getContext('2d')!.drawImage(captureVideoRef.current!, 0, 0);
    const data = canvas.toDataURL('image/png');

    console.log(data);

    // Convert data URL to Blob
    const byteString = Buffer.from(data.split(',')[1], 'base64');
    const mimeString = data.split(',')[0].split(':')[1].split(';')[0];
    const blob = new Blob([byteString], { type: mimeString });

    // send picture to parent
    onGetCapturePicture(data, blob.size);
    // stop video stream
    pictureStream!.getTracks().forEach((track) => track.stop());
    setShowCapturePicture(false);
  };

  const onStopCapturingPicture = () => {
    // stop video stream
    pictureStream!.getTracks().forEach((track) => track.stop());
    setShowCapturePicture(false);
  };
  return (
    <div className='fixed    top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   w-full md:2/3 lg:w-1/2 h-full p-sm z-40 text-sm font-mono text-white '>
      <video ref={captureVideoRef} className='bg-black w-full h-full min-h-full min-w-full object-cover rounded-lg' />
      <div className='flex items-center justify-around gap-sm p-lg transform translate-x-1/2 absolute w-1/2 md:2/3 lg:w-1/2 bottom-10  left-0  h-[50px] bg-black opacity-50 backdrop-blur-md  rounded-full '>
        <div className='flex items-center gap-xs'>
          <button title='Capture a picture' onClick={onCapturePicture} className=' rounded-full flex items-center justify-center p-md'>
            <RiCamera3Line size={20} />
          </button>
        </div>

        <div className='flex items-center gap-xs'>
          <button onClick={onStopCapturingPicture} title='Leave camera' className='bg-gray-700 px-lg p-md gap-xs   rounded-full flex items-center justify-center '>
            <RiArrowRightUpLine size={15} />
            <span>Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
}
