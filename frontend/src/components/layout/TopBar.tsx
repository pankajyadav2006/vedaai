'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown, Star } from 'lucide-react';

const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Simple breadcrumb logic
  const getPageInfo = () => {
    if (pathname === '/assignments') return { name: 'Assignments', icon: null };
    if (pathname === '/create') return { name: 'Create Assignment', icon: null };
    if (pathname.startsWith('/paper/') || pathname === '/') return { name: 'Create New', icon: <Star className="w-4 h-4 text-primary" /> };
    return { name: 'Dashboard', icon: null };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div className="flex items-center gap-2">
          {pageInfo.icon}
          <span className="font-bold text-primary">{pageInfo.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-primary" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm text-primary">John Doe</span>
            <ChevronDown className="w-4 h-4 text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
