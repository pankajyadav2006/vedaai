'use client';

import React, { useState } from 'react';
import { useAssignmentStore } from '@/stores/assignmentStore';
import { useJobStore } from '@/stores/jobStore';
import FileUpload from '@/components/create/FileUpload';
import QuestionTypeRow from '@/components/create/QuestionTypeRow';
import ProgressModal from '@/components/create/ProgressModal';
import api from '@/lib/api';
import { PlusCircle, Mic, ArrowLeft, ArrowRight } from 'lucide-react';
import PillButton from '@/components/ui/PillButton';

const CreateAssignmentPage = () => {
  const { 
    currentStep, 
    formData, 
    setStep, 
    updateFormData, 
    addQuestionType, 
    resetForm 
  } = useAssignmentStore();
  
  const { setJob } = useJobStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    else if (new Date(formData.dueDate) <= new Date()) newErrors.dueDate = 'Must be a future date';
    
    if (formData.questionTypes.length === 0) newErrors.types = 'At least one question type is required';
    
    formData.questionTypes.forEach((q, i) => {
      if (!q.type) newErrors[`type-${i}`] = 'Type name cannot be empty';
      if (q.count < 1 || q.count > 50) newErrors[`count-${i}`] = 'Count must be between 1 and 50';
      if (q.marksEach < 1 || q.marksEach > 20) newErrors[`marks-${i}`] = 'Marks must be between 1 and 20';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;

    try {
      // Mock subject/grade for now as they aren't in the form UI but in the schema
      // In a real app, these would be fields in the form
      const payload = {
        subject: 'Science', // Default or from file analysis
        grade: '8',       // Default or from file analysis
        dueDate: formData.dueDate,
        questionTypes: formData.questionTypes.map(({ type, count, marksEach }) => ({ type, count, marksEach })),
        additionalInfo: formData.additionalInfo,
        fileContent: 'Mock content from uploaded file' // In reality, process the file
      };

      const response = await api.post('/assignments', payload);
      setJob(response.data.jobId);
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      alert(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  const totalQuestions = formData.questionTypes.reduce((acc, q) => acc + q.count, 0);
  const totalMarks = formData.questionTypes.reduce((acc, q) => acc + (q.count * q.marksEach), 0);

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressModal />
      
      {/* Progress Bar */}
      <div className="sticky top-[60px] -mx-6 lg:-mx-8 h-1 bg-gray-200 z-20 -mt-6 lg:-mt-8 mb-8 overflow-hidden">
        <div 
          className="h-full bg-veda-gradient transition-all duration-500"
          style={{ width: `${(currentStep / 2) * 100}%` }}
        ></div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <h1 className="text-3xl font-bold text-primary">Create Assignment</h1>
        </div>
        <p className="text-secondary">Set up a new assignment for your students</p>
      </div>

      <div className="card !p-8 space-y-10">
        {/* Section: Assignment Details */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primary">Assignment Details</h2>
            <p className="text-sm text-secondary">Basic information about your assignment</p>
          </div>

          <FileUpload />

          <div className="mt-8">
            <label className="block text-sm font-bold text-primary mb-2">Due Date</label>
            <div className="relative">
              <input 
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateFormData({ dueDate: e.target.value })}
                className={`w-full p-3 bg-white border ${errors.dueDate ? 'border-red-500' : 'border-border'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all`}
                placeholder="DD-MM-YYYY"
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>
          </div>
        </section>

        {/* Section: Question Types */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="grid grid-cols-3 gap-4 w-full text-xs font-bold text-secondary uppercase tracking-wider px-4">
              <span>Question Type</span>
              <span className="text-center">No. of Questions</span>
              <span className="text-right">Marks</span>
            </div>
          </div>

          <div className="space-y-3">
            {formData.questionTypes.map((row) => (
              <QuestionTypeRow key={row.id} row={row} />
            ))}
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button 
              onClick={addQuestionType}
              className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors text-sm"
            >
              <PlusCircle className="w-5 h-5" />
              + Add Question Type
            </button>
            
            <div className="flex items-center gap-6 text-sm font-bold text-primary bg-gray-50 px-6 py-3 rounded-xl border border-border">
              <span className="flex items-center gap-2">
                Total Questions : <span className="text-lg">{totalQuestions}</span>
              </span>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="flex items-center gap-2">
                Total Marks : <span className="text-lg">{totalMarks}</span>
              </span>
            </div>
          </div>
        </section>

        {/* Section: Additional Info */}
        <section>
          <label className="block text-sm font-bold text-primary mb-2">
            Additional Information (For better output)
          </label>
          <div className="relative">
            <textarea 
              value={formData.additionalInfo}
              onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
              className="w-full p-4 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all min-h-[120px] resize-none"
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
            />
            <button className="absolute bottom-4 right-4 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Mic className="w-5 h-5 text-secondary" />
            </button>
          </div>
        </section>
      </div>

      {/* Navigation Row */}
      <div className="flex justify-between items-center mt-10 mb-20">
        <PillButton 
          variant="outline"
          onClick={() => setStep(Math.max(1, currentStep - 1))}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Previous
        </PillButton>
        <PillButton 
          onClick={handleGenerate}
          icon={<ArrowRight className="w-5 h-5" />}
          className="px-10"
        >
          Generate
        </PillButton>
      </div>
    </div>
  );
};

export default CreateAssignmentPage;
