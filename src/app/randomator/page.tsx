'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Lazy load komponenty Randomator
const RandomatorComponent = dynamic(() => import('../../Randomator/Randomator'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#e9f0fb] text-gray-800">
      Načítání...
    </div>
  ),
});

export default function RandomatorPage() {
  return (
    <div className="w-full min-h-screen bg-[#e9f0fb] pt-[120px] pb-[60px] text-[#1f2937] font-sans antialiased">
      <div className="max-w-6xl mx-auto px-6">
        <RandomatorComponent />
      </div>
    </div>
  );
}