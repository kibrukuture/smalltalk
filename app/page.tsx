'use client';
import { useState, useContext, useEffect } from 'react';
import { ChatContext } from '@/app/ChatContext';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from './util.fns';
import Link from 'next/link';

export default function SignIn() {
  const [user, setUser] = useState({ email: '', password: '' });

  // consume context
  const { onUserSignIn, error } = useContext(ChatContext);

  // router
  const router = useRouter();

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.email.trim() === '' || user.password.trim() === '') return;
    onUserSignIn(user);
    // reset form
    setUser({ email: '', password: '' });
  };

  // localStorage?.getItem('logInToken') && router.push('/chat');

  return (
    <div className='h-screen gap-md md:gap-lg flex items-center justify-center mx-auto w-[70%] md:w-[50%] lg:w-[35%] '>
      {/* <div className='hidden md:block '>
        <img src='/signin.svg' alt='' className='w-[20%]' />
      </div> */}
      <div className='flex flex-col gap-sm grow'>
        <h1 className='text-3xl font-bold text-teal-400 font-code'>smalltalk</h1>
        <form onSubmit={onFormSubmit} className='flex flex-col gap-sm font-mono text-sm '>
          <h2 className='my-md italic'>Sign In</h2>
          <div className='flex flex-col gap-sm'>
            <label aria-label='email or username'>
              <input
                placeholder='Email or Username'
                value={user.email}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                id='email'
                type='text'
                className='w-full  p-lg rounded-md bg-skin-fill text-skin-base border-2 border-gray-100 outline-none focus:border-teal-400 focus:outline-none transition duration-500'
              />
            </label>
          </div>
          <div className='flex flex-col gap-sm'>
            <label aria-label='Password'>
              <input
                placeholder='Password'
                value={user.password}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                id='password'
                type='password'
                className='w-full  p-lg rounded-md bg-skin-fill text-skin-base border-2 border-gray-100 outline-none focus:border-teal-400 focus:outline-none transition duration-500'
              />
            </label>
          </div>
          <div className='flex justify-end'>
            <button className='border-gray-100 border-2 hover:border-teal-400 outline-none   transition duration-500 block text-skin-base px-xl py-md rounded-md bg-skin-fill ' type='submit'>
              Sign In
            </button>
          </div>
          {
            // error
            error.signIn && (
              <div className='bg-red-200 text-skin-base p-xl rounded-md'>
                <p className='text-red-400'>{error.signIn}</p>
              </div>
            )
          }
          <p className=' '>
            Don't have a
            <strong>
              <i> Smalltalk </i>
            </strong>
            account?
            <br />
            <Link href='/signup' className='underline underline-offset-1 hover:text-teal-400 '>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// 'use client';
// import { useState, useContext } from 'react';
// import { ChatContext } from '@/app/ChatContext';
// import { useRouter } from 'next/navigation';

// type User = {
//   username: string;
//   room: string;
// };

// export default function Home() {
//   // router
//   // state
//   const [user, setUser] = useState<User>({ username: '', room: '' });

//   // contect
//   const { fn } = useContext(ChatContext);
//   const router = useRouter();
//   const onUserLog = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('user: ', user);
//     if (user.username.trim() === '' || user.room.trim() === '') return;

//     fn.setUser(user);

//     // reset user
//     setUser({ username: '', room: '' });

//     // redirect to chat
//     router.push('/chat');
//   };
//   return (
//     <div className='h-screen  flex flex-col items-center justify-center'>
//       <h1>Smalltalk</h1>
//       <form onSubmit={onUserLog} className='mt-5 border p-5 '>
//         <label>
//           User:
//           <input
//             value={user.username}
//             onChange={(e) =>
//               setUser((prev) => ({
//                 ...prev,
//                 username: e.target.value,
//               }))
//             }
//             className='p-2 block border  '
//             type='text'
//           />
//         </label>
//         <br />
//         <label>
//           Room:
//           <input
//             value={user.room}
//             onChange={(e) =>
//               setUser((prev) => ({
//                 ...prev,
//                 room: e.target.value,
//               }))
//             }
//             className='p-2 block border mb-4  '
//             type='text'
//           />
//         </label>
//         <button>Log in</button>
//       </form>
//     </div>
//   );
// }
