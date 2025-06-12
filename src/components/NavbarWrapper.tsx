'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const [nav, setNav] = useState(false);

  const handleClick = () => setNav(!nav);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  return <Navbar nav={nav} handleClick={handleClick} />;
}