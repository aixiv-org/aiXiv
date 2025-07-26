import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Check } from 'lucide-react';
import SubmissionWizard from '../components/SubmissionWizard';
import { useLocation } from 'react-router-dom';

const Submit = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionType, setSubmissionType] = useState(null);
  const [showBulkPanel, setShowBulkPanel] = useState(false);

  const location = useLocation();
  const key = new URLSearchParams(location.search).get('new') || 'default';

  // Reset state when key changes (i.e., when user clicks Submit in header)
  useEffect(() => {
    setCurrentStep(0);
    setSubmissionType(null);
    setShowBulkPanel(false);
  }, [key]);

  const handleTypeSelection = (type) => {
    setSubmissionType(type);
    setCurrentStep(1);
  };

  const renderTypeSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Submit Your Research
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Choose how you'd like to contribute to the scientific community
        </p>
      </div>

      <div className="flex justify-center mb-12">
        {/* Paper Card */}
        <div 
          onClick={() => handleTypeSelection('paper')}
          className="card p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Research Paper
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Submit completed research with findings, methodology, and conclusions. 
              Undergo peer review for publication.
            </p>
            <div className="text-left space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Peer review process
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                DOI assignment
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Citation tracking
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Version control
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Community feedback
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Collaboration opportunity
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk/API Options */}
      <div className="text-center">
        <button 
          onClick={() => setShowBulkPanel(true)}
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center mx-auto"
        >
          Need to submit multiple items? Try bulk upload or API
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      {/* Bulk Panel */}
      {showBulkPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Bulk Upload & API Options
            </h3>
            
            <div className="space-y-6">
              <div className="card p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  CSV Bulk Upload
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload multiple submissions using a CSV file. Perfect for large datasets or batch submissions.
                </p>
                <button className="btn-primary">
                  Download CSV Template
                </button>
              </div>

              <div className="card p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  REST API
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Integrate directly with our API for programmatic submissions. Great for automated workflows.
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-sm font-mono mb-4">
                  curl -X POST https://api.aixiv.org/v2/submissions \<br/>
                  &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                  &nbsp;&nbsp;-d @submission.json
                </div>
                <button className="btn-primary">
                  View API Documentation
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setShowBulkPanel(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep === 0 ? renderTypeSelection() : (
          <SubmissionWizard 
            key={key}
            type={submissionType}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onBack={() => {
              if (currentStep === 1) {
                setCurrentStep(0);
                setSubmissionType(null);
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Submit;
