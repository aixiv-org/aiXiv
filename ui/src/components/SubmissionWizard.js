import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Bot, Wand2, Send, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

const SubmissionWizard = ({ type, currentStep, setCurrentStep, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: [],
    agent: '',
    category: [],
    keywords: [],
    license: 'CC-BY-4.0',
    content: '',
    abstract: '',
  });
  
  const [aiAssistEnabled, setAiAssistEnabled] = useState(false);
  const [complianceChecks, setComplianceChecks] = useState({
    originality: false,
    aiUsage: false,
    reproducibility: false,
  });
  
  const fileInputRef = useRef(null);

  const steps = [
    'Choose Type',
    'Metadata',
    'Upload/Compose',
    'AI Assist',
    'Preview & Submit'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    // Simulate submission
    alert('Submission successful! ID: SUB-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  };

  const renderMetadataStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {type === 'paper' ? 'Paper' : 'Proposal'} Metadata
        </h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-field"
              placeholder="Enter a descriptive title (max 220 characters)"
              maxLength={220}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.title.length}/220 characters
            </div>
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agent Author
            </label>
            <div className="space-y-2">
              <input
                type="text"
                className="input-field"
                placeholder="Type author name or ORCID to search..."
              />
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  Dr. Sarah Chen
                  <button className="ml-2 text-primary-600 hover:text-primary-800">×</button>
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Bot className="h-3 w-3 mr-1" />
                  ResearchBot v3.2
                  <button className="ml-2 text-purple-600 hover:text-purple-800">×</button>
                </span>
              </div>
            </div>
          </div>

          {/* Corresponding Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Corresponding Author
            </label>
            <input
              type="text"
              value={formData.correspondingAuthor || ''}
              onChange={e => setFormData({ ...formData, correspondingAuthor: e.target.value })}
              className="input-field"
              placeholder="Enter corresponding author's name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-4">
              <select className="input-field">
                <option>Computer Science</option>
                <option>Physics</option>
                <option>Biology</option>
                <option>Chemistry</option>
              </select>
              <select className="input-field">
                <option>Machine Learning</option>
                <option>AI</option>
                <option>NLP</option>
                <option>Computer Vision</option>
              </select>
              <select className="input-field">
                <option>Deep Learning</option>
                <option>Reinforcement Learning</option>
                <option>Supervised Learning</option>
              </select>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords (3-6 recommended)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Type keywords separated by commas"
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Suggested: machine learning, neural networks, transformers
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
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {type === 'paper' ? 'Upload Paper' : 'Compose Proposal'}
        </h2>

        {type === 'paper' ? (
          <div className="space-y-6">
            {/* File Upload */}
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-primary-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop your files here or click to browse
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Supports PDF, LaTeX
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.tex"
                multiple
              />
              <button className="btn-primary">
                Choose Files
              </button>
            </div>

            {/* Preview */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 min-h-64">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Document preview will appear here</p>
                <p className="text-sm">JATS XML conversion in progress...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {/* Markdown Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Write your proposal
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="input-field h-96 font-mono text-sm"
                placeholder="# Research Proposal Title

## Abstract
Brief summary of your research idea...

## Background & Motivation
Why is this research important?

## Methodology
How will you approach this research?

## Expected Outcomes
What do you hope to achieve?

## Timeline
When do you plan to complete different phases?"
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Supports Markdown and Mermaid diagrams
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Preview
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 h-96 overflow-y-auto bg-white dark:bg-gray-800">
                <div className="prose dark:prose-invert max-w-none">
                  <h1>Research Proposal Title</h1>
                  <h2>Abstract</h2>
                  <p>Brief summary of your research idea...</p>
                  <h2>Background & Motivation</h2>
                  <p>Why is this research important?</p>
                  <h2>Methodology</h2>
                  <p>How will you approach this research?</p>
                  <h2>Expected Outcomes</h2>
                  <p>What do you hope to achieve?</p>
                  <h2>Timeline</h2>
                  <p>When do you plan to complete different phases?</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auto-save indicator */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          Draft saved automatically
        </div>
      </div>
    </div>
  );

  const renderAIAssistStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Assistance (Optional)
          </h2>
          <button
            onClick={() => setAiAssistEnabled(!aiAssistEnabled)}
            className={`btn-primary ${!aiAssistEnabled ? 'opacity-50' : ''}`}
          >
            {aiAssistEnabled ? 'Disable AI' : 'Enable AI'}
          </button>
        </div>

        {aiAssistEnabled ? (
          <div className="space-y-6">
            {/* Abstract Polish */}
            <div className="card p-6 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-start space-x-4">
                <Wand2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Abstract Enhancement
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    AI suggests improvements to clarity, structure, and impact of your abstract.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Suggested changes:</div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-red-600">-</span> "We present a new approach"
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600">+</span> "We introduce a novel framework"
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary text-sm">Apply All</button>
                </div>
              </div>
            </div>

            {/* Keyword Suggestions */}
            <div className="card p-6 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-start space-x-4">
                <Bot className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Keyword Optimization
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Suggested keywords to improve discoverability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['attention mechanism', 'sequence modeling', 'computational efficiency'].map((keyword) => (
                      <button key={keyword} className="btn-secondary text-sm">
                        + {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ethics Scan */}
            <div className="card p-6 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Ethical Risk Assessment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Automated scan for potential ethical concerns.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      No bias indicators detected
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Privacy considerations addressed
                    </div>
                    <div className="flex items-center text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                      Consider adding environmental impact section
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Enable AI assistance to get suggestions for improving your submission</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-8">
        {/* Preview */}
        <div className="col-span-2">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Preview
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <h1>{formData.title || `Sample ${type} Title`}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <span>Dr. Sarah Chen</span>
                <span>•</span>
                <span>ResearchBot v3.2</span>
                <span>•</span>
                <span>Computer Science > Machine Learning</span>
              </div>

              <h2>Abstract</h2>
              <p>
                This {type} presents a comprehensive analysis of modern machine learning 
                approaches with a focus on transformer architectures and their applications 
                in natural language processing tasks.
              </p>

              {type === 'paper' ? (
                <div>
                  <h2>1. Introduction</h2>
                  <p>The field of machine learning has seen remarkable advances...</p>
                  
                  <h2>2. Methodology</h2>
                  <p>Our approach combines several state-of-the-art techniques...</p>
                  
                  <h2>3. Results</h2>
                  <p>Experimental results demonstrate significant improvements...</p>
                  
                  <h2>4. Conclusion</h2>
                  <p>We have presented a novel framework that achieves...</p>
                </div>
              ) : (
                <div>
                  <h2>Background & Motivation</h2>
                  <p>Current approaches face several limitations...</p>
                  
                  <h2>Proposed Research</h2>
                  <p>We propose to investigate a new methodology...</p>
                  
                  <h2>Expected Impact</h2>
                  <p>This research could lead to significant advances...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compliance Checklist */}
        <div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Compliance Checklist
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={complianceChecks.originality}
                  onChange={(e) => setComplianceChecks({
                    ...complianceChecks,
                    originality: e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Originality Declaration
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    I confirm this work is original and properly cites all sources
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={complianceChecks.aiUsage}
                  onChange={(e) => setComplianceChecks({
                    ...complianceChecks,
                    aiUsage: e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    AI Usage Disclosure
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    I have disclosed all AI tools used in this research
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={complianceChecks.reproducibility}
                  onChange={(e) => setComplianceChecks({
                    ...complianceChecks,
                    reproducibility: e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Reproducibility
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Code and data are available or exemption noted
                  </div>
                </div>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!Object.values(complianceChecks).every(Boolean)}
              className={`w-full mt-6 btn-primary flex items-center justify-center space-x-2 ${
                !Object.values(complianceChecks).every(Boolean) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Submit {type}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Submit {type === 'paper' ? 'Paper' : 'Proposal'}
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep 
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && renderMetadataStep()}
      {currentStep === 2 && renderUploadStep()}
      {currentStep === 3 && renderAIAssistStep()}
      {currentStep === 4 && renderPreviewStep()}

      {/* Navigation */}
      {currentStep > 0 && currentStep < 4 && (
        <div className="mt-8 flex justify-between">
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          <button onClick={handleNext} className="btn-primary flex items-center space-x-2">
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionWizard;
