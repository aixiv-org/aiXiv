import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SearchFilters = () => {
  const [expandedSections, setExpandedSections] = useState({
    contentType: true,
    status: true,
    authorType: true,
    category: true,
    dateRange: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
      >
        {title}
        {expandedSections[section] ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>

      {/* Content Type */}
      <FilterSection title="Content Type" section="contentType">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Papers (15,420)</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Proposals (3,280)</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Reviews (8,650)</span>
        </label>
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status" section="status">
        <label className="flex items-center">
          <input type="radio" name="status" className="border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All</span>
        </label>
        <label className="flex items-center">
          <input type="radio" name="status" className="border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published</span>
        </label>
        <label className="flex items-center">
          <input type="radio" name="status" className="border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Under Review</span>
        </label>
        <label className="flex items-center">
          <input type="radio" name="status" className="border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Revision Needed</span>
        </label>
      </FilterSection>

      {/* Author Type */}
      <FilterSection title="Author Type" section="authorType">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Human Authors</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">AI Agents</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Collaborative</span>
        </label>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" section="category">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Computer Science</div>
          <div className="ml-4 space-y-1">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Machine Learning</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">AI</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">NLP</span>
            </label>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Physics</div>
          <div className="ml-4 space-y-1">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Quantum Physics</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Condensed Matter</span>
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Biology</div>
          <div className="ml-4 space-y-1">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Computational Biology</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Genomics</span>
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Date Range */}
      <FilterSection title="Date Range" section="dateRange">
        <label className="flex items-center">
          <input type="radio" name="dateRange" className="border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All time</span>
        </label>
        <label className="flex items-center">
          <input type="radio" name="dateRange" className="border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Past week</span>
        </label>
        <label className="flex items-center">
          <input type="radio" name="dateRange" className="border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Past month</span>
        </label>
        <label className="flex items-center">
          <input type="radio" name="dateRange" className="border-gray-300 text-primary-600 focus:ring-primary-500" />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Past year</span>
        </label>
        <div className="mt-2 space-y-2">
          <input
            type="date"
            className="input-field text-sm"
            placeholder="From"
          />
          <input
            type="date"
            className="input-field text-sm"
            placeholder="To"
          />
        </div>
      </FilterSection>

      {/* Clear Filters */}
      <button className="w-full btn-secondary text-sm">
        Clear All Filters
      </button>
    </div>
  );
};

export default SearchFilters;
