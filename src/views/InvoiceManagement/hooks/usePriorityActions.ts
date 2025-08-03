import { useApiData } from './useApiData';

export interface PriorityAction {
  id: string;
  title: string;
  count: string;
  priority: 'high' | 'medium' | 'low';
}

export const usePriorityActions = () => {
  const { data, loading, error, refetch } = useApiData<PriorityAction[]>(
    '/priorityActions',
    {
      errorMessage: 'Failed to load priority actions.'
    }
  );

  return {
    actions: data || [],
    loading,
    error,
    refetch
  };
};