import React, { useState, useEffect, useRef, useContext } from 'react';
import { RiEditLine, RiAddFill } from 'react-icons/ri';
import { distanceToNow } from '@/app/util.fns';
import imageCompression from 'browser-image-compression';
import { ChatContext } from '@/app/ChatContext';

export default function Profile() {
  // consume context
  const { user, setUser } = useContext(ChatContext);

  const [edit, setEdit] = useState({
    name: false,
    userName: false,
    bio: false,
  });
  const [name, setName] = useState(user.name);
  const [userName, setuserName] = useState(user.userName);
  const [bio, setBio] = useState(user.bio || '很抱歉，​我不会说中文。');
  const [profile, setProfile] = useState();
  const [mouseEnter, setMouseEnter] = useState({
    name: false,
    userName: false,
    bio: false,
  });
  const [error, setError] = useState({
    name: false,
    userName: false,
  });

  const profilePhotoRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('user') as string); // get from local storage if it exists
  //   if (user) {
  //     setName(user.name);
  //     setuserName(user.userName);
  //   } else {
  //     // fetch from server (reason: local storage might be cleared)
  //   }
  // }, []);

  // handler
  const onProfileEdit = (type: string) => {
    if (type === 'name') {
      setEdit({ ...edit, name: true });
    } else if (type === 'userName') {
      setEdit({ ...edit, userName: true });
    } else if (type === 'bio') setEdit({ ...edit, bio: true });
  };

  const onMouseEnter = (type: string, action: string) => {
    if (type === 'name') {
      setMouseEnter({ ...mouseEnter, name: action === 'enter' ? true : false });
    } else if (type === 'userName') {
      setMouseEnter({ ...mouseEnter, userName: action === 'enter' ? true : false });
    } else if (type === 'bio') {
      setMouseEnter({ ...mouseEnter, bio: action === 'enter' ? true : false });
    }
  };

  const onProfilePhotoUpload = async () => {
    try {
      const uploadPhoto = profilePhotoRef.current;
      if (uploadPhoto) {
        uploadPhoto.addEventListener('change', async (e: Event) => {
          const files = e.target.files as FileList;

          // compress image
          const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1920 / 2,
            useWebWorker: true,
          };
          let compressedFile = await imageCompression(files[0], options);
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = async () => {
            if (reader.error) return console.log('ERROR', reader.error);
            const content = reader.result;
            console.log(reader.DONE, content);

            // make post request to server
            //  dataUrl, userId, fileName
            const user = JSON.parse(localStorage.getItem('user') as string);
            const res = await fetch('http://localhost:4040/api/user/upload-profile-picture', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user.userId,
                dataUrl: content,
                fileName: files[0].name,
              }),
            });
            const data = await res.json();
            console.log('the user is ', data.user);
            if (data.status === 'ok') {
              // update user's localstorage.
              localStorage.setItem('user', JSON.stringify(data.user));
              setUser(data.user);
            }
          };
        });
        uploadPhoto.click(); // activate dialog.
      }
    } catch (err) {
      // image could not be processed and uploadedto cloudinary server.
      console.log(err);
    }
  };

  const onProfileChange = async (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
    const user = JSON.parse(localStorage.getItem('user') as string);
    if (type === 'name') {
      // await updateProfileNameOruserName('name', name);
      updateProfile('name', name, user.userId, setUser);
      setEdit({ ...edit, name: false });
    } else if (type === 'userName') {
      const regex = /^[a-zA-Z0-9_]{3,16}$/; // userName legal? ( should be alpha numeric and optional underscore, 3-16 chars long)
      if (regex.test(userName)) {
        // await updateProfileNameOruserName('userName', userName);
        updateProfile('userName', userName, user.userId, setUser);
        setEdit({ ...edit, userName: false });
      } else setError({ ...error, userName: true });
    } else if (type === 'bio') {
      updateProfile('bio', bio, user.userId, setUser);
      setEdit({ ...edit, bio: false });
    }
  };

  return (
    <div className='flex flex-col gap-lg h-screen max-h-screen overflow-y-auto pt-xl text-skin-base font-mono p-lg'>
      <h1 className='font-mono text-md text-skin-muted'>#. Profile</h1>
      {/* top part */}
      <div className='flex flex-col gap-sm items-center '>
        <button onClick={onProfilePhotoUpload} className='relative flex items-center justify-center h-20 w-20 rounded-full  outline outline-offset-2 outline-2 outline-gray-300 overflow-hidden'>
          <img src={user.avatarUrl || JSON.parse(localStorage.getItem('user') as string).avatarUrl} alt='profile picture' className='object-cover h-40 w-40 ' />
          <input type='file' ref={profilePhotoRef} className='invisible w-0 absolute top-0 left-0' accept='*' />
          <p className='absolute bottom-1 right-1 transform -translate-y-1/2 '>
            <RiAddFill className='text-xl text-gray-300' aria-label='add picture' />
          </p>
        </button>

        <div className='text-skin-base text-sm font-mono flex flex-col gap-md w-[90%] mx-auto'>
          <div onMouseLeave={() => onMouseEnter('name', 'leave')} onMouseEnter={() => onMouseEnter('name', 'enter')} className=''>
            {!edit.name && (
              <div className='flex gap-md items-center'>
                <p className='block w-full text-skin-base'>{name}</p>
                <button onClick={(e) => onProfileEdit('name')} className={`${mouseEnter.name ? 'visible' : 'invisible'}   `}>
                  <RiEditLine className='text-md text-skin-muted' aria-label='edit name' />
                </button>
              </div>
            )}
            {edit.name && (
              <div className='flex flex-col gap-sm'>
                <div className='flex gap-xs items-center'>
                  <input value={name} onChange={(e) => setName(e.target.value)} className='block font-mono bg-skin-muted grow   w-full  p-sm   text-skin-muted border-2   outline-none border-gray-300 focus:border-teal-400 focus:outline-none transition duration-500' type='text' name='' id='' />
                  <button onClick={(e) => onProfileChange(e, 'name')} className='px-md py-sm text-sm text-skin-muted'>
                    Save
                  </button>
                </div>
                {error.name && <p>Name can't be empty</p>}
              </div>
            )}
          </div>
          <div onMouseLeave={() => onMouseEnter('userName', 'leave')} onMouseEnter={() => onMouseEnter('userName', 'enter')} className=''>
            {!edit.userName && (
              <div className='flex gap-md items-center'>
                <p className='block w-full'>@{userName}</p>
                <button onClick={(e) => onProfileEdit('userName')} className={`${mouseEnter.userName ? 'visible' : 'invisible'}   `}>
                  <RiEditLine className='text-md text-skin-muted' aria-label='edit userName' />
                </button>
              </div>
            )}
            {edit.userName && (
              <div className='flex flex-col gap-sm '>
                <div className='flex gap-xs items-center'>
                  <input value={'@' + userName} onChange={(e) => setuserName(e.target.value.replace('@', ''))} className='block font-mono bg-skin-muted grow   w-full  p-sm   text-skin-muted border-2   outline-none border-gray-300 focus:border-teal-400 focus:outline-none transition duration-500' type='text' name='' id='' />
                  <button onClick={(e) => onProfileChange(e, 'userName')} className='px-md py-sm text-sm text-skin-muted'>
                    Save
                  </button>
                </div>
                {error.userName && <p className='text-red-300'>Invalid userName</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* bottom part  */}

      <div className='flex flex-col gap-sm'>
        <p className=' text-skin-muted '>#. About me</p>

        <div onMouseLeave={() => onMouseEnter('bio', 'leave')} onMouseEnter={() => onMouseEnter('bio', 'enter')}>
          {!edit.bio && (
            <div className='flex gap-md items-center'>
              <p className='block w-full'>{bio}</p>
              <button onClick={(e) => onProfileEdit('bio')} className={`${mouseEnter.bio ? 'visible' : 'invisible'}   `}>
                <RiEditLine className='text-md text-skin-muted' aria-label='edit userName' />
              </button>
            </div>
          )}
          {edit.bio && (
            <div className='flex flex-col gap-sm '>
              <div className='flex gap-xs items-center'>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className='block font-mono bg-skin-muted grow   w-full  p-sm   text-skin-muted border-2   outline-none border-gray-300 focus:border-teal-400 focus:outline-none transition duration-500' name='' id='' />
                <button onClick={(e) => onProfileChange(e, 'bio')} className='px-md py-sm text-sm text-skin-muted'>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* log in activities */}

      <div className='flex flex-col gap-sm text-xs text-skin-muted '>
        <p className='text-sm text-skin-base '>#. Recent activities</p>
        <div className='flex flex-col gap-1 p-lg shadow-sm '>
          <span>Last Logged</span>
          <span>{distanceToNow(Date.now())}</span>
          <span>
            <span className='text-skin-muted'>203.0.113.1, London</span>
          </span>
        </div>
        <div className=' flex flex-col gap-1 p-lg shadow-sm '>
          <span>Last Logged</span>
          <span>{distanceToNow(new Date('2021-10-10 10:10:10'))}</span>
          <span>198.51.100.1, Tokyo</span>
        </div>
        <div className=' flex flex-col gap-1 p-lg shadow-sm '>
          <span>Last Logged</span>
          <span>{distanceToNow(new Date('2021-10-10 10:10:10'))}</span>
          <span>10.0.0.1, Sydney</span>
        </div>
      </div>
    </div>
  );
}

async function updateProfile(type: string, value: string, userId: string, setUser: any) {
  const res = await fetch('http://localhost:4040/api/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      type,
      value,
      userId,
    }),
  });

  const data = await res.json();
  if (data.status === 'ok') {
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }
}
