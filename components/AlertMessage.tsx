'use client';
import { RiInformationLine, RiCloseLine } from 'react-icons/ri';
import { Alert } from '@/app/ChatContext';
export default function AlertMessage({ alert, onAlertClose }: { alert: Alert; onAlertClose: () => void }) {
  //close

  const { title, message, type } = alert;
  return (
    <div className={`${getColorPalette(type)} rounded flex gap-sm p-md absolute bottom-1 right-1 md:w-[50%] lg:w-[40%]`}>
      <div>
        <RiInformationLine className='text-sm ' size={20} />
      </div>
      <div className='flex flex-col gap-sm '>
        <p className=' font-bold'>{title}</p>
        <p>{message}</p>
      </div>
      <button onClick={() => onAlertClose()} className='text-sm cursor-pointer absolute top-1 right-1'>
        <RiCloseLine size={20} />
      </button>
    </div>
  );
}

function getColorPalette(type: string) {
  switch (type) {
    case 'error':
      return 'bg-red-300 text-red-700';
    case 'warning':
      return 'bg-yellow-300 text-yellow-700';
    case 'success':
      return 'bg-green-300 text-green-700';
    default:
      return 'bg-red-300 text-red-700';
  }
}
