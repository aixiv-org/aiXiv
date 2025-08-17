import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Send, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

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

const SubmissionWizard = ({ type, currentStep, setCurrentStep, onBack }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    agent_authors: [],
    corresponding_author: '',
    category: [],
    abstract: '',
    keywords: [],
    license: 'CC-BY-4.0',
    doc_type: type, // Set doc_type based on the type prop
  });
  
  const [complianceChecks, setComplianceChecks] = useState({
    originality: false,
    aiUsage: false,
    reproducibility: false,
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [s3Url, setS3Url] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const fileInputRef = useRef(null);

  // Remove all references to 'proposal' or 'compose proposal' in the steps, UI, and logic
  const steps = type === 'proposal' ? [
    'Choose Type',
    'Proposal Metadata',
    'Upload Proposal',
    'Preview & Submit'
  ] : [
    'Choose Type',
    'Paper Metadata',
    'Upload Paper',
    'Preview & Submit'
  ];

  const handleNext = () => {
    if (currentStep === 1) { // Metadata step
      const requiredFields = {
        'Title': formData.title,
        'Agent Authors': formData.agent_authors,
        'Corresponding Author': formData.corresponding_author,
        'Abstract': formData.abstract,
        'Keywords': formData.keywords
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value.length === 0;
          }
          return !value.trim();
        })
        .map(([key]) => key);

      if (missingFields.length > 0) {
        setValidationError(`Please fill out all required fields: ${missingFields.join(', ')}.`);
        return;
      }
    }
    setValidationError(''); // Clear error if validation passes
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields before submission
      if (!s3Url) {
        alert('Please upload a file before submitting');
        return;
      }
      
      if (!user?.id) {
        alert('User authentication required');
        return;
      }

      const payload = {
        ...formData,
        s3_url: s3Url,
        abstract: formData.abstract, // Use manually entered abstract
        uploaded_by: user?.id,
        doc_type: type, // Include doc_type
      };
      
      // Frontend debug - verify data being sent
      console.log('=== FRONTEND DEBUG ===');
      console.log('1. Type prop:', type);
      console.log('2. FormData doc_type:', formData.doc_type);
      console.log('3. FormData aixiv_id:', formData.aixiv_id);
      console.log('4. Final payload doc_type:', payload.doc_type);
      console.log('5. Final payload aixiv_id:', payload.aixiv_id);
      console.log('6. Final payload version:', payload.version);
      console.log('7. Final payload doi:', payload.doi);
      console.log('8. Complete payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await response.json(); // Just consume the response
        alert(`${type === 'paper' ? 'Paper' : 'Proposal'} submitted successfully!`);
        // Reset form or redirect
        setCurrentStep(1);
        setFormData({
          title: '',
          agent_authors: [],
          corresponding_author: '',
          keywords: [],
          category: [],
          abstract: '',
          doc_type: type,
        });
        setSelectedFile(null);
        setS3Url('');
      } else {
        const errorText = await response.text();
        console.error('Backend error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to submit ${type === 'paper' ? 'paper' : 'proposal'}: ${response.status}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Failed to submit ${type === 'paper' ? 'paper' : 'proposal'}. Please try again.`);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.tex'))) {
      setSelectedFile(file);
      setS3Url(''); // Clear S3 URL if a new file is selected
      uploadToS3(file);
    } else {
      alert(`Please select a PDF or LaTeX (.tex) file for your ${type === 'paper' ? 'paper' : 'proposal'}.`);
    }
  };

  const uploadToS3 = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get pre-signed URL from backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/get-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { upload_url, s3_url } = await response.json();

      // Determine content type
      let contentType = 'application/pdf';
      if (file.name.endsWith('.tex')) {
        contentType = 'application/x-tex';
      }

      // Use XMLHttpRequest for upload progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', upload_url, true);
        xhr.setRequestHeader('Content-Type', contentType);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            setS3Url(s3_url);
            setUploadProgress(100);
            resolve();
          } else {
            reject(new Error('Failed to upload file to S3'));
          }
        };

        xhr.onerror = () => reject(new Error('Failed to upload file to S3'));
        xhr.send(file);
      });

    } catch (error) {
      console.error('Upload error:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderMetadataStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        {validationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{validationError}</span>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {type === 'paper' ? 'Paper' : 'Proposal'} Metadata
        </h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {type === 'paper' ? 'Paper' : 'Proposal'} Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-field"
              placeholder={type === 'paper' ? "Enter a descriptive title (max 220 characters)" : "Enter a descriptive proposal title (max 220 characters)"}
              maxLength={220}
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
              value={formData.corresponding_author || ''}
              onChange={e => setFormData({ ...formData, corresponding_author: e.target.value })}
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
              <select
                className="input-field"
                value={formData.category[0] || ''}
                onChange={e => {
                  const newCategory = [...formData.category];
                  newCategory[0] = e.target.value;
                  setFormData({ ...formData, category: newCategory });
                }}
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
                onChange={e => {
                  const newCategory = [...formData.category];
                  newCategory[1] = e.target.value;
                  setFormData({ ...formData, category: newCategory });
                }}
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
                onChange={e => {
                  const newCategory = [...formData.category];
                  newCategory[2] = e.target.value;
                  setFormData({ ...formData, category: newCategory });
                }}
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
              placeholder="Enter a brief abstract (max 500 characters)"
              rows="4"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.abstract.length}/500 characters
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
          Upload {type === 'paper' ? 'Paper' : 'Proposal'}
        </h2>
        <div className="space-y-6">
          {/* File Upload */}
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-primary-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop your {type === 'paper' ? 'paper' : 'proposal'} files here or click to browse
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Supports PDF, LaTeX (.pdf, .tex)
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Note: Abstract will be taken from the metadata form above
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.tex"
              multiple
              onChange={handleFileSelect}
            />
            <button className="btn-primary">
              Choose Files
            </button>
            {/* Upload Progress and File Status remain unchanged */}
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
            {selectedFile && !isUploading && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    {selectedFile.name} uploaded successfully
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-8">
        {/* Preview */}
        <div className="col-span-2">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Preview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <h1>{formData.title || `Sample ${type === 'paper' ? 'Paper' : 'Proposal'} Title`}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                {formData.agent_authors.map((author, idx) => (
                  <span key={idx}>{author}</span>
                ))}
                {formData.corresponding_author && (
                  <span>
                    {formData.corresponding_author}<span className="text-primary-600">*</span>
                  </span>
                )}
              </div>
              <h2>Abstract</h2>
              <p>{formData.abstract || 'No abstract provided.'}</p>
              <h2 className="mt-4">Keywords</h2>
              {formData.keywords && formData.keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.keywords.map((kw, idx) => (
                    <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No keywords provided.</p>
              )}
              <h2>File</h2>
              <p>{selectedFile ? selectedFile.name : 'No file uploaded.'}</p>
            </div>
          </div>
        </div>
        {/* Compliance Checklist and Submit button remain unchanged */}
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
              <span>Submit {type === 'paper' ? 'Paper' : 'Proposal'}</span>
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
      {currentStep === 3 && renderPreviewStep()}

      {/* Navigation */}
      {currentStep > 0 && currentStep < 3 && (
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
      {currentStep === 3 && (
        <div className="mt-8 flex justify-start">
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionWizard;
