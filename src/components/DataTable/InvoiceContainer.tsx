import React, { useState, useEffect, useMemo } from 'react';
import { initialInvoices, formatCurrency, getDaysOverdue } from './InvoiceUtils.ts';
import './Invoice.css';

type InvoiceProps = {
};

type Invoice = {
  id: number; 
  customer: {
    name: string;
  }; 
  amount: number;
  dueDate: string;  
  status: string;
  lastUpdated?: Date;
  daysOverdue?: number;
  comments: string;
};

const PAGE_SIZE = 5;

const InvoiceContainer = (props: InvoiceProps) => {

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true);

  const totalPages = Math.ceil(invoices.length / PAGE_SIZE);

  //Fetch invoice data on initial rendering
  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [invoices]);

  const fetchInvoices = () => {
    const now: Date = new Date();
    const processedInvoices = initialInvoices.map((invoice: Invoice) => ({
      ...invoice,
      lastUpdated: new Date(now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 2)),
      daysOverdue: getDaysOverdue(invoice.dueDate),
      comments: invoice.comments ?? ''
    }));

    setInvoices(processedInvoices);
    setLastUpdated(new Date());
  };

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return invoices.slice(start, start + PAGE_SIZE);
  }, [invoices, currentPage]);

  // Invoice status update
  const handleStatusUpdate = (invoiceId: number, newStatus: string) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(invoice =>
        invoice.id === invoiceId
          ? { ...invoice, status: newStatus, lastUpdated: new Date() }
          : invoice
      )
    );
  };

  //sort by invoice id, customer name, amount, due date, status
  const handleSort = (key: string) => {
    const sortedInvoices = [...invoices].sort((a, b) => {
      if (key === 'amount') {
        return a.amount - b.amount;
      } else if (key === 'dueDate') {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return aDate - bDate;
      } else if (key === 'lastUpdated') {
        const aDate = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const bDate = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return aDate - bDate;
      } else if (key === 'customer.name') {
        return a.customer.name.localeCompare(b.customer.name);
      } else if (key === 'id') {
        return a.id - b.id;
      } else if (key === 'status') {
        return a.status.localeCompare(b.status);
      } else {
        return 0;
      }
    });
    setInvoices(sortedInvoices);
    setIsAscending(false);
  };

  const handleSortDesc = (key: string) => {
    const sortedInvoices = [...invoices].sort((a, b) => {
      if (key === 'amount') {
        return b.amount - a.amount;
      } else if (key === 'dueDate') {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return bDate - aDate;
      } else if (key === 'lastUpdated') {
        const aDate = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const bDate = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return bDate - aDate;
      } else if (key === 'customer.name') {
        return b.customer.name.localeCompare(a.customer.name);
      } else if (key === 'id') {
        return b.id - a.id;
      } else if (key === 'status') {
        return b.status.localeCompare(a.status);
      } else {
        return 0;
      }
    });
    setInvoices(sortedInvoices);
    setIsAscending(true);
  };

  const handleSearch = (searchTerm: string) => {
    let filteredInvoices = initialInvoices;
    if (searchTerm.length > 0) {
      filteredInvoices = invoices.filter(invoice => {
        return (
          invoice.id.toString().includes(searchTerm) ||
          invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.amount.toString().includes(searchTerm) ||
          new Date(invoice.dueDate).toLocaleDateString().includes(searchTerm) ||
          invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    setInvoices(filteredInvoices);
  };

  const renderSortButton = (key: string) => (
    <>
      {isAscending ? (
        <button
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Sort ascending"
          onClick={() => handleSort(key)}
        >
          ▲
        </button>
      ) : (
        <button
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Sort descending"
          onClick={() => handleSortDesc(key)}
        >
          ▼
        </button>
      )}
    </>
  );

  return (
    <div>
      <div className='invoiceTable'>
        <div>
          <input
            type="text"
            placeholder="Search invoices..."
            className='search-input'
            onChange={(e) => handleSearch(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>
                  Invoice No.
                  {renderSortButton('id')}
                </th>
                <th>
                  Customer
                  {renderSortButton('customer.name')}
                </th>
                <th>
                  Amount
                  {renderSortButton('amount')}
                </th>
                <th>
                  Due Date
                  {renderSortButton('dueDate')}
                </th>
                <th>
                  Status
                  {renderSortButton('status')}
                </th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td>No invoices found</td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.customer?.name || 'N/A'}</td>
                    <td>
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td>
                      <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
                      {invoice.daysOverdue! > 0 && (
                        <div>
                          {invoice.daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        value={invoice.status}
                        className='status-select'
                        onChange={(e) => handleStatusUpdate(invoice.id, e.target.value)}
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td>
                      <input type="text" placeholder="Add a comment" className='comment' />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
           <div className='page'>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pageNo">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="last-updated">
            Last Modified on: {lastUpdated.toLocaleTimeString()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceContainer;