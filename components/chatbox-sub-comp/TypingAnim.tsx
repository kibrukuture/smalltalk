export default function ThreeDotAnimation() {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex space-x-1'>
        <div className='w-1 h-1 bg-green-400 rounded-full animate-pulse'></div>
        <div className='w-1 h-1 bg-green-400 rounded-full animate-pulse delay-100'></div>
        <div className='w-1 h-1 bg-green-400 rounded-full animate-pulse delay-200'></div>
      </div>
    </div>
  );
}
