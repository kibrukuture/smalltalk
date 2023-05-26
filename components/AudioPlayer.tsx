import { useState, useRef, MouseEvent, MouseEventHandler, useEffect } from 'react';
import { RiPlayMiniFill, RiPauseMiniFill } from 'react-icons/ri';

export default function AudioPlayer({ src }: { src: string }) {
  //   //   states
  //   const [paused, setPaused] = useState(true);
  //   const [playingBarWidth, setPlayingBarWidth] = useState(0);

  //   //   ref
  //   const stillBarRef = useRef<HTMLDivElement>(null);
  //   const audioRef = useRef<HTMLAudioElement>(null);
  //   //   const playingBarRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     //get width of still bar
  //     const stillBar = stillBarRef.current;
  //     const audio = audioRef.current;
  //     if (stillBar && audio) {
  //       const stillBarWidth = stillBar?.getBoundingClientRect().width;

  //       audio.addEventListener('timeupdate', () => {
  //         const currentTime = audio.currentTime;
  //         const duration = audio.duration;
  //         const percent = (currentTime / duration) * 100;
  //         console.log(percent);
  //         // setPlayingBarWidth(percent * stillBarWidth);
  //       });
  //     }
  //   }, []);
  //   handlers
  //   const onAudioPlay = () => {
  //     setPaused(!paused);
  //     const audio = audioRef.current;
  //     if (audio) {
  //       if (paused) {
  //         audio.play();
  //       } else {
  //         audio.pause();
  //       }
  //     }
  //   };

  //
  //   const onStillBarMouseOver = (e: MouseEventHandler<HTMLDivElement>) => {
  //     console.log(e.target.getBoundingClientRect());
  //   };
  return (
    <>
      <audio id='player' controls>
        <source src={src} type='audio/mp3' />
        <source src={src} type='audio/ogg' />
      </audio>
    </>
  );
}

// /*
//       <div className='flex flex-col gap-xs text-xs italic font-mono '>
//         <div className='flex items-center gap-xs w-[200px]'>
//           <audio src={src} className='sr-only' aria-label='audio player' ref={audioRef}></audio>
//           {/* play | pause btn */}
//           <button onClick={onAudioPlay} className='flex items-center justify-center w-8 h-8 rounded-full bg-teal-400 text-white'>
//             {paused ? <RiPlayMiniFill /> : <RiPauseMiniFill />}
//           </button>
//           {/* controls */}
//           <div className='grow flex flex-col gap-1 '>
//             {/* audio range */}
//             <div onMouseEnter={onStillBarMouseOver} ref={stillBarRef} className='w-full h-1 bg-black rounded-full cursor-pointer'>
//               {/* playing part */}
//               <div /*ref={playingBarRef}*/ className='h-full bg-teal-400 rounded-full' style={{ width: playingBarWidth }}></div>
//             </div>
//             {/* time */}
//             <span className='text-xs text-gray-500 '>00:00</span>
//           </div>
//         </div>
//         <p>Recording.webm</p>
//       </div>
// */
