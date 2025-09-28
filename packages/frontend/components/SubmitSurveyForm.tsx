import React, { useMemo } from 'react';

interface Question {
  id: number;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text';
  options?: string[];
  min?: number;
  max?: number;
}

interface Survey {
  id: number;
  title: string;
  description: string;
  creator: string;
  metadataPointer: string;
  questionSchemaPointer: string;
  submitDeadline: number;
  allowIndividualReveal: boolean;
  isActive: boolean;
  totalSubmissions: number;
}

interface SubmissionForm {
  surveyId: number;
  answers: number[];
  commitment: string;
  ciphertextStoragePointer: string;
}

interface SubmitSurveyFormProps {
  form: SubmissionForm;
  onFormChange: (form: SubmissionForm) => void;
  surveys: Survey[];
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
}

export const SubmitSurveyForm = ({ form, onFormChange, surveys, onSubmit, canSubmit, isSubmitting }: SubmitSurveyFormProps) => {
  const updateForm = (updates: Partial<SubmissionForm>) => {
    console.log('Updating submission form:', updates);
    onFormChange({ ...form, ...updates });
  };

  // Get selected survey
  const selectedSurvey = surveys.find(s => s.id === form.surveyId);
  
  // Parse question schema from the stored hash - memoized to prevent infinite loops
  const questions = useMemo(() => {
    if (!selectedSurvey) {
      console.log('No selected survey, returning empty questions');
      return [];
    }

    const schemaPointer = selectedSurvey.questionSchemaPointer;
    console.log('Parsing schema for pointer:', schemaPointer);
    console.log('Survey ID:', selectedSurvey.id);
    
    // In a real implementation, this would fetch from IPFS
    // For demo, we'll try to decode the mock hash we generated
    if (schemaPointer.includes('EmptyQuestions')) {
      console.log('Empty questions schema detected');
      return [];
    }
    
    // For demo purposes, we'll store the actual questions in localStorage
    // In production, this would be fetched from IPFS using the schemaPointer
    const storageKey = `survey_questions_${schemaPointer}`;
    console.log('Looking for questions in localStorage with key:', storageKey);
    
    const storedQuestions = localStorage.getItem(storageKey);
    console.log('Stored questions data:', storedQuestions);
    
    if (storedQuestions) {
      try {
        const parsed = JSON.parse(storedQuestions);
        console.log('Parsed questions:', parsed);
        return parsed.questions || [];
      } catch (e) {
        console.error('Failed to parse stored questions:', e);
      }
    }
    
    // If no questions found with the exact schema pointer, return empty array
    // This prevents showing wrong questions for surveys
    console.log('No questions found with schema pointer:', schemaPointer);
    const allQuestionKeys = Object.keys(localStorage).filter(key => key.startsWith('survey_questions_'));
    console.log('Available localStorage keys:', allQuestionKeys);
    
    // Only show a warning about available questions for debugging
    if (allQuestionKeys.length > 0) {
      console.warn(`Schema pointer "${schemaPointer}" not found. Available question keys:`, allQuestionKeys.map(key => key.replace('survey_questions_', '')));
    }
    
    return [];
  }, [selectedSurvey]);
  
  // Debug logging
  console.log('=== SubmitSurveyForm Debug ===');
  console.log('Selected survey:', selectedSurvey);
  console.log('Schema pointer:', selectedSurvey?.questionSchemaPointer);
  console.log('Parsed questions:', questions);
  console.log('Questions length:', questions.length);
  console.log('All localStorage keys:', Object.keys(localStorage).filter(key => key.startsWith('survey_questions_')));
  console.log('=== End Debug ===');

  return (
    <div className="group relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Submit Survey</h2>
              <p className="text-gray-600">Participate in privacy-preserving surveys</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Survey Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select Survey
            </label>
            <div className="relative">
              <select
                value={form.surveyId}
                onChange={(e) => updateForm({ surveyId: parseInt(e.target.value) })}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
              >
                {surveys.map(survey => (
                  <option key={survey.id} value={survey.id}>
                    {survey.id}: {survey.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Answers Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Survey Answers
            </label>
            {questions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 mb-2">No questions found</p>
                <p className="text-sm text-gray-400">This survey doesn&apos;t have any questions defined or the schema pointer is invalid</p>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800 mb-2">
                    <strong>Schema Pointer:</strong> {selectedSurvey?.questionSchemaPointer}
                  </p>
                  <p className="text-xs text-yellow-700 mb-2">
                    <strong>Expected localStorage key:</strong> survey_questions_{selectedSurvey?.questionSchemaPointer}
                  </p>
                  <p className="text-xs text-yellow-700 mb-2">
                    <strong>Survey ID:</strong> {selectedSurvey?.id}
                  </p>
                  <p className="text-xs text-yellow-700 mb-2">
                    <strong>Current Questions Count:</strong> {questions.length}
                  </p>
                  <p className="text-xs text-yellow-700 mb-2">Available questions in localStorage:</p>
                  <div className="text-xs text-yellow-600 mt-1 max-h-20 overflow-y-auto">
                    {Object.keys(localStorage)
                      .filter(key => key.startsWith('survey_questions_'))
                      .map(key => (
                        <div key={key} className="truncate">
                          {key.replace('survey_questions_', '')}
                        </div>
                      ))}
                  </div>
                  {Object.keys(localStorage).filter(key => key.startsWith('survey_questions_')).length === 0 && (
                    <p className="text-xs text-yellow-600 mt-2">
                      No survey questions found in localStorage. Please create a survey first.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {questions.map((question: Question, index: number) => (
                  <div key={question.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">Q{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {question.text}
                      </label>
                      {question.type === 'scale' ? (
                        <div className="space-y-2">
                          <input
                            type="number"
                            min={question.min || 1}
                            max={question.max || 10}
                            value={form.answers[index] || 0}
                            onChange={(e) => {
                              const newAnswers = [...form.answers];
                              newAnswers[index] = parseInt(e.target.value) || 0;
                              updateForm({ answers: newAnswers });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder={`Rate ${question.min || 1}-${question.max || 10}`}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{question.min || 1}</span>
                            <span>{question.max || 10}</span>
                          </div>
                        </div>
                      ) : question.type === 'multiple_choice' ? (
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optionIndex}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your answer..."
                          rows={3}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Technical Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Commitment Hash
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.commitment}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^0x[0-9a-fA-F]*$/.test(value)) {
                      updateForm({ commitment: value });
                    }
                  }}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm font-mono"
                  placeholder="0x1111111111111111111111111111111111111111111111111111111111111111"
                  maxLength={66}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Storage Pointer
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.ciphertextStoragePointer}
                  onChange={(e) => updateForm({ ciphertextStoragePointer: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="ipfs://test123"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Privacy Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Privacy Protected</p>
                <p className="text-xs text-blue-700 mt-1">Your responses are encrypted and cannot be traced back to you</p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-3">
              {isSubmitting ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Survey'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};