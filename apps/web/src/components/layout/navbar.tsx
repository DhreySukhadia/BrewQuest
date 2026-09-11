import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <Link href="/" className="text-coffee-800 text-xl font-bold">
        BrewQuest
      </Link>
      <div className="flex gap-4 text-sm font-medium text-gray-600">
        <Link href="/recommendations">Recommendations</Link>
        <Link href="/coffees">Coffees</Link>
        <Link href="/history">History</Link>
      </div>
    </nav>
  );
}
