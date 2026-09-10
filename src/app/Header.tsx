import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import logo from '../../public/logo.png'; 
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/">
        <Image
          src={logo}
          alt="School Logo"
          height={100}
          width={100}
          className="rounded-lg bg-transparent"
        />
      </Link>
      
      <nav className="flex gap-6 items-center">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About Us</Link>
        <Link href="/achievement" className="hover:underline">Achievement</Link>
        <Link href="/contact" className="hover:underline">Contact Us</Link>
        <Link href="/auth/login">
          <Button variant="outline">Login</Button>
        </Link>
      </nav>
    </header>
  );
}