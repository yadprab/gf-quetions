import { useState } from 'react';
import { commentsAPI } from '../../../services/index.js';

interface Comment {
  id: string;
  invoiceId: string;
  author: string;
  text: string;
  timestamp: string;
}

export const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async (invoiceId: string): Promise<Comment[]> => {
    try {
      setLoading(true);
      setError(null);
      const comments = await commentsAPI.getComments(invoiceId);
      return comments;
    } catch (err) {
      const errorMessage = 'Failed to load comments. Please try again.';
      setError(errorMessage);
      console.error('Error fetching comments:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (invoiceId: string, text: string, author: string = 'Current User'): Promise<Comment | null> => {
    try {
      setError(null);
      const newComment = await commentsAPI.addComment(invoiceId, text, author);
      return newComment;
    } catch (err) {
      const errorMessage = 'Failed to add comment. Please try again.';
      setError(errorMessage);
      console.error('Error adding comment:', err);
      return null;
    }
  };

  return {
    loading,
    error,
    fetchComments,
    addComment
  };
};