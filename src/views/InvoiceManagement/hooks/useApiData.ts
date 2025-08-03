import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../../services/index.js';

interface UseApiDataOptions {
  showErrorToast?: boolean;
  errorMessage?: string;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useApiData = <T>(
  endpoint: string,
  options: UseApiDataOptions = {}
): UseApiDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    showErrorToast = true, 
    errorMessage = 'Failed to fetch data. Please try again.' 
  } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      const result: T = await api.get(endpoint);
      setData(result);
      setError(null);
    } catch (err) {
      setError(errorMessage);
      
      if (showErrorToast) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};