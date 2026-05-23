'use client';

import React, { useState, useEffect } from 'react';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import EmptyState from '@/components/assignments/EmptyState';
import api from '@/lib/api';
import { Search, Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { Assignment } from '@/lib/types';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(assignments.filter((a) => a._id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const filteredAssignments = assignments.filter((a) => 
    a.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {assignments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <h1 className="text-3xl font-bold text-primary">Assignments</h1>
            </div>
            <p className="text-secondary">Manage and create assignments for your classes.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between">
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-white text-sm font-medium hover:bg-gray-50 transition-colors w-fit">
              <Filter className="w-4 h-4" />
              ⊟ Filter By
            </button>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input 
                type="text"
                placeholder="Search Assignment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id}
                id={assignment._id}
                title={`${assignment.subject} - Grade ${assignment.grade}`}
                assignedOn={assignment.createdAt}
                dueOn={assignment.dueDate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Sticky Bottom Button */}
          <div className="fixed bottom-24 lg:bottom-12 left-1/2 lg:left-[calc(50%+140px)] -translate-x-1/2 z-30">
            <Link href="/create" className="cta-button shadow-lg px-8 whitespace-nowrap">
              + Create Assignment
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentsPage;
