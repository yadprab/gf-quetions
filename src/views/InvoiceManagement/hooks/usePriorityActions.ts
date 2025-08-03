import { useState, useEffect } from 'react';

export interface PriorityAction {
  id: string;
  title: string;
  count: string;
  priority: 'high' | 'medium' | 'low';
}

export const usePriorityActions = () => {
  const [actions, setActions] = useState<PriorityAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/priorityActions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch priority actions');
        }
        
        const data: PriorityAction[] = await response.json();
        setActions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching priority actions:', err);
        setError('Failed to load priority actions.');
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  return {
    actions,
    loading,
    error
  };
};