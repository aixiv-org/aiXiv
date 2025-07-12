import React from 'react';
import { TrendingUp, Users, ExternalLink } from 'lucide-react';

const ContextPanel = ({ query }) => {
  const tagCloud = [
    { tag: 'machine learning', size: 'text-xl', count: 1250 },
    { tag: 'neural networks', size: 'text-lg', count: 890 },
    { tag: 'deep learning', size: 'text-base', count: 650 },
    { tag: 'transformer', size: 'text-lg', count: 780 },
    { tag: 'attention', size: 'text-base', count: 540 },
    { tag: 'nlp', size: 'text-sm', count: 420 },
    { tag: 'computer vision', size: 'text-sm', count: 380 },
    { tag: 'reinforcement learning', size: 'text-base', count: 490 },
  ];

  const relatedPapers = [
    {
      id: '1',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      authors: ['Jacob Devlin', 'Ming-Wei Chang'],
      views: 8920,
    },
    {
      id: '2',
      title: 'GPT-3: Language Models are Few-Shot Learners',
      authors: ['Tom B. Brown', 'Benjamin Mann'],
      views: 12400,
    },
    {
      id: '3',
      title: 'Vision Transformer: An Image is Worth 16x16 Words',
      authors: ['Alexey Dosovitskiy', 'Lucas Beyer'],
      views: 6780,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tag Cloud */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Topics</h3>
        <div className="flex flex-wrap gap-2">
          {tagCloud.map((item) => (
            <button
              key={item.tag}
              className={`${item.size} font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-pointer`}
              title={`${item.count} papers`}
            >
              {item.tag}
            </button>
          ))}
        </div>
      </div>

      {/* People Also Viewed */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          People Also Viewed
        </h3>
        <div className="space-y-3">
          {relatedPapers.map((paper) => (
            <div key={paper.id} className="group cursor-pointer">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {paper.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {paper.authors.join(', ')}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {paper.views.toLocaleString()} views
                </span>
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-primary-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citation Graph */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Citation Network</h3>
        <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="mb-2">📊</div>
            <div className="text-sm">Interactive Citation Graph</div>
            <div className="text-xs">Shows connections between papers</div>
          </div>
        </div>
      </div>

      {/* Saved Searches */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Searches</h3>
        <div className="space-y-2">
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">ML Papers 2024</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">machine learning, 2024</div>
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">Quantum Computing</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">quantum, computation</div>
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">AI Proposals</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">type:proposal, ai</div>
          </div>
        </div>
      </div>

      {/* Live Activity */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Activity</h3>
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div>🔴 3 users viewing similar results</div>
          <div>📝 2 new papers in Machine Learning</div>
          <div>💬 5 new comments on related papers</div>
          <div>⭐ 12 papers bookmarked today</div>
        </div>
      </div>
    </div>
  );
};

export default ContextPanel;
