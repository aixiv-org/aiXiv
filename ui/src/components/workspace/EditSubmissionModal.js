import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';

// ChipsInput component for multi-value fields
function ChipsInput({ values, onChange, placeholder }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) {
        onChange([...values, input.trim()]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center border rounded px-2 py-1 bg-white dark:bg-gray-700">
      {values.map((val, idx) => (
        <span key={idx} className="bg-blue-100 text-blue-800 rounded px-2 py-1 mr-1 mb-1 flex items-center">
          {val}
          <button
            type="button"
            className="ml-1 text-blue-500 hover:text-blue-700"
            onClick={() => onChange(values.filter((_, i) => i !== idx))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 outline-none bg-transparent py-1"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

const EditSubmissionModal = ({ submission, isOpen, onClose, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    agent_authors: [],
    corresponding_author: '',
    category: [],
    abstract: '',
    keywords: [],
    license: 'CC-BY-4.0',
  });
  const [newFile, setNewFile] = useState(null);

  // Initialize form data when submission changes
  useEffect(() => {
    if (submission) {
      setFormData({
        title: submission.title || '',
        agent_authors: submission.agent_authors || [],
        corresponding_author: submission.corresponding_author || '',
        category: submission.category || [],
        abstract: submission.abstract || '',
        keywords: submission.keywords || [],
        license: submission.license || 'CC-BY-4.0',
      });
    }
  }, [submission]);

  const handleCategoryChange = (index, value) => {
    const newCategory = [...formData.category];
    newCategory[index] = value;
    setFormData({ ...formData, category: newCategory });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, newFile); // Pass new file back
  };

  if (!isOpen || !submission) return null;

  const currentFileName = submission.s3_url.split('/').pop();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Submission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {submission.aixiv_id} • Version {submission.version} → New Version
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {submission.doc_type === 'paper' ? 'Paper' : 'Proposal'} Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input-field"
                placeholder={submission.doc_type === 'paper' ? "Enter a descriptive title (max 220 characters)" : "Enter a descriptive proposal title (max 220 characters)"}
                maxLength={220}
                required
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.title.length}/220 characters
              </div>
            </div>

            {/* Agent Authors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agent Authors *
              </label>
              <ChipsInput
                values={formData.agent_authors}
                onChange={vals => setFormData({ ...formData, agent_authors: vals })}
                placeholder="Add author and press Enter"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Example: Dr. Sarah Chen, ResearchBot v3.2
              </div>
            </div>

            {/* Corresponding Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Corresponding Author *
              </label>
              <input
                type="text"
                value={formData.corresponding_author}
                onChange={(e) => setFormData({...formData, corresponding_author: e.target.value})}
                className="input-field"
                placeholder="Enter corresponding author's name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  className="input-field"
                  value={formData.category[0] || ''}
                  onChange={e => handleCategoryChange(0, e.target.value)}
                >
                  <option value="">Select main field</option>
                  <option>Computer Science</option>
                  <option>Physics</option>
                  <option>Biology</option>
                  <option>Chemistry</option>
                </select>
                <select
                  className="input-field"
                  value={formData.category[1] || ''}
                  onChange={e => handleCategoryChange(1, e.target.value)}
                >
                  <option value="">Select subfield</option>
                  <option>Machine Learning</option>
                  <option>AI</option>
                  <option>NLP</option>
                  <option>Computer Vision</option>
                </select>
                <select
                  className="input-field"
                  value={formData.category[2] || ''}
                  onChange={e => handleCategoryChange(2, e.target.value)}
                >
                  <option value="">Select specialization</option>
                  <option>Deep Learning</option>
                  <option>Reinforcement Learning</option>
                  <option>Supervised Learning</option>
                </select>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Abstract *
              </label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                className="input-field"
                placeholder="Enter a comprehensive abstract (max 500 words)"
                rows="6"
                maxLength={2500}
                required
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.abstract.length} characters • {Math.ceil(formData.abstract.length / 5)} words (max 500 words)
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords * (3-6 recommended)
              </label>
              <ChipsInput
                values={formData.keywords}
                onChange={vals => setFormData({ ...formData, keywords: vals })}
                placeholder="Add keyword and press Enter"
              />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Suggested: machine learning, neural networks, transformers
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Submission File
              </label>
              <div className="flex items-center space-x-4">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">
                  {newFile ? newFile.name : currentFileName}
                </span>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.tex"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-secondary cursor-pointer"
                >
                  Re-upload
                </label>
              </div>
            </div>

            {/* License */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                License
              </label>
              <select 
                value={formData.license}
                onChange={(e) => setFormData({...formData, license: e.target.value})}
                className="input-field"
              >
                <option value="CC-BY-4.0">CC BY 4.0 (Recommended)</option>
                <option value="CC-BY-SA-4.0">CC BY-SA 4.0</option>
                <option value="CC-BY-NC-4.0">CC BY-NC 4.0</option>
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Create New Version</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubmissionModal; 