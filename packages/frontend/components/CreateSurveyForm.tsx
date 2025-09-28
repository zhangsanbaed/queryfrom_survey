interface Question {
  id: number;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text';
  options?: string[];
  min?: number;
  max?: number;
}

interface SurveyForm {
  title: string;
  description: string;
  metadataPointer: string;
  questionSchemaPointer: string;
  submitDeadline: number;
  allowIndividualReveal: boolean;
  questions: Question[];
}

interface CreateSurveyFormProps {
  form: SurveyForm;
  onFormChange: (form: SurveyForm) => void;
  onSubmit: (formData?: SurveyForm) => void;
  canInteract: boolean;
  isSubmitting: boolean;
}

export const CreateSurveyForm = ({ form, onFormChange, onSubmit, canInteract, isSubmitting }: CreateSurveyFormProps) => {
  const updateForm = (updates: Partial<SurveyForm>) => {
    onFormChange({ ...form, ...updates });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      type: 'scale',
      min: 1,
      max: 10
    };
    updateForm({ questions: [...form.questions, newQuestion] });
  };

  const updateQuestion = (questionId: number, updates: Partial<Question>) => {
    const updatedQuestions = form.questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    updateForm({ questions: updatedQuestions });
  };

  const removeQuestion = (questionId: number) => {
    const updatedQuestions = form.questions.filter(q => q.id !== questionId);
    updateForm({ questions: updatedQuestions });
  };

  const generateQuestionSchema = () => {
    if (form.questions.length === 0) {
      return "QmEmptyQuestions123456789abcdef"; // Default empty schema
    }
    
    const schema = {
      version: "1.0",
      questions: form.questions.map((q, index) => ({
        id: index,
        text: q.text,
        type: q.type,
        ...(q.type === 'scale' && { min: q.min, max: q.max }),
        ...(q.type === 'multiple_choice' && { options: q.options || [] })
      }))
    };
    
    // For demo purposes, we'll generate a mock IPFS hash
    // In production, this would be uploaded to IPFS
    const schemaString = JSON.stringify(schema);
    
    // Use a more robust method to generate hash that works with Unicode
    const encoder = new TextEncoder();
    const data = encoder.encode(schemaString);
    let hash = "Qm";
    
    // Simple hash generation using the string content
    for (let i = 0; i < Math.min(data.length, 44); i++) {
      const char = String.fromCharCode(97 + (data[i] % 26)); // a-z
      hash += char;
    }
    
    // Pad with numbers if needed
    while (hash.length < 46) {
      hash += Math.floor(Math.random() * 10);
    }
    
    // Add timestamp to make the hash more unique
    const timestampStr = Date.now().toString(36);
    hash = hash.slice(0, 40) + timestampStr.slice(-6);
    
    // Store the questions in localStorage for demo purposes
    // In production, this would be uploaded to IPFS
    const storageKey = `survey_questions_${hash}`;
    localStorage.setItem(storageKey, schemaString);
    
    // Also store with a timestamp-based key for easier debugging
    const timestamp = Date.now();
    const timestampKey = `survey_questions_${timestamp}_${hash.slice(-8)}`;
    localStorage.setItem(timestampKey, schemaString);
    
    console.log('Stored questions to localStorage:');
    console.log('Primary Key:', storageKey);
    console.log('Timestamp Key:', timestampKey);
    console.log('Data:', schemaString);
    console.log('Generated hash:', hash);
    
    return hash;
  };

  return (
    <div className="group relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Survey</h2>
              <p className="text-gray-600">Design a new privacy-preserving health survey</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Survey Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter a compelling survey title"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
              placeholder="Describe the purpose and scope of your survey"
            />
          </div>
          
          {/* Technical Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Metadata Pointer
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.metadataPointer}
                  onChange={(e) => updateForm({ metadataPointer: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="QmTest123456789abcdef"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Schema Pointer
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.questionSchemaPointer}
                  onChange={(e) => updateForm({ questionSchemaPointer: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="QmTest987654321fedcba"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deadline */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Submission Deadline
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={new Date(form.submitDeadline * 1000).toISOString().slice(0, 16)}
                onChange={(e) => updateForm({ submitDeadline: Math.floor(new Date(e.target.value).getTime() / 1000) })}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Individual Reveal Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Allow Individual Reveal</p>
                <p className="text-sm text-gray-500">Enable participants to reveal their individual responses</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.allowIndividualReveal}
                onChange={(e) => updateForm({ allowIndividualReveal: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          
          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Survey Questions</h3>
              <button
                onClick={addQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Question</span>
              </button>
            </div>
            
            {form.questions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 mb-2">No questions added yet</p>
                <p className="text-sm text-gray-400">Click &quot;Add Question&quot; to start building your survey</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">Q{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your question here..."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, { type: e.target.value as Question['type'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="scale">Scale (1-10)</option>
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="text">Text Input</option>
                        </select>
                      </div>
                      
                      {question.type === 'scale' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
                            <input
                              type="number"
                              value={question.min || 1}
                              onChange={(e) => updateQuestion(question.id, { min: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
                            <input
                              type="number"
                              value={question.max || 10}
                              onChange={(e) => updateQuestion(question.id, { max: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              min="2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            onClick={async () => {
              // Update questionSchemaPointer before submitting
              const schemaHash = generateQuestionSchema();
              console.log('Generated schema hash:', schemaHash);
              
              // Create the updated form with the new schema hash
              const updatedForm = { ...form, questionSchemaPointer: schemaHash };
              console.log('Updated form with schema hash:', updatedForm);
              console.log('Generated schema hash for survey:', schemaHash);
              
              // Update the form state
              updateForm({ questionSchemaPointer: schemaHash });
              
              // Call onSubmit with the updated form data
              onSubmit(updatedForm);
            }}
            disabled={!canInteract || isSubmitting || form.questions.length === 0}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-3">
              {isSubmitting ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
              <span>{isSubmitting ? 'Creating Survey...' : 'Create Survey'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};