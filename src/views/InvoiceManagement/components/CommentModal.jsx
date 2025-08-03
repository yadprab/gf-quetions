import React, { useState, useEffect } from 'react';
import { useComments } from '../hooks/useComments';
import { toast } from 'react-toastify';

const CommentModal = ({ isOpen, onClose, invoiceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { loading, error, fetchComments, addComment } = useComments();

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchCommentsData();
    }
  }, [isOpen, invoiceId]);

  const fetchCommentsData = async () => {
    const data = await fetchComments(invoiceId);
    setComments(data);
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentData = await addComment(invoiceId, newComment.trim());
    if (newCommentData) {
      setComments(prevComments => [...prevComments, newCommentData]);
      setNewComment('');
      toast.success('Comment added successfully');
    } else {
      toast.error('Failed to add comment');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className='bg-white rounded-lg p-6 w-1/2 max-h-[600px] flex flex-col'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-lg font-semibold'>
            Comments - Invoice #{invoiceId}
          </h3>
          <button
            onClick={onClose}
            className='bg-transparent border-none text-2xl cursor-pointer p-2'
          >
            ×
          </button>
        </div>

        <div className='flex-1 overflow-y-auto mb-4 min-h-[200px]'>
          {error && (
            <div className='text-center p-5 text-red-500 bg-red-50 rounded-md mb-4'>
              {error}
            </div>
          )}
          {loading ? (
            <div className='text-center p-5'>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className='text-center p-5 text-gray-500'>
              No comments yet
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className='border border-gray-200 rounded-md p-3 mb-2'>
                <div className='text-sm font-medium mb-1'>
                  {comment.author || 'Anonymous'}
                </div>
                <div className='text-sm text-gray-600 mb-1'>
                  {comment.text}
                </div>
                <div className='text-xs text-gray-500'>
                  {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Just now'}
                </div>
              </div>
            ))
          )}
        </div>

        <div className='border-t border-gray-200 pt-4'>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                addCommentHandler(e);
              }
            }}
            placeholder="Add a comment... (Ctrl+Enter to submit)"
            className='w-full min-h-[80px] p-2 border border-gray-300 rounded-md resize-vertical text-sm mb-3'
          />
          <div className='flex justify-end gap-2'>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className='px-4 py-2 border border-gray-300 rounded-md bg-white cursor-pointer'
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addCommentHandler(e);
              }}
              disabled={!newComment.trim()}
              className={`px-4 py-2 rounded-md cursor-pointer ${
                newComment.trim() ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;