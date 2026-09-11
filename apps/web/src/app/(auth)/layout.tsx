import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-coffee-50 flex min-h-screen items-center justify-center p-4">
      <div className="border-coffee-200 w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
