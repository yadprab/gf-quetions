import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../../services/index.js';

export const useFetchData = (endpoint, options = {}) => {
  const {
    dataProcessor = (data) => data, 
    collaboratorSimulation = false,
    entityName = 'item' 
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.get(endpoint);
      const processedData = dataProcessor(result);
      
      setData(processedData);
      setLastUpdated(new Date());
      
      // Simulate collaborators if enabled
      if (collaboratorSimulation && processedData.length > 0) {
        const simulatedCollaborators = {};
        const actions = ['editing', 'reviewing', 'commenting on'];
        const names = ['Alex Johnson', 'Sam Wilson', 'Taylor Smith', 'Jordan Lee'];
        
        processedData.slice(0, 3).forEach(item => {
          simulatedCollaborators[item.id] = {
            name: names[Math.floor(Math.random() * names.length)],
            action: actions[Math.floor(Math.random() * actions.length)]
          };
        });
        
        setCollaborators(simulatedCollaborators);
      }
      
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${entityName}s:`, err);
      setError(`Failed to load ${entityName}s. Please try again.`);
      toast.error(`Failed to load ${entityName}s. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, dataProcessor, collaboratorSimulation, entityName]);

  const updateItem = useCallback(async (itemId, field, value) => {
    try {
      const updateEndpoint = endpoint.includes('?') 
        ? `${endpoint.split('?')[0]}/${itemId}/${field}`
        : `${endpoint}/${itemId}/${field}`;
        
      await fetch(updateEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [field]: value })
      });
      
      setData(prevData =>
        prevData.map(item =>
          item.id === itemId
            ? { ...item, [field]: value, updatedAt: new Date() }
            : item
        )
      );
      toast.success(`${entityName} updated successfully`);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
      toast.error(`Failed to update ${entityName}`);
      fetchData(); // Refetch on error
    }
  }, [endpoint, entityName, fetchData]);

  const deleteItems = useCallback(async (itemIds) => {
    try {
      const baseEndpoint = endpoint.includes('?') ? endpoint.split('?')[0] : endpoint;
      
      await Promise.all(
        itemIds.map(id => api.delete(`${baseEndpoint}/${id}`))
      );
      
      fetchData();
      toast.success(`${entityName}s deleted successfully`);
    } catch (err) {
      console.error(`Error deleting ${entityName}s:`, err);
      toast.error(`Failed to delete ${entityName}s. Please try again.`);
      throw new Error(`Failed to delete ${entityName}s. Please try again.`);
    }
  }, [endpoint, entityName, fetchData]);

  return {
    data,
    loading,
    error,
    collaborators,
    lastUpdated,
    fetchData,
    updateItem,
    deleteItems,
    setData
  };
};