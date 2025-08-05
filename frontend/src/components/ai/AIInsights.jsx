import React, { useState } from 'react';
import { FiSparkles, FiCopy, FiCheck } from 'react-icons/fi';

const AIInsights = ({ chartData, xAxis, yAxis, chartType }) => {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateInsights = async () => {
    if (!chartData || !xAxis || !yAxis) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      setTimeout(() => {
        setInsights(`**Key Insights for ${xAxis} vs ${yAxis}**\n\n` +
          `1. The ${chartType} chart shows a clear trend in the data.\n` +
          `2. The highest value is ${Math.max(...chartData.datasets[0].data)}.\n` +
          `3. Consider investigating the data points around the middle of the range.`);
        setIsLoading(false);
      }, 1500);
      
      // In a real implementation, you would call your backend API:
      // const response = await fetch('/api/ai/insights', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ chartData, xAxis, yAxis, chartType })
      // });
      // const data = await response.json();
      // setInsights(data.insights);
      
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
      console.error('Error generating insights:', err);
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(insights);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <FiSparkles className="mr-2 text-yellow-500" />
          AI-Powered Insights
        </h3>
        {insights && (
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
            title="Copy to clipboard"
          >
            {copied ? (
              <FiCheck className="w-4 h-4 text-green-500" />
            ) : (
              <FiCopy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      
      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : insights ? (
        <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
          {insights}
        </div>
      ) : (
        <div className="text-center py-4">
          <button
            onClick={generateInsights}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FiSparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Get AI-powered analysis of your chart data
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
