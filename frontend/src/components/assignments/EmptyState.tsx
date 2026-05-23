import React from 'react';
import Link from 'next/link';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-[500px] mx-auto">
      <div className="mb-8">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#F9FAFB" />
          <path d="M45 40H75V80H45V40Z" fill="white" stroke="#E5E7EB" strokeWidth="2" />
          <path d="M52 50H68" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <path d="M52 60H68" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <path d="M52 70H60" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="80" r="20" fill="white" stroke="#E5E7EB" strokeWidth="2" />
          <path d="M75 75L85 85" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
          <path d="M85 75L75 85" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-primary mb-3">No assignments yet</h2>
      <p className="text-secondary text-sm mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      <Link href="/create" className="cta-button px-8">
        + Create Your First Assignment
      </Link>
    </div>
  );
};

export default EmptyState;
