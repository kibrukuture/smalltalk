'use client';
import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

export default function UserDetail() {
  const [currentTab, setCurrentTab] = useState('media');

  const onTabs = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <div className='md:w-[33%]  p-2xl flex flex-col gap-md text-skin-muted h-screen max-h-screen overflow-y-auto'>
      <div className='flex items-center gap-lg '>
        <button>
          <RiCloseLine size={20} />
        </button>
        <h2>Profile</h2>
      </div>
      <div className='flex items-center justify-center'>
        <div className='relative'>
          <button className='relative overflow-hidden text-skin-muted w-20 h-20  flex items-center justify-center   rounded-full '>
            <img className='object-cover h-40 w-40 ' src='/dog.jpg' alt='' />
          </button>
        </div>
      </div>

      <div className='flex flex-col '>
        <p>Kibru Kuture</p>
        <p className='text-skin-muted  text-xs'>Last seen on 2:30 PM</p>
      </div>

      {/* media, files, link tabs */}
      <div className=''>
        <div className='flex items-center gap-md'>
          <button onClick={() => onTabs('media')} className={`${currentTab === 'media' && 'text-green-400'}`}>
            Media
          </button>
          <button onClick={() => onTabs('files')} className={`${currentTab === 'files' && 'text-green-400'}`}>
            Files
          </button>
          <button onClick={() => onTabs('links')} className={`${currentTab === 'links' && 'text-green-400'}`}>
            Links
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-xs '>Files</div>
    </div>
  );
}
