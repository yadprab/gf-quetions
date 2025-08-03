import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

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
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: T = await response.json();
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