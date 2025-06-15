'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-4">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-center gap-4 text-xs text-gray-500">
          {/* Copyright */}
          <span>© {currentYear} Recco. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}