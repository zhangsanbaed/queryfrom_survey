interface AggregateDataProps {
  aggregateHandles: Record<string, string>;
  clearAggregates: Record<string, { handle: string; clear: string | bigint | boolean }>;
  onDecrypt: (surveyId: number, questionId: number) => void;
  canDecrypt: boolean;
  isDecrypting: boolean;
  selectedSurveyId: number;
  decryptingQuestion: string | null;
}

export const AggregateData = ({ aggregateHandles, clearAggregates, onDecrypt, canDecrypt, selectedSurveyId, decryptingQuestion }: AggregateDataProps) => {
  return (
    <div className="group relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Aggregate Data</h2>
              <p className="text-gray-600">View and decrypt encrypted survey data</p>
            </div>
          </div>
        </div>
        
        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(aggregateHandles)
            .filter(([key]) => {
              const [surveyId] = key.split('-').map(Number);
              return surveyId === selectedSurveyId;
            })
            .map(([key, handle]) => {
            const [surveyId, questionId] = key.split('-').map(Number);
            const clearData = clearAggregates[key];
            const isDecrypted = clearData && clearData.handle === handle;
            return (
              <div key={key} className="group/data relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                {/* Data Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-600">Q{questionId + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Survey {surveyId}</h3>
                      <p className="text-sm text-gray-500">Question {questionId + 1}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isDecrypted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${
                      isDecrypted 
                        ? 'bg-green-400' 
                        : 'bg-orange-400 animate-pulse'
                    }`}></div>
                    {isDecrypted ? 'Decrypted' : 'Encrypted'}
                  </span>
                </div>
                
                {/* Handle Display */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    {isDecrypted ? 'Decrypted Result' : 'Encrypted Handle'}
                  </label>
                  {decryptingQuestion === key && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">正在解密中...</p>
                    </div>
                  )}
                  <div className="relative">
                    <div className={`text-xs font-mono p-3 rounded-xl border break-all max-h-20 overflow-y-auto ${
                      isDecrypted 
                        ? 'text-green-700 bg-green-50 border-green-200' 
                        : 'text-gray-600 bg-gray-50 border-gray-200'
                    }`}>
                      {isDecrypted ? String(clearData.clear) : handle}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(isDecrypted ? String(clearData.clear) : handle)}
                      className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      title={isDecrypted ? "Copy result" : "Copy handle"}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Decrypt Button */}
                {!isDecrypted && (
                  <button
                    onClick={() => {
                      console.log('Decrypt button clicked:', { 
                        surveyId, 
                        questionId, 
                        canDecrypt, 
                        decryptingQuestion: decryptingQuestion === key,
                        handle,
                        clearData
                      });
                      onDecrypt(surveyId, questionId);
                    }}
                    disabled={!canDecrypt || decryptingQuestion === key}
                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      {decryptingQuestion === key ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                      <span className="text-sm">
                        {decryptingQuestion === key ? 'Signing & Decrypting...' : 'Request Decryption'}
                      </span>
                    </div>
                  </button>
                )}
                
                {/* Success Message */}
                {isDecrypted && (
                  <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">Successfully Decrypted!</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Empty State */}
        {Object.entries(aggregateHandles).filter(([key]) => {
          const [surveyId] = key.split('-').map(Number);
          return surveyId === selectedSurveyId;
        }).length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No aggregate data available</h3>
            <p className="text-gray-500">Load survey aggregates to view encrypted data</p>
          </div>
        )}
      </div>
    </div>
  );
};