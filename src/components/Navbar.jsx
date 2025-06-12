import { FaBars, FaTimes, FaGitlab, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = ({ nav, handleClick }) => {
  return (
    <div className="fixed w-full h-[80px] flex justify-between items-center px-4 bg-[#0a192f] text-gray-300 z-60 z-[60]">
      <div>
        <Link href="/">
          <Image src="/logo.png" alt="JS Weby logo" width={120} height={40} />
          
        </Link>
      </div>

      {/* Navigace */}
      <ul className="hidden lg:flex">
        <li>
          <Link href="/" className="hover:text-pink-600 m-4">
            Domů
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-pink-600 m-4">
            O mně
          </Link>
        </li>
        <li>
          <Link href="/cv" className="hover:text-pink-600 m-4">
            Životopis
          </Link>
        </li>
        <li>
          <Link href="/skills" className="hover:text-pink-600 m-4">
            Skills
          </Link>
        </li>
        <li>
          <Link href="/work" className="hover:text-pink-600 m-4">
            Projekty
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-pink-600 m-4">
            Kontakt
          </Link>
        </li>
      </ul>

      {/* Hamburger menu pro mobilní zobrazení */}
      <div onClick={handleClick} className="lg:hidden z-60 z-[60] cursor-pointer">
        {!nav ? <FaBars size={40} /> : <FaTimes size={40} />}
      </div>

      {/* Mobilní menu */}
      <ul className={!nav ? 'hidden' : 'absolute top-0 left-0 w-full h-screen py-[100px] bg-[#0a192f] flex flex-col justify-center items-center'}>
        <li className="py-6 text-3xl">
          <Link onClick={handleClick} href="/" className="block py-2 text-pink-600">
            Domů
          </Link>
        </li>
        <li className="py-6 text-3xl">
          <Link onClick={handleClick} href="/about" className="block py-2 text-pink-600">
            O mně
          </Link>
        </li>
        <li className="py-6 text-3xl">
          <Link onClick={handleClick} href="/cv" className="block py-2 text-pink-600">
            Životopis
          </Link>
        </li>
        <li className="py-6 text-3xl">
          <Link onClick={handleClick} href="/skills" offset={-130} className="block py-2 text-pink-600">
            Skills
          </Link>
        </li>
        <li className="py-6 text-3xl">
          <Link onClick={handleClick} href="/work" className="block py-2 text-pink-600">
            Projekty
          </Link>
        </li>
        <li className="py-6 text-3xl">
          <Link onClick={handleClick} href="/contact" className="block py-2 text-pink-600">
            Kontakt
          </Link>
        </li>
      </ul>

      {/* Ikony pro sociální sítě */}
      <div className="hidden xl:flex fixed flex-col top-[35%] left-0">
        <ul>
          <li className="w-[160px] h-[60px] px-[15px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] hover-ml-[-10px] duration-300 bg-blue-600">
            <a className="flex justify-between items-center w-full text-gray-300" href="https://www.linkedin.com/in/jan-sladk%C3%BD/">
              LinkedIn <FaLinkedin size={30} />
            </a>
          </li>
          <li className="w-[160px] h-[60px] px-[15px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] hover-ml-[-10px] duration-300 bg-[#E2432A]">
            <a className="flex justify-between items-center w-full text-gray-300" href="https://gitlab.com/sladky.honza">
              Gitlab <FaGitlab size={30} />
            </a>
          </li>
          <li className="w-[160px] h-[60px] px-[15px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] hover-ml-[-10px] duration-300 bg-[#6fc2b0]">
            <Link className="flex justify-between items-center w-full text-gray-300" href="/contact">
              Kontakt <HiOutlineMail size={30} />
            </Link>
          </li>
          <li className="w-[160px] h-[60px] px-[15px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] hover-ml-[-10px] duration-300 bg-[#565f69]">
            <Link className="flex justify-between items-center w-full text-gray-300" href="/cv">
              Životopis <BsFillPersonLinesFill size={30} />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
