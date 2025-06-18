'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BsFillPersonLinesFill } from 'react-icons/bs';

type Variant = 'sidebar' | 'inline';

interface Props {
  variant?: Variant;
}

export default function SocialSidebar({ variant = 'sidebar' }: Props) {
  const items = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jan-sladk%C3%BD/',
      icon: <FaLinkedin className="text-blue-600" size={24} />,
      bg: 'bg-blue-100',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/JanSladky?tab=repositories',
      icon: <FaGithub className="text-[#E2432A]" size={24} />,
      bg: 'bg-red-100',
    },
    {
      label: 'Kontakt',
      href: '/contact',
      icon: <HiOutlineMail className="text-teal-600" size={24} />,
      bg: 'bg-teal-100',
    },
    {
      label: 'Životopis',
      href: '/cv',
      icon: <BsFillPersonLinesFill className="text-gray-600" size={24} />,
      bg: 'bg-gray-100',
    },
  ];

  if (variant === 'inline') {
    return (
      <div className="flex justify-center gap-4 flex-wrap py-4">
        {items.map(({ href, icon, label }, i) => (
          <Link
            key={i}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="bg-white border border-gray-200 rounded-full p-3 shadow hover:shadow-md transition"
          >
            {icon}
          </Link>
        ))}
      </div>
    );
  }

  // Sidebar ouška
  return (
    <div className="hidden xl:flex fixed flex-col top-[35%] left-0 z-50">
      <ul>
        {items.map(({ label, href, icon, bg }, i) => (
          <li
            key={i}
            className={`group w-[180px] h-[60px] pl-4 pr-2 flex justify-between items-center ml-[-150px] hover:ml-[-10px] duration-300 ${bg} rounded-r-2xl shadow-md hover:scale-105 transition-transform`}
          >
            {href.startsWith('http') ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center w-full text-gray-800 font-medium"
              >
                {label} {icon}
              </a>
            ) : (
              <Link
                href={href}
                className="flex justify-between items-center w-full text-gray-800 font-medium"
              >
                {label} {icon}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}