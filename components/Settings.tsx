import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ChatContext } from '@/app/ChatContext';

export default function Settings() {
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const { setTheme, theme } = useContext(ChatContext);
  return (
    <div className='font-mono bg-skin-muted text-skin-muted gap-md  text-sm flex flex-col p-lg overflow-y-auto h-screen max-h-screen'>
      <h1 className=' text-md  '>#. Settings</h1>
      {/* theme */}
      <div className=''>
        <div className='flex items-center gap-sm justify-between w-full'>
          <h2 className='py-lg self-center w-fit mx-auto'>Theme</h2>
        </div>
        <div className='flex items-center gap-sm text-xs text-skin-base '>
          <button className={`${theme === 'dark' && 'text-teal-400'}`} onClick={() => setTheme('dark')}>
            Dark
          </button>
          <button className={`${theme === 'light' && 'text-teal-400'}`} onClick={() => setTheme('light')}>
            Light
          </button>
          <button className={`${theme === 'system' && 'text-teal-400'}`} onClick={() => setTheme('system')}>
            System
          </button>
        </div>
      </div>
      {/* wallpaper */}
      <Wallpaper />

      {/* delete account */}
      <div className='bg-red-400 p-md rounded text-white flex items-center justify-center mt-lg'>
        <button onClick={() => setDeleteAccountModal(true)} className='w-full h-full'>
          Delete Account
        </button>
      </div>
      {deleteAccountModal && <DeleteAccountModal setDeleteAccountModal={setDeleteAccountModal} />}
    </div>
  );
}

function Wallpaper() {
  const { setWallpaper } = useContext(ChatContext);
  const onWallpaper = (wallpaper: string) => {
    localStorage.setItem('wallpaper', wallpaper);
    setWallpaper(wallpaper);
  };

  return (
    <div className='flex flex-col text-skin-muted text-sm font-mono  '>
      <h2 className='py-lg self-center'>Chat Wallpaper</h2>
      <ul className='grid grid-cols-3 gap-sm grid-auto-rows-[40px] text-skin-base'>
        <div className=''>
          <p className='text-xs mb-1 '>Default</p>
          <li
            style={{
              backgroundImage: 'url(./wallpaper/default.png)',
            }}
            className='h-[40px] flex flex-col gap-sm  items-center justify-center  p-xs rounded'
          >
            <button onClick={() => onWallpaper('default')} className='w-full h-full' />
          </li>
        </div>
        <div className=''>
          <p className='text-xs mb-1 '>Solid</p>
          <li className='h-[40px] flex flex-col gap-sm  items-center justify-center  p-xs rounded'>
            <input type='color' onChange={() => onWallpaper('salid')} className='w-full h-full border-none outline-none' />
          </li>
        </div>
        <div className=''>
          <p className='text-xs mb-1 '>Photo</p>
          <li className='h-[40px] flex flex-col gap-sm  items-center justify-center bg-teal-300 p-xs rounded'>
            <button className='w-full h-full'></button>
            <input type='file' onChange={() => onWallpaper('photo')} className='invisible w-0 h-0 ' />
          </li>
        </div>
        <div className=''>
          <p className='text-xs mb-1 '>Dark</p>
          <li className='h-[40px] flex flex-col gap-sm  items-center justify-center bg-black p-xs rounded'>
            <button onClick={() => onWallpaper('dark')} className='w-full h-full'></button>
          </li>
        </div>
        <div className=''>
          <p className='text-xs mb-1 '>Light</p>
          <li className='h-[40px] flex flex-col gap-sm  items-center justify-center bg-white p-xs rounded'>
            <button onClick={() => onWallpaper('light')} className='w-full h-full'></button>
          </li>
        </div>
      </ul>
      <h2 className='py-lg self-center'>Gallery</h2>
      <Galleries />
    </div>
  );
}

function Galleries() {
  const onWallpaper = (wallpaper: string) => {
    console.log(wallpaper);
  };
  return (
    <ul className='grid grid-cols-2 gap-sm grid-auto-rows-[100px]  '>
      <li
        style={{
          backgroundImage: 'url(./wallpaper/default.png)',
        }}
        className='h-[100px] flex flex-col gap-sm  items-center justify-center  p-xs rounded'
      >
        <button onClick={() => onWallpaper('default')} className='w-full h-full' />
      </li>
      <li className='h-[100px] flex flex-col gap-sm  items-center justify-center  p-xs rounded'>
        <input type='color' onChange={() => onWallpaper('salid')} className='w-full h-full border-none outline-none' />
      </li>
      <li className='h-[100px] flex flex-col gap-sm  items-center justify-center bg-teal-300 p-xs rounded'>
        <button className='w-full h-full'></button>
        <input type='file' onChange={() => onWallpaper('photo')} className='invisible w-0 h-0 ' />
      </li>
      <li className='h-[100px] flex flex-col gap-sm  items-center justify-center bg-black p-xs rounded'>
        <button className='w-full h-full'></button>
      </li>
      <li className='h-[100px] flex flex-col gap-sm  items-center justify-center bg-white p-xs rounded'>
        <button className='w-full h-full'></button>
      </li>
    </ul>
  );
}

// delete account && redirect to login
function DeleteAccountModal({ setDeleteAccountModal }: { setDeleteAccountModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [accoundDeleting, setAccountDeleting] = useState(false);
  const router = useRouter();
  // perform account deletion
  const onAccountDelete = async () => {
    setAccountDeleting(true);
    //user
    const user = JSON.parse(localStorage.getItem('user') as string);
    const id = user.id;

    // delete account
    const res = await fetch(`http://localhost:4040/api/user/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    if (data.error) {
      return;
    }
    setAccountDeleting(false);
    // remove from local storage
    localStorage.removeItem('user');
    // remove modal
    setDeleteAccountModal(false);
    // redirect to login
    router.push('/');
  };
  if (accoundDeleting)
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-gray-700/50 fixed top-0 left-0 z-20'>
        <div className='bg-red-400 p-xl rounded   flex flex-col items-center justify-center mt-lg   bg-skin-muted w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3'>
          <p>Deleting account...</p>
        </div>
      </div>
    );

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-gray-700/50 fixed top-0 left-0 z-20'>
      <div className='bg-red-400 p-xl rounded   flex flex-col items-center justify-center mt-lg   bg-skin-muted w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3'>
        <p>Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.</p>
        <div className='flex items-center justify-end w-full gap-md mt-md'>
          <button onClick={onAccountDelete} className='font-mono text-skin-muted text-xs'>
            Confirm
          </button>
          <button onClick={() => setDeleteAccountModal(false)} className='font-mono text-skin-muted text-xs'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
