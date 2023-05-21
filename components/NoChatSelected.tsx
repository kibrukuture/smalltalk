import Link from 'next/link';
import { RiLock2Fill } from 'react-icons/ri';
export default function NoChatSelected() {
  return (
    <div className='flex select-none w-full flex-col max-h-screen h-screen  items-center justify-center   '>
      <div className='text-skin-muted font-mono flex flex-col items-center '>
        <h1 className='font-code text-2xl md:text-4xl my-xl '>smalltalk</h1>

        <div className='w-1/4'>
          <img src='/social.svg' alt='' className='pointer-events-none select-none' />
        </div>
        <p className='text-skin-muted text-lg md:text-2xl my-sm '>Start a conversation</p>
        <div className='flex flex-col text-sm gap-xs'>
          <p className='flex gap-xs items-center select-none'>
            <RiLock2Fill /> End to end encrypted
          </p>
          <p>
            Check out how chat
            <Link target='_blank' href='/doc/end-to-end/' className='underline underline-offset-2 pl-1'>
              encryption works
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
