'use client';
import { useState, useContext } from 'react';
import { ChatContext } from '@/app/ChatContext';
import Image from 'next/image';
import Link from 'next/link';

export type User = {
  email: string;
  password: string;
};
export default function SignIn() {
  const [user, setUser] = useState<User>({ email: '', password: '' });

  // consume context

  const { onUserSignIn } = useContext(ChatContext);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.email.trim() === '' || user.password.trim() === '') return;

    onUserSignIn(user);
    // reset form
    setUser({ email: '', password: '' });
  };

  return (
    <div className='h-screen gap-md md:gap-lg flex items-center justify-center w-9/12 mx-auto '>
      <div className='grow hidden md:block '>
        <Image src='/signin.svg' alt='' width={500} height={500} />
      </div>
      <div className='flex flex-col gap-sm grow'>
        <h1 className='text-3xl font-bold text-teal-400'>Smalltalk</h1>
        <form onSubmit={onFormSubmit} className='flex flex-col gap-sm '>
          <h2 className='my-md italic'>Sign In</h2>
          <div className='flex flex-col gap-sm'>
            <label htmlFor='email'>Email</label>
            <input
              value={user.email}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              id='email'
              type='email'
              className='p-lg rounded-md bg-skin-fill border text-skin-base'
            />
          </div>
          <div className='flex flex-col gap-sm'>
            <label htmlFor='password'>Password</label>
            <input
              value={user.password}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              id='password'
              type='password'
              className='p-lg rounded-md bg-skin-fill border text-skin-base'
            />
          </div>
          <div className='flex justify-end'>
            <button className=' block border text-skin-base px-xl py-md rounded-md bg-skin-fill ' type='submit'>
              Sign In
            </button>
          </div>
          <p className=' '>
            Don't have a
            <strong>
              <i> Smalltalk </i>
            </strong>
            account?
            <Link href='/signup' className='underline pl-sm'>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
