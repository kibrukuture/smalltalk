// import React, { useRef, useEffect } from 'react';

// export default function AudioVisualizer({ src }: { src: string }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const audioContext = new AudioContext();
//     const audioElement = new Audio(src);
//     const audioSource = audioContext.createMediaElementSource(audioElement);
//     const analyser = audioContext.createAnalyser();
//     analyser.fftSize = 256;
//     audioSource.connect(analyser);
//     analyser.connect(audioContext.destination);

//     const canvasCtx = canvas.getContext('2d');
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const draw = () => {
//       requestAnimationFrame(draw);
//       analyser.getByteFrequencyData(dataArray);
//       canvasCtx.fillStyle = 'transparent';
//       canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
//       const barWidth = (canvas.width / bufferLength) * 2.5;
//       let barHeight;
//       let x = 0;
//       for (let i = 0; i < bufferLength; i++) {
//         barHeight = dataArray[i];
//         canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
//         canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
//         x += barWidth + 1;
//       }
//     };

//     audioElement.play();
//     draw();

//     return () => {
//       audioElement.pause();
//       audioElement.currentTime = 0;
//     };
//   }, [src]);

//   return <canvas ref={canvasRef} className='w-full max-h-5 bg-skin-muted block' />;
// }
