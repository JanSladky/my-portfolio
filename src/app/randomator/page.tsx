'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// ❗️Cesta z `src/app/randomator/` k `src/Randomator/Randomator.js`
const RandomatorComponent = dynamic(() => import('../../Randomator/Randomator'), {
  ssr: false,
  loading: () => <div className="w-full min-h-screen flex items-center justify-center bg-[#0a192f] text-white">Načítání...</div>,
});

export default function RandomatorPage() {
  return (
    <div className="min-h-screen bg-[#0a192f]">
      <RandomatorComponent />
    </div>
  );
}
