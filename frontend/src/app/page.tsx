'use client';

import React from 'react';
import PaperHeader from '@/components/paper/PaperHeader';
import QuestionSection from '@/components/paper/QuestionSection';
import AnswerKey from '@/components/paper/AnswerKey';
import { Download } from 'lucide-react';
import PillButton from '@/components/ui/PillButton';

// Mock data to match the screenshot exactly
const mockHomePaper = {
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  subject: "English",
  grade: "5",
  timeAllowed: "45 minutes",
  totalMarks: 20,
  sections: [
    {
      title: "Section A",
      questionType: "Short Answer Questions",
      instruction: "Attempt all questions. Each question carries 2 marks",
      questions: [
        { number: 1, difficulty: 'Easy', text: "Define electroplating. Explain its purpose.", marks: 2 },
        { number: 2, difficulty: 'Moderate', text: "What is the role of a conductor in the process of electrolysis?", marks: 2 },
        { number: 3, difficulty: 'Easy', text: "Why does a solution of copper sulfate conduct electricity?", marks: 2 },
        { number: 4, difficulty: 'Moderate', text: "Describe one example of the chemical effect of electric current in daily life.", marks: 2 },
        { number: 5, difficulty: 'Moderate', text: "Explain why electric current is said to have chemical effects.", marks: 2 },
        { number: 6, difficulty: 'Challenging', text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.", marks: 2 },
        { number: 7, difficulty: 'Challenging', text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.", marks: 2 },
        { number: 8, difficulty: 'Easy', text: "Mention the type of current used in electroplating and justify why it is used.", marks: 2 },
        { number: 9, difficulty: 'Moderate', text: "What is the importance of electric current in the field of metallurgy?", marks: 2 },
        { number: 10, difficulty: 'Challenging', text: "Explain with a chemical equation how copper is deposited during the electroplating of an object.", marks: 2 },
      ]
    }
  ],
  answerKey: [
    { number: 1, answer: "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness." },
    { number: 2, answer: "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes." },
    { number: 3, answer: "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity." },
    { number: 4, answer: "An example is the electroplating of silver on jewelry to prevent tarnishing." },
    { number: 5, answer: "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects." },
    { number: 6, answer: "Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons: 2H2O + 2e- -> H2 + 2OH-. Na+ + OH- -> NaOH (in solution)" },
    { number: 7, answer: "At the cathode: water is reduced to hydrogen gas and hydroxide ions. At the anode: water is oxidized to oxygen gas and hydrogen ions." },
  ]
};

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Dark Banner */}
      <div className="bg-primary rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex-1">
          <p className="text-white font-bold text-lg leading-relaxed">
            Certainly, Lakshya! Here are customized <span className="underline underline-offset-4 decoration-white/30">Question Paper</span> for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-2.5 border-2 border-white rounded-full text-white font-bold hover:bg-white/10 transition-all whitespace-nowrap text-sm"
        >
          <Download className="w-4 h-4" />
          Download as PDF
        </button>
      </div>

      {/* Paper Card */}
      <div className="bg-white rounded-2xl p-12 md:p-20 shadow-veda max-w-[860px] mx-auto min-h-[1100px]">
        <PaperHeader 
          schoolName={mockHomePaper.schoolName}
          subject={mockHomePaper.subject}
          grade={mockHomePaper.grade}
          timeAllowed={mockHomePaper.timeAllowed}
          totalMarks={mockHomePaper.totalMarks}
        />

        {mockHomePaper.sections.map((section, index) => (
          <QuestionSection 
            key={index}
            sectionTitle={section.title}
            questionType={section.questionType}
            instruction={section.instruction}
            questions={section.questions as any}
          />
        ))}

        <div className="mt-12 text-left">
          <p className="font-bold text-primary">End of Question Paper</p>
        </div>

        <AnswerKey answers={mockHomePaper.answerKey} />
      </div>
    </div>
  );
}
