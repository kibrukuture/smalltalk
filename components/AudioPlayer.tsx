import React, { useState, useEffect, useRef } from 'react';
import { RiPlayMiniFill, RiPauseMiniFill } from 'react-icons/ri';

const url = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
export default function AudioPlayer({ audioUrl = url }) {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const barRef = useRef(null);
  const audioRef = useRef(null);

  const onProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickOffsetX = e.pageX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const newProgress = (clickOffsetX / progressBarWidth) * 100;

    const audio = audioRef.current;
    if (audio) {
      let currentTime = (newProgress / 100) * audio.duration;
      audio.currentTime = currentTime;
      setCurrentTime(currentTime);
      setPaused(false);
      audio.play();
    }
    setProgress(newProgress);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);

        let width = barRef.current.getBoundingClientRect().width;
        setProgress(audio.currentTime * width);

        const prog = width * (audio.currentTime / audio.duration);
        setProgress((prog / width) * 100);
      });

      audio.addEventListener('ended', () => {
        setCurrentTime(0);
        audio.currentTime = 0;
        setPaused(true);
      });
    }

    const onKeyDown = (e) => {
      let tempProgress;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setProgress((prevProgress) => {
          tempProgress = Math.min(prevProgress + 2, 100);
          fn(tempProgress, audio);
          return tempProgress;
        });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setProgress((prevProgress) => {
          tempProgress = Math.max(prevProgress - 2, 0);
          fn(tempProgress, audio);
          return tempProgress;
        });
      }
      function fn(progress, audio) {
        if (audio) {
          let currentTime = (progress / 100) * audio.duration;
          audio.currentTime = currentTime;
          setCurrentTime(currentTime);
          setPaused(false);
          audio.play();
        }
      }
    };

    const bar = barRef.current;
    if (bar) {
      bar.addEventListener('keydown', onKeyDown);
    }

    return () => {
      bar && bar.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const onPlayMedia = (e) => {
    setPaused(!paused);
    const audio = audioRef.current;
    if (paused) audio.play();
    else audio.pause();
  };

  const progressBarStyles = {
    width: '100%',
    height: '5px',
    border: '1px solid #ccc',
    borderRadius: '1rem',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'black',
    display: 'flex',
    alignItems: 'center',
  };

  const progressFillStyles = {
    height: '100%',
    backgroundColor: 'teal',
    width: `${progress}%`,
    transition: 'width 0.3s ease-in-out',
    borderRadius: '1rem',
    margin: 'auto 0',
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button
          onClick={onPlayMedia}
          style={{
            display: 'flex',
            padding: '.25rem',
            borderRadius: '100%',
            border: '0',
            borderColor: 'transparent',
            background: 'teal',
            color: 'whitesmoke',
          }}
        >
          {paused ? <RiPlayMiniFill /> : <RiPauseMiniFill />}
        </button>
        <div tabIndex={0} ref={barRef} style={progressBarStyles} onClick={onProgressClick}>
          <div style={progressFillStyles}></div>
          <audio src={audioUrl} ref={audioRef} />
        </div>
      </div>
      <span
        style={{
          fontSize: 'small',
          fontFamily: 'monospace',
        }}
      >
        {formatTime(currentTime * 1000)}
      </span>
    </div>
  );
}

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  const formattedHours = hours > 0 ? String(hours).padStart(2, '0') + ':' : '';
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}
