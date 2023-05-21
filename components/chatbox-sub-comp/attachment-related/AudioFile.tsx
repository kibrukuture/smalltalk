import { useState, useRef, useEffect } from 'react';
import { RiPlayFill, RiPauseFill } from 'react-icons/ri';
import { Attachment } from '@/app/ChatContext';
import { formatFileSize, formatTime } from '@/app/util.fns';
// import AudioVisualizer from '@/components/AudioVisualizer';

export default function AudioFile({ attachment }: { attachment: Attachment }) {
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [ended, setEnded] = useState(false);

  // audio ref
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // duration
    audioRef.current?.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current!.duration);
    });

    // time update
    audioRef.current?.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current!.currentTime);
    });

    // drag
    audioRef.current?.addEventListener('seeking', () => {
      setIsDragging(true);
    });

    // drag end
    audioRef.current?.addEventListener('seeked', () => {
      setIsDragging(false);
    });
    return () => {
      audioRef.current?.removeEventListener('loadedmetadata', () => {});
      audioRef.current?.removeEventListener('timeupdate', () => {});
      audioRef.current?.removeEventListener('seeking', () => {});
      audioRef.current?.removeEventListener('seeked', () => {});
      audioRef.current?.removeEventListener('ended', () => {});
    };
  }, []);

  useEffect(() => {
    audioRef.current?.addEventListener('ended', () => {
      setPaused(true);
      setEnded(true);
    });
  }, [paused]);

  // handler
  const onAudio = () => {
    if (paused) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    setPaused(!paused);
    setEnded(false);

    audioRef.current?.addEventListener('ended', () => {
      setPaused(true);
    });
  };

  return (
    <div className='p-lg'>
      <div className='flex gap-xs items-center'>
        <button onClick={onAudio} className='inline-block p-lg rounded-full bg-teal-400'>
          {paused ? <RiPlayFill size={20} className='text-white' /> : <RiPauseFill size={20} className='text-white' />}
        </button>
        <div className='flex flex-col  '>
          <div className='text-skin-muted break-all font-mono text-xs'> {attachment.name.toLocaleLowerCase()}</div>
          {ended && (
            <div className='flex items-center gap-xs text-xs text-skin-muted w-full'>
              <span>{formatDuration(currentTime)} </span> &bull;<span>{formatFileSize(attachment.size!)}</span>
            </div>
          )}
          {!ended && (
            <div className='flex items-center gap-xs text-xs text-skin-muted'>
              <span className='text-teal-400'>{formatDuration(currentTime)}</span>
              <input type='range' id='progress' name='progress' min={0} max={duration} value={currentTime} onChange={(e) => (audioRef.current!.currentTime = Number(e.target.value))} step='0.01' className='bg-teal-500  h-1 w-full ' />
              {/* <AudioVisualizer src={attachment.url} /> */}
            </div>
          )}
        </div>
      </div>
      <audio ref={audioRef} src={attachment.url} className='mt-xs' />
    </div>
  );
}

function formatDuration(durationInSeconds: number) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
