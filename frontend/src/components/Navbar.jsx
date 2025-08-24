import { FaBars, FaTimes, FaGithub, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import SocialSidebar from '../components/SocialSidebar';

const Navbar = ({ nav, handleClick }) => {
  return (
    <div className="fixed w-full h-[80px] flex justify-between items-center px-4 bg-white text-gray-800 shadow-md z-[60]">
      <div>
        <Link href="/">
          <Image src="/logo-dark.png" alt="JS Weby logo" width={120} height={40} />
        </Link>
      </div>

      {/* Navigace */}
      <ul className="hidden lg:flex">
        {[
          { href: '/', label: 'Domů' },
          { href: '/about', label: 'O mně' },
          { href: '/developer', label: 'Developer' },
          { href: '/work', label: 'Reference' },
          { href: '/contact', label: 'Kontakt' },
        ].map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="m-4 hover:text-blue-500 transition">
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Hamburger menu */}
      <div onClick={handleClick} className="lg:hidden z-[60] cursor-pointer text-gray-800">
        {!nav ? <FaBars size={30} /> : <FaTimes size={30} />}
      </div>

      {/* Mobilní menu */}
      <ul className={`${!nav ? 'hidden' : 'flex'} absolute top-0 left-0 w-full h-screen bg-white flex-col justify-center items-center`}>
        {[
          { href: '/', label: 'Domů' },
          { href: '/about', label: 'O mně' },
          { href: '/developer', label: 'Developer' },
          { href: '/work', label: 'Reference' },
          { href: '/contact', label: 'Kontakt' },
        ].map(({ href, label }) => (
          <li key={href} className="py-6 text-3xl">
            <Link href={href} onClick={handleClick} className="block text-blue-600 hover:text-blue-800 transition">
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <SocialSidebar />
    </div>
  );
};

export default Navbar;
