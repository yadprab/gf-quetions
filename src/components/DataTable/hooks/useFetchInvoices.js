import { useState, useCallback } from 'react';
import { getDaysOverdue } from '../utils/helperFunctions';

export const useFetchInvoices = (endpoint) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      const now = new Date();
      
      const processedInvoices = result.map(invoice => ({
        ...invoice,
        lastUpdated: new Date(now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 2)),
        daysOverdue: getDaysOverdue(invoice.dueDate)
      }));
      
      setInvoices(processedInvoices);
      setLastUpdated(new Date());
      
      const simulatedCollaborators = {};
      const actions = ['editing', 'reviewing', 'commenting on'];
      const names = ['Alex Johnson', 'Sam Wilson', 'Taylor Smith', 'Jordan Lee'];
      
      processedInvoices.slice(0, 3).forEach(invoice => {
        simulatedCollaborators[invoice.id] = {
          name: names[Math.floor(Math.random() * names.length)],
          action: actions[Math.floor(Math.random() * actions.length)]
        };
      });
      
      setCollaborators(simulatedCollaborators);
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const updateInvoiceStatus = useCallback(async (invoiceId, newStatus) => {
    try {
      await fetch(`${endpoint}/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === invoiceId
            ? { ...invoice, status: newStatus, updatedAt: new Date() }
            : invoice
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      fetchInvoices();
    }
  }, [endpoint, fetchInvoices]);

  const deleteInvoices = useCallback(async (invoiceIds) => {
    try {
      await Promise.all(
        invoiceIds.map(id => 
          fetch(`${endpoint}/${id}`, { 
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        )
      );
      
      fetchInvoices();
    } catch (err) {
      console.error('Error deleting invoices:', err);
      throw new Error('Failed to delete invoices. Please try again.');
    }
  }, [endpoint, fetchInvoices]);

  return {
    invoices,
    loading,
    error,
    collaborators,
    lastUpdated,
    fetchInvoices,
    updateInvoiceStatus,
    deleteInvoices,
    setInvoices
  };
};