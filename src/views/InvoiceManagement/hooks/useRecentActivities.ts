import { useApiData } from './useApiData';

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
  const { data, loading, error, refetch } = useApiData<ActivityItem[]>(
    'http://localhost:3001/recentActivities',
    {
      errorMessage: 'Failed to load recent activities.'
    }
  );

  return {
    activities: data || [],
    loading,
    error,
    refetch
  };
};