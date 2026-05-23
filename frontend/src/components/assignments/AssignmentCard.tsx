'use client';

import React, { useState } from 'react';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface AssignmentCardProps {
  id: string;
  title: string;
  assignedOn: string;
  dueOn: string;
  onDelete: (id: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ id, title, assignedOn, dueOn, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="card relative flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-base text-primary line-clamp-2 pr-6">{title}</h3>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-secondary" />
        </button>

        {showMenu && (
          <div className="absolute top-12 right-6 bg-white shadow-lg rounded-xl border border-border py-2 z-20 min-w-[160px]">
            <Link 
              href={`/paper/${id}`}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-primary transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Assignment
            </Link>
            <button 
              onClick={() => {
                onDelete(id);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-[13px] text-secondary">
        <span>Assigned on : {formatDate(assignedOn)}</span>
        <span className="hidden sm:inline text-gray-300">|</span>
        <span>Due : {formatDate(dueOn)}</span>
      </div>
    </div>
  );
};

export default AssignmentCard;
