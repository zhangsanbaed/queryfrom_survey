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

interface SurveyListProps {
  surveys: Survey[];
  onLoadAggregates: (surveyId: number) => void;
  onClearAggregates: () => void;
  selectedSurveyId: number | null;
}

export const SurveyList = ({ surveys, onLoadAggregates, onClearAggregates, selectedSurveyId }: SurveyListProps) => {
  return (
    <div className="group relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Surveys</h2>
              <p className="text-gray-600">Browse and manage survey data</p>
            </div>
          </div>
        </div>
        
        {/* Survey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map(survey => (
            <div key={survey.id} className={`group/survey relative overflow-hidden backdrop-blur-sm rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
              selectedSurveyId === survey.id 
                ? 'bg-blue-50/80 border-blue-300 shadow-lg' 
                : 'bg-white/80 border-gray-200'
            }`}>
              {/* Survey Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ID: {survey.id}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      survey.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {survey.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{survey.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{survey.description}</p>
                </div>
              </div>
              
              {/* Survey Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{survey.totalSubmissions}</div>
                  <div className="text-xs text-gray-500">Submissions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(survey.submitDeadline * 1000).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">Deadline</div>
                </div>
              </div>
              
              {/* Survey Features */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Individual Reveal:</span>
                  <span className={`font-medium ${survey.allowIndividualReveal ? 'text-green-600' : 'text-gray-400'}`}>
                    {survey.allowIndividualReveal ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Creator:</span>
                  <span className="font-mono text-xs text-gray-600">
                    {survey.creator.slice(0, 6)}...{survey.creator.slice(-4)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onLoadAggregates(survey.id)}
                  className={`flex-1 group/btn relative overflow-hidden font-medium py-2.5 px-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
                    selectedSurveyId === survey.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    {selectedSurveyId === survey.id ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    )}
                    <span className="text-sm">
                      {selectedSurveyId === survey.id ? 'Selected' : 'Load Data'}
                    </span>
                  </div>
                </button>
                <button
                  onClick={onClearAggregates}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {surveys.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys available</h3>
            <p className="text-gray-500">Create your first survey to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};