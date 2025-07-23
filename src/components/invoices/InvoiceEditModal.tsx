import React, { useState, useEffect } from 'react';
import type { Invoice, Comment } from '../../views/invoices/InvoiceDashboard';

interface InvoiceEditModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoiceId: string, updates: { status: Invoice['status']; comment?: string }) => void;
}

export const InvoiceEditModal: React.FC<InvoiceEditModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSave
}) => {
  const [status, setStatus] = useState<Invoice['status']>('draft');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (invoice) {
      setStatus(invoice.status);
      setComment('');
    }
  }, [invoice]);

  const handleSave = async () => {
    if (!invoice) return;
    
    setIsSubmitting(true);
    try {
      await onSave(invoice.id, { 
        status, 
        comment: comment.trim() || undefined 
      });
      onClose();
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStatus(invoice?.status || 'draft');
    setComment('');
    onClose();
  };

  console.log('Modal render - isOpen:', isOpen, 'invoice:', invoice?.invoiceNumber);
  if (!isOpen || !invoice) return null;

  return (
    <div 
      className="fixed inset-0 z-50 invoice-modal" 
      style={{
        backgroundColor: 'rgba(75, 85, 99, 0.75)',
        backdropFilter: 'blur(2px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          top: '60px',
          zIndex: 1000,
          width: '50%',
          padding: '0px 20px',
          height: 'fit-content',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Invoice
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 transition-colors bg-white border border-gray-300"
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
</svg>

            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Invoice #{invoice.invoiceNumber} - {invoice.customerName}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Current Invoice Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Current Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-2 font-medium">${invoice.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Due Date:</span>
                <span className="ml-2 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Current Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Days Overdue:</span>
                <span className={`ml-2 font-medium ${getDaysOverdueStyle(invoice.daysOverdue)}`}>
                  {invoice.daysOverdue === 0 ? 'On time' : `${invoice.daysOverdue} days`}
                </span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <label style={{display: 'block',width: '100%',textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px'}}>
              Update Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Invoice['status'])}
              className="bg-white text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label style={{display: 'block',width: '100%',textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px'}}>
              Add Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment about this invoice..."
              rows={3}
              className="bg-white text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Recent Comments */}
          {invoice.comments && invoice.comments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Comments</h3>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {invoice.comments.slice(-3).map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded p-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '10px'}}>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStatusStyle = (status: Invoice['status']) => {
  const styles = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-600'
  };
  return styles[status] || styles.draft;
};

const getDaysOverdueStyle = (days: number) => {
  if (days === 0) return 'text-gray-500';
  if (days <= 7) return 'text-yellow-600';
  if (days <= 30) return 'text-orange-600';
  return 'text-red-600 font-semibold';
}; 