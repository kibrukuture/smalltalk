import { useEffect, useRef, useState } from 'react';
import BinaryFileModal from './BinaryFileModal';
import { RiFileLine, RiImageLine } from 'react-icons/ri';
import { BinFile } from '@/app/ChatContext';

export default function Attachment({ setShowAttachment, setBinFile, setShowBinaryFileModal, setBinFileLoading }: { setShowAttachment: React.Dispatch<React.SetStateAction<boolean>>; setBinFile: React.Dispatch<React.SetStateAction<BinFile>>; setShowBinaryFileModal: React.Dispatch<React.SetStateAction<boolean>>; setBinFileLoading: React.Dispatch<React.SetStateAction<boolean>> }) {
  // const [showBinaryFileModal, setShowBinaryFileModal] = useState(false);
  // const [binFile, setBinFile] = useState({} as BinFile);

  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const binaryFileFromLocalFs = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    function onClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowAttachment(false);
      }
    }

    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [ref]);

  const getMimeExtension = (type: string) => type.split('/')[1];

  // file type: 'image' | 'video' | 'audio' | 'document'

  const getFileType = (type: string) => {
    if (['image', 'video', 'audio'].includes(type.split('/')[0])) return type.split('/')[0];
    return 'document';
  };

  // handlers
  const onAttachment = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
    e.preventDefault();
    //  hanlle photos, videos, or audios

    if (type === 'photovideoaudio') {
      binaryFileFromLocalFs.current.setAttribute('accept', 'image/*,video/*,audio/*');
    } else if (type === 'document') {
      binaryFileFromLocalFs.current.setAttribute('accept', 'text/*, application/*');
    }

    binaryFileFromLocalFs.current.addEventListener('change', (e) => {
      const file = e.target.files[0];
      setBinFileLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener('progress', (e) => {
        console.log((e.loaded / e.total) * 100, '% loaded');
      });

      reader.addEventListener('load', async (e) => {
        setBinFile({
          name: file.name,
          type: getFileType(file.type),
          size: file.size,
          data: reader.result as string,
          ext: getMimeExtension(file.type),
          dur: file.type.startsWith('audio') || file.type.startsWith('video') ? await getMediaDuration(file) : 0,
        });
        setShowBinaryFileModal(true);
        setBinFileLoading(false);
        console.log(reader.result);
      });
      console.log(file);
    });
    binaryFileFromLocalFs.current.click();

    setShowAttachment(false);
  };
  return (
    <div ref={ref} className='bg-skin-muted text-skin-base absolute transform -translate-y-full -translate-x-1/2  right-0 rounded-md flex flex-col '>
      <button onClick={(e) => onAttachment(e, 'photovideoaudio')} className='rounded-md flex items-center gap-sm p-md hover:bg-teal-300 w-full'>
        <RiImageLine />
        <p>Photo or video</p>
      </button>
      <button onClick={(e) => onAttachment(e, 'document')} className='rounded-md flex items-center gap-sm p-md hover:bg-teal-300 w-full'>
        <RiFileLine />
        <p>Document</p>
      </button>
      {/* invisible input type of file */}
      <input ref={binaryFileFromLocalFs} type='file' name='file' id='file' className='invisible w-0 h-0' />
    </div>
  );
}

function getMediaDuration(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const mediaElement = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
      mediaElement.preload = 'metadata';

      mediaElement.onloadedmetadata = function () {
        window.URL.revokeObjectURL(mediaElement.src);
        resolve(mediaElement.duration);
      };

      mediaElement.onerror = function () {
        reject(new Error('Error occurred while getting media duration.'));
      };

      mediaElement.src = URL.createObjectURL(file);
    };

    reader.onerror = function () {
      reject(new Error('Error occurred while reading the file.'));
    };

    reader.readAsDataURL(file);
  });
}

/*
mime type:
for image
image/bmp
image/gif
image/jpeg
image/png
image/svg+xml
image/tiff

mime type for video:
video/mpeg
video/mp4
video/ogg
video/quicktime
video/webm

mime type for audio:
audio/midi
audio/mpeg
audio/webm
audio/ogg
audio/wav
audio/aac
*/

/*

 clientOne, clientTwo, initiator.

clientOne and clientTwo are friends. (they share there Ids. to create a room.) RoomId.

#. Room ( roomId=string, clientoneId=string,clientTwoId=string, createdAt=string, accepted=boolean, inactive=boolean)

#. Messages (roomId,messageId, sentbyId, text, createdAt,updateAt, replyId, emoji, link, attachment(image,video,audio,document))

#. clientOne (name, username,  avatarUrl, avatarId, email, createdAt, updatedAt,clientId, lastSeen,bio )

#. clientTwo (name, username,  avatarUrl, avatarId, email, createdAt, updatedAt,clientId, lastSeen,bio )

#. user (user_id, username, email, password)

*/

/*

to get all chats: get clientId



#. Messages (roomId,messageId, sentbyId, text, createdAt,updateAt, replyId, emoji, link, attachment(image,video,audio,document))

messages:[
  {
    roomId: string,
    messageId: string,
    sentbyId: string,
    text: string,
    createdAt: string,
    updateAt: string,
    replyId: string,
    emoji: string,
    link: {
      site: 'YouTube',
      url: 'https://www.youtube.com/watch?v=zqeqdepYkcw',
      title: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',
      description:  "",
      type: 'video',
      date: '2021-03-03T16:00:00.000Z',
      image: {
        url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
        width: '1280',
        height: '720',
        type: 'jpg',
      },
    } || null,
    attachment: {
      type: 'image', // image, video, audio, document
      url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
      width: '1280',
      height: '720',
      size: '1.2mb',
    } || null,
  }
]



  const link = {
    siteName: 'YouTube',
    url: 'https://www.youtube.com/watch?v=zqeqdepYkcw',
    title: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',
    description: `Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...`,
    type: 'video',
    date: '2021-03-03T16:00:00.000Z',
    image: {
      url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
      width: '1280',
      height: '720',
      type: 'jpg',
    },
  };

  allchats =[
    {
      roomId: string,
      clinetOne,
      clientTwo,
      createdAt: string,
      messages:[
        message1,
        message2,
        message3,
      ]
    }
  ]

  what about : rooms.map( room => {
    return {
      roomId: room.roomId,
      clientOne: await supabse.from('client').select('*').eq('clientId', room.clientOneId),
      clientTwo: await supabse.from('client').select('*').eq('clientId', room.clientTwoId),
      createdAt: room.createdAt,
      messages: await supabse.from('messages').select('*').eq('roomId', room.roomId)
    }
  })
*/
