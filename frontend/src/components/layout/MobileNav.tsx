'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Library, Wrench, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assignments', href: '/assignments', icon: FileText },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'AI Toolkit', href: '/toolkit', icon: Wrench },
  ];

  return (
    <>
      {/* Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-primary flex items-center justify-around px-4 z-50">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1",
                isActive ? "text-white" : "text-gray-400"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* FAB */}
      <Link 
        href="/create"
        className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-vedaOrange rounded-full flex items-center justify-center text-white shadow-lg z-50"
      >
        <Plus className="w-8 h-8" />
      </Link>
    </>
  );
};

export default MobileNav;
