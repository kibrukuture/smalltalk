'use client';
import React from 'react';
import Link from 'next/link';
export default function About() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <nav>
        <ul className='flex  items-center'>
          <li className='mr-6'>
            <Link href='/'>Home</Link>
          </li>
          <li className='mr-6'>
            <Link href='/about'>About</Link>
          </li>
          <li className='mr-6'>
            <Link href='/about/spec'>Spec</Link>
          </li>
        </ul>
      </nav>
      about
    </div>
  );
}
