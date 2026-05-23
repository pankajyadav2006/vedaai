'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePaperStore } from '@/stores/paperStore';
import { GeneratedPaper } from '@/lib/types';
import api from '@/lib/api';
import PaperHeader from '@/components/paper/PaperHeader';
import QuestionSection from '@/components/paper/QuestionSection';
import AnswerKey from '@/components/paper/AnswerKey';
import { Download, Star } from 'lucide-react';
import Link from 'next/link';

const PaperPage = () => {
  const { id } = useParams();
  const { papers, setPaper } = usePaperStore();
  const [loading, setLoading] = useState(true);
  const paper = papers[id as string];

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await api.get(`/papers/${id}`);
        setPaper(id as string, response.data);
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!paper) {
      fetchPaper();
    } else {
      setLoading(false);
    }
  }, [id, paper, setPaper]);

  const handleDownload = () => {
    if (!paper?.pdfUrl) return;
    const link = document.createElement('a');
    link.href = paper.pdfUrl;
    link.download = `Question_Paper_${paper.subject}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-primary mb-4">Paper not found</h2>
        <Link href="/assignments" className="cta-button inline-flex">Go back to Assignments</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Dark Banner */}
      <div className="bg-[#1A1A1A] rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex-1">
          <p className="text-white font-bold text-lg leading-relaxed">
            Certainly, John Doe! Here are customized Question Paper for your CBSE Grade {paper.grade} {paper.subject} classes on the NCERT chapters:
          </p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-8 py-3 border-2 border-white rounded-full text-white font-bold hover:bg-white/10 transition-all whitespace-nowrap"
        >
          <Download className="w-5 h-5" />
          Download as PDF
        </button>
      </div>

      {/* Paper Card */}
      <div className="bg-white rounded-2xl p-12 md:p-20 shadow-veda max-w-[860px] mx-auto min-h-[1100px]">
        <PaperHeader 
          schoolName={paper.schoolName}
          subject={paper.subject}
          grade={paper.grade}
          timeAllowed={paper.timeAllowed}
          totalMarks={paper.totalMarks}
        />

        {paper.sections.map((section, index) => (
          <QuestionSection 
            key={index}
            sectionTitle={section.title}
            questionType={section.questionType}
            instruction={section.instruction}
            questions={section.questions}
          />
        ))}

        <div className="mt-12 text-left">
          <p className="font-bold text-primary">End of Question Paper</p>
        </div>

        <AnswerKey answers={paper.answerKey} />
      </div>
    </div>
  );
};

export default PaperPage;
