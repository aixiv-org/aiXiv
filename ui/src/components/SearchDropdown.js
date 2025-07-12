import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, FileText, Bot } from 'lucide-react';

const SearchDropdown = ({ query, onClose }) => {
  // Mock search results
  const recentSearches = ['machine learning', 'neural networks', 'quantum computing'];
  const quickHits = [
    {
      id: '1',
      title: 'Attention Is All You Need',
      authors: ['Vaswani et al.'],
      type: 'paper',
      isAI: false,
    },
    {
      id: '2',
      title: 'GPT-4 Technical Report',
      authors: ['OpenAI'],
      type: 'paper',
      isAI: true,
    },
    {
      id: '3',
      title: 'Proposal: Automated Scientific Discovery',
      authors: ['AI Research Bot'],
      type: 'proposal',
      isAI: true,
    },
  ];

  const filteredResults = quickHits.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
      {/* Quick Actions */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Quick Actions
        </div>
        <Link
          to={`/explore?q=${encodeURIComponent(query)}`}
          onClick={onClose}
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Search for "{query}"</span>
        </Link>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Recent Searches
          </div>
          {recentSearches.map((search, index) => (
            <Link
              key={index}
              to={`/explore?q=${encodeURIComponent(search)}`}
              onClick={onClose}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{search}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Hits */}
      {filteredResults.length > 0 && (
        <div className="p-3">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Quick Hits
          </div>
          {filteredResults.map((item) => (
            <Link
              key={item.id}
              to={`/submission/${item.id}`}
              onClick={onClose}
              className="flex items-start space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <div className="flex-shrink-0 mt-1">
                {item.type === 'proposal' ? (
                  <FileText className="h-4 w-4 text-blue-500" />
                ) : (
                  <FileText className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  {item.isAI && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      <Bot className="h-3 w-3 mr-1" />
                      AI
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.authors.join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredResults.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No quick hits found</p>
          <p className="text-xs">Try searching for papers, authors, or keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
