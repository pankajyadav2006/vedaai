'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  FileText, 
  Wrench, 
  Library, 
  Settings, 
  Plus,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'My Groups', href: '/groups', icon: Users },
  { name: 'Assignments', href: '/assignments', icon: FileText },
  { name: 'AI Teacher\'s Toolkit', href: '/toolkit', icon: Wrench },
  { name: 'My Library', href: '/library', icon: Library },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-[calc(100vh-24px)] m-3 bg-white rounded-2xl shadow-veda p-6 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-veda-gradient flex items-center justify-center">
          <span className="text-white font-bold text-2xl">V</span>
        </div>
        <span className="text-[#1A1A1A] font-bold text-2xl">VedaAI</span>
      </div>

      {/* Create Button */}
      <Link href="/create" className="create-assignment-btn mb-8">
        <Star className="w-5 h-5 fill-current" />
        Create Assignment
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.name === 'AI Teacher\'s Toolkit' && (pathname === '/' || pathname.startsWith('/paper/')));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-full transition-all duration-200",
                isActive ? "bg-activePill text-primary shadow-[0_0_0_2px_rgba(255,107,53,0.3)]" : "text-secondary hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 border-t border-border space-y-4">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-full">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=school" alt="School" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary truncate">Delhi Public School</p>
            <p className="text-xs text-secondary truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
