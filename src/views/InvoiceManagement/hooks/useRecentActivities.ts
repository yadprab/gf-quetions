import { useState, useEffect } from 'react';

interface ActivityItem {
  id: string;
  type: 'payment_received' | 'invoice_disputed' | 'follow_up_sent' | 'status_updated';
  title: string;
  customer: string;
  amount: {
    value: number;
    unit: string;
  };
  timestamp: string;
  variant: 'success' | 'danger' | 'primary' | 'warning';
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/recentActivities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data: ActivityItem[] = await response.json();
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        setError('Failed to load recent activities.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);


  return {
    activities,
    loading,
    error
  };
};