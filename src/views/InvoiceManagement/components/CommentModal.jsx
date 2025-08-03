import React, { useState, useEffect } from 'react';
import { fetchComments, addComment } from '../../../services/Api';

const CommentModal = ({ isOpen, onClose, invoiceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchCommentsData();
    }
  }, [isOpen, invoiceId]);

  const fetchCommentsData = async () => {
    try {
      setLoading(true);
      const data = await fetchComments(invoiceId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCommentHandler = async () => {
    if (!newComment.trim()) return;

    try {
      const newCommentData = await addComment(invoiceId, newComment.trim());
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '500px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Comments - Invoice #{invoiceId}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '16px',
          minHeight: '200px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No comments yet
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={index} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  {comment.author || 'Anonymous'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#4a5568',
                  marginBottom: '4px'
                }}>
                  {comment.text}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#718096'
                }}>
                  {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Just now'}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '8px',
              border: '1px solid #d2d6dc',
              borderRadius: '4px',
              resize: 'vertical',
              fontSize: '14px',
              marginBottom: '12px'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #d2d6dc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={addCommentHandler}
              disabled={!newComment.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                opacity: newComment.trim() ? 1 : 0.6
              }}
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