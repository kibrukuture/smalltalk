import { RiImageLine, RiFileLine } from 'react-icons/ri';
export default function Emoji() {
  return (
    <div className='bg-skin-muted absolute transform -translate-y-full -translate-x-1/2  right-0 rounded-md'>
      <button className='flex items-center gap-sm p-md'>
        <RiImageLine />
        <p>Photo or video</p>
      </button>
      <button className='flex items-center gap-sm p-md'>
        <RiFileLine />
        <p>Document</p>
      </button>
    </div>
  );
}
