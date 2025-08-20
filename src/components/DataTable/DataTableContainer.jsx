import React, { useState, useMemo, useEffect } from "react";
import { format, differenceInDays } from "date-fns";

const DataTableContainer = ({ invoices, onUpdateInvoice }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "ALL" });
  const [sortKey, setSortKey] = useState("dueDate"); 
  const [sortOrder, setSortOrder] = useState("asc"); 

  const filteredInvoices = useMemo(() => {
    let result = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filters.status === "ALL" || invoice.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === "dueDate") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [invoices, searchTerm, filters, sortKey, sortOrder]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Checking for updates...");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (onUpdateInvoice) {
      onUpdateInvoice(id, { status: newStatus });
    }
  };

  const handleComment = (id) => {
    const comment = prompt("Enter your comment:");
    if (comment && onUpdateInvoice) {
      onUpdateInvoice(id, { comment });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by customer or invoice #"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            maxWidth: "400px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          style={{
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
            <th onClick={() => handleSort("invoiceNumber")}>Invoice #</th>
            <th onClick={() => handleSort("customerName")}>Customer</th>
            <th onClick={() => handleSort("amount")}>Amount</th>
            <th onClick={() => handleSort("dueDate")}>Due Date</th>
            <th>Days Overdue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => {
            const daysOverdue = differenceInDays(
              new Date(),
              new Date(invoice.dueDate)
            );
            return (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.customerName}</td>
                <td>₹{invoice.amount}</td>
                <td>{format(new Date(invoice.dueDate), "dd-MMM-yyyy")}</td>
                <td>{daysOverdue > 0 ? daysOverdue : 0}</td>
                <td>
                  <select
                    value={invoice.status}
                    onChange={(e) =>
                      handleStatusChange(invoice.id, e.target.value)
                    }
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleComment(invoice.id)}>
                    Add Comment
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableContainer;
