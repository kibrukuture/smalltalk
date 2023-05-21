// import React, { useState, useRef } from 'react';
// const data: Blob[] = [];
// function AudioRecorder() {
//   const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
//   //   const audioRef = useRef<HTMLAudioElement>(null)

//   const onRecordAudio = async () => {
//     data.length = 0;
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//     });

//     const mediaRecorder = new MediaRecorder(stream, {
//       mimeType: 'audio/webm;codecs=opus',
//     });
//     setRecorder(mediaRecorder);

//     mediaRecorder.ondataavailable = (e) => {
//       data.push(e.data);
//     };

//     mediaRecorder.start();
//   };

//   const onStopRecording = (e:) => {
//     setRecorder(null);
//     recorder.onstop = (e) => {
//       const blob = new Blob(data, { type: 'audio/webm' });
//       console.log('...data available...');
//       const audioURL = window.URL.createObjectURL(blob);
//       audioRef.current.src = audioURL;
//     };
//     recorder.stop();
//   };

//   const onRecordReset = () => {
//     audioRef.current.src = null;
//   };

//   console.log(data);
//   return (
//     <div>
//       <audio ref={audioRef} controls />
//       <br />
//       <div
//         style={{
//           display: 'flex',
//           gap: '1rem',
//           marginTop: '1rem',
//         }}
//       >
//         <button onClick={onRecordAudio}>Start</button>
//         <button onClick={onStopRecording}>Stop</button>
//         <button onClick={onRecordReset}>Reset</button>
//       </div>
//     </div>
//   );
// }
