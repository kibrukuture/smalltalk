import { useEffect, useRef, useState } from 'react';
import { RiCamera3Line, RiArrowRightUpLine, RiVidiconLine, RiRecordCircleFill, RiStopCircleLine } from 'react-icons/ri';
import { AudioTimer } from './VideoCallDisplayer';

export default function CapturePicture({ onGetCapturePicture, onGetVideoRecord, setShowCapturePicture }: { onGetCapturePicture: (data: string, size: number) => void; setShowCapturePicture: (show: boolean) => void; onGetVideoRecord: (data: string, size: number) => void }) {
  const [pictureStream, setPictureStream] = useState<MediaStream | null>(null);
  const [isVideoRecord, setIsVideoRecord] = useState(false);
  const [videoRecordMedia, setVideoRecordMedia] = useState<MediaRecorder | null>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const videoMediaChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (captureVideoRef.current !== null) {
        // remove previous video stream
        if (isVideoRecord) pictureStream!.getTracks().forEach((track) => track.stop());
        const video = captureVideoRef.current;
        const constraints = {
          video: true,
          audio: isVideoRecord,
        };
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          video.srcObject = stream;
          video.play();
          video.muted = true;
          setPictureStream(stream);

          if (isVideoRecord) {
            const videoMedia = new MediaRecorder(stream /*, { mimeType: 'video/webm; codecs=vp9' }*/);
            setVideoRecordMedia(videoMedia);

            videoMedia.ondataavailable = (e) => {
              videoMediaChunksRef.current.push(e.data);
            };
            videoMedia.start();

            // on stop

            videoMedia.onstop = () => {
              console.log(videoMediaChunksRef.current, videoMedia.mimeType);

              (async function (blobs: Blob) {
                const dataUrls = (await convertBlobToDataUrl(blobs)) as string;

                onGetVideoRecord(dataUrls, blobs.size);
                //          const audioBlob = new Blob(audioRecordDataRef.current, { type: 'audio/webm' });

                console.log(dataUrls);
              })(new Blob(videoMediaChunksRef.current, { type: 'video/mp4' }));

              // stop video stream
              stream.getTracks().forEach((track) => track.stop());
              videoMediaChunksRef.current.length = 0; // clean up.
              setShowCapturePicture(false);
              setVideoRecordMedia(null);
            };
          }
        });
      }
    }
  }, [isVideoRecord]);

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
    videoMediaChunksRef.current.length = 0; // reset blob
    // stop video stream
    pictureStream!.getTracks().forEach((track) => track.stop());
    setVideoRecordMedia(null);
    setShowCapturePicture(false);
  };

  // video record
  const onVideoRecord = () => {
    videoMediaChunksRef.current.length = 0; // remove previous records if any
    setIsVideoRecord(true);
  };

  const onStopRecord = () => {
    videoRecordMedia && videoRecordMedia.stop();
  };
  return (
    <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   w-full md:2/3 lg:w-1/2 h-full p-sm z-40 text-sm font-mono text-white '>
      <video ref={captureVideoRef} className='bg-black w-full h-full min-h-full min-w-full object-cover rounded-lg' />
      <div className='flex items-center justify-around gap-sm p-lg transform translate-x-1/2 absolute w-1/2 md:2/3 lg:w-1/2 bottom-10  left-0  h-[50px] bg-black opacity-50 backdrop-blur-md  rounded-full '>
        <div className='flex items-center gap-md'>
          {isVideoRecord ? (
            <AudioTimer />
          ) : (
            <button title='Capture a picture' onClick={onCapturePicture} className=' rounded-full flex items-center justify-center p-md '>
              <RiCamera3Line size={20} />
            </button>
          )}
          {
            isVideoRecord ? (
              <button onClick={onStopRecord} title='Stop the record' className='flex items-center text-red-500 '>
                <RiStopCircleLine size={20} />
              </button>
            ) : (
              <button onClick={onVideoRecord} title='Record video' className='flex items-center gap-1 '>
                <span className='bg-red-500 h-2 w-2 rounded-full ' />
                <RiVidiconLine size={20} />
              </button>
            )
            //RiStopCircleLine
          }
        </div>

        {!isVideoRecord && (
          <div className='flex items-center gap-xs'>
            <button onClick={onStopCapturingPicture} title='Leave camera' className='bg-gray-700 px-lg p-md gap-xs   rounded-full flex items-center justify-center '>
              <RiArrowRightUpLine size={15} />
              <span>Leave</span>
            </button>
          </div>
        )}
      </div>
      {isVideoRecord && (
        <span className='text-red-500  font-mono tracking-widest  animate-pulse absolute top-5 left-5 flex items-center justify-center'>
          <span className='bg-red-500 h-4 w-4 rounded-full' />
        </span>
      )}
    </div>
  );
}

function convertBlobToDataUrl(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}
