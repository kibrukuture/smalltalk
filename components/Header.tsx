'use client';
import { useState } from 'react';
import Link from 'next/link';
const blogs = [
  {
    id: 1,
    title: 'blog 1',
    body: 'blog 1 body',
  },
  {
    id: 2,
    title: 'blog 2',
    body: 'blog 2 body',
  },
];
export default function Header() {
  const [count, setCount] = useState(1);

  return (
    <div className=''>
      {/* tolbel Inc. desc */}
      <ul className='flex  items-center'>
        {blogs.map((blog) => (
          <li key={blog.id} className='mr-6'>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
      <button onClick={() => setCount((prev) => prev + 1)}> {count} Count </button>
      {jsx()}
    </div>
  );
}
const jsx = () => (
  <div>
    <h1>Spec Layout</h1>
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
  </div>
);
