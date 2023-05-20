'use client';
import { RiMessage3Line, RiNotification3Line, RiSettings3Line, RiLogoutCircleLine, RiUser6Line } from 'react-icons/ri';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ChatContext, Tab } from '@/app/ChatContext';

export const tabs = ['chat', 'notification', 'setting', 'profile'];
export default function Bar() {
  const [windowWidth, setWindowWidth] = useState(0);

  const { setBarCurrentTab, barCurrentTab, friendRequests } = useContext(ChatContext);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', () => {
        setWindowWidth(window.innerWidth);
      });
    }
  }, []);

  const onUserSignOut = () => {
    // sign out user
    localStorage.removeItem('logInToken');
    localStorage.removeItem('user');
    // redirect to login page
    router.push('/');
  };

  const onBarCurrentTab = (e: any, tab: Tab) => setBarCurrentTab(tab);

  const navbar = (
    <div className='w-full p-lg bg-black z-20 md:z-0 md:w-auto justify-center md:justify-start flex md:flex-col gap-md items-center text-skin-base   '>
      <button onClick={(e) => onBarCurrentTab(e, 'chat')} aria-label='chat' className={`${barCurrentTab === 'chat' && 'text-teal-400'}`}>
        <RiMessage3Line size={20} />
      </button>
      <button onClick={(e) => onBarCurrentTab(e, 'notification')} aria-label='notification' className={`${barCurrentTab === 'notification' && 'text-teal-400'} relative`}>
        <RiNotification3Line size={20} />
        {friendRequests.length > 0 && <span className='bg-red-500 rounded-full w-2 h-2 absolute -top-1 -right-1 -mt-1 mr-1'></span>}
      </button>
      <button onClick={(e) => onBarCurrentTab(e, 'setting')} aria-label='setting' className={`${barCurrentTab === 'setting' && 'text-teal-400'}`}>
        <RiSettings3Line size={20} />
      </button>
      <button onClick={(e) => onBarCurrentTab(e, 'profile')} aria-label='profile' className={`${barCurrentTab === 'profile' && 'text-teal-400'}`}>
        <RiUser6Line size={20} />
      </button>
    </div>
  );
  // if window width is greater than 768px, show the sidebar
  return windowWidth >= 768 ? (
    <div className='bg-black justify-between px-xl flex flex-col gap-3xl'>
      <div className='flex flex-col gap-lg'>
        <div className='pt-xl flex flex-col font-code '>
          <p>small</p>
          <p>talk</p>
        </div>
        {navbar}
      </div>
      <button onClick={onUserSignOut} className='text-xs hover:underline hover:underline-offset-2   mb-3xl flex items-center' aria-label='logout'>
        Sign out
      </button>
    </div>
  ) : (
    navbar
  );
}
