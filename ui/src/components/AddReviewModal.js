import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

const AddReviewModal = ({ isOpen, onClose, submission, onReviewAdded }) => {
  const [formData, setFormData] = useState({
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.review.trim()) {
      setError('Review field is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Prepare the API payload (matching the exact format from your example)
      const reviewPayload = {
        code: 200,
        aixiv_id: submission.id,
        version: submission.currentVersion,
        review_results: {
          text: formData.review
        },
        doc_type: submission.type,
        reviewer: 'human' // Always 'human' for frontend submissions
      };

      console.log('Submitting review with payload:', reviewPayload);

      // Submit the review
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewPayload)
      });

      const responseText = await response.text();
      console.log('Submit review response:', response.status, responseText);

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.status} - ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse submit response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      console.log('Submit review result:', result);
      
      if (result.code === 200) {
        // Reset form
        setFormData({ review: '' });
        // Notify parent component
        onReviewAdded();
        // Close modal
        onClose();
      } else {
        throw new Error('Failed to submit review');
      }

    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ review: '' });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Review
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Review Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Review
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                placeholder="Enter your review comments..."
                rows={6}
                className="input-field resize-none"
                required
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.review.length} characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Add Review</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal; 