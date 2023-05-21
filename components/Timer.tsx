import { useEffect, useState } from 'react';
export default function AudioTimer() {
  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTime);
    }, 1);

    return () => {
      clearInterval(interval);
      console.log('unmounted');
    };
  }, [startTime]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const miliseconds = milliseconds % 1000;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedMiliseconds = String(miliseconds).padStart(3, '0');

    return `${formattedMinutes}:${formattedSeconds}:${formattedMiliseconds}`;
  };

  const formattedTime = formatTime(currentTime);

  return (
    <>
      <span>{formattedTime}</span> &bull;
    </>
  );
}
