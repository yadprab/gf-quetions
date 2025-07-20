import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { AppContext } from "../../context/AppContext";
import { mockInvoices } from "./mock-invoices";

export const DataTableContainer = ({
  endpoint,
  columns,
  initialPageSize = 10,
}) => {
  // Context and state
  const { user } = useContext(AppContext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    amountRange: { min: 0, max: 100000 },
    daysOverdue: 0,
  });
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [collaborators, setCollaborators] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate days overdue
  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Get status style
  const getInvoiceStatusStyle = (status) => {
    const styles = {
      paid: { backgroundColor: "#e6fffa", color: "#234e52" },
      pending: { backgroundColor: "#feebc8", color: "#7b341e" },
      overdue: { backgroundColor: "#fed7d7", color: "#822727" },
      draft: { backgroundColor: "#ebf8ff", color: "#2c5282" },
    };
    return styles[status] || { backgroundColor: "#f7fafc", color: "#4a5568" };
  };

  // Get row style
  const getRowStyle = (invoice) => ({
    ...(selectedInvoices.includes(invoice.id) && {
      backgroundColor: "#f0f7ff",
    }),
    ...(invoice.daysOverdue > 30 && { borderLeft: "4px solid #c62828" }),
    ...(invoice.daysOverdue > 60 && { borderLeft: "4px solid #8e0000" }),
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  });

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = { data: mockInvoices };
      const now = new Date();

      // Process invoices
      const processedInvoices = result.data.map((invoice) => ({
        ...invoice,
        lastUpdated: new Date(
          now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 2)
        ),
        daysOverdue: getDaysOverdue(invoice.dueDate),
      }));

      setInvoices(processedInvoices);
      setLastUpdated(new Date());

      // Simulate collaborators
      const simulatedCollaborators = {};
      const actions = ["editing", "reviewing", "commenting on"];
      const names = [
        "Alex Johnson",
        "Sam Wilson",
        "Taylor Smith",
        "Jordan Lee",
      ];

      processedInvoices.slice(0, 3).forEach((invoice) => {
        simulatedCollaborators[invoice.id] = {
          name: names[Math.floor(Math.random() * names.length)],
          action: actions[Math.floor(Math.random() * actions.length)],
        };
      });

      setCollaborators(simulatedCollaborators);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle status update
  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      // Optimistic update
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === invoiceId
            ? { ...invoice, status: newStatus, lastUpdated: new Date() }
            : invoice
        )
      );

      // API call
      console.log(`Updating status for ${invoiceId} to ${newStatus}`);
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert on error
      fetchInvoices();
    }
  };

  // Filter and sort invoices
  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...invoices];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (invoice) =>
          invoice.customer?.name?.toLowerCase().includes(term) ||
          invoice.id.toLowerCase().includes(term) ||
          invoice.amount.toString().includes(term)
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter((invoice) => invoice.status === filters.status);
    }

    if (filters.amountRange) {
      result = result.filter(
        (invoice) =>
          invoice.amount >= filters.amountRange.min &&
          invoice.amount <= filters.amountRange.max
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [invoices, searchTerm, filters, sortConfig]);

  // Handle row selection
  const toggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedInvoices.length === 0) return;

    try {
      if (action === "delete") {
        if (
          !window.confirm(
            `Are you sure you want to delete ${selectedInvoices.length} selected invoices?`
          )
        ) {
          return;
        }

        console.log("Deleting invoices:", selectedInvoices);
        setInvoices(
          invoices.filter((inv) => !selectedInvoices.includes(inv.id))
        );
        setSelectedInvoices([]);
      } else if (action === "export") {
        // Implement export functionality
        console.log("Exporting:", selectedInvoices);
      } else {
        // Handle other bulk actions
        console.log("Bulk action:", action, "on", selectedInvoices);
      }
    } catch (err) {
      console.error("Error performing bulk action:", err);
      alert("Failed to perform bulk action. Please try again.");
    }
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Render loading state
  if (loading && invoices.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <div>Loading invoices...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff5f5",
          color: "#e53e3e",
          borderRadius: "8px",
          margin: "20px 0",
        }}
      >
        {error}
        <button
          onClick={fetchInvoices}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#fff",
            border: "1px solid #e53e3e",
            color: "#e53e3e",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Render the main component
  return (
    <div>
      {/* Search and Filter Bar */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Search invoices by customer, invoice #, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 16px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              backgroundColor: "white",
              color: "grey",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value || undefined,
              }))
            }
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
              color: "black",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>

          <button
            onClick={fetchInvoices}
            style={{
              padding: "8px 16px",
              backgroundColor: "white",
              color: "black",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
            }}
          >
            <span>⟳</span> Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1000px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "12px 16px", width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedInvoices.length > 0 &&
                      selectedInvoices.length ===
                        filteredAndSortedInvoices.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvoices(
                          filteredAndSortedInvoices.map((inv) => inv.id)
                        );
                      } else {
                        setSelectedInvoices([]);
                      }
                    }}
                  />
                </th>
                <th
                  style={{ padding: "12px 16px", cursor: "pointer" }}
                  onClick={() => handleSort("id")}
                >
                  Invoice #
                </th>
                <th
                  style={{ padding: "12px 16px", cursor: "pointer" }}
                  onClick={() => handleSort("customer.name")}
                >
                  Customer
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </th>
                <th
                  style={{ padding: "12px 16px", cursor: "pointer" }}
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                </th>
                <th
                  style={{ padding: "12px 16px", cursor: "pointer" }}
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th style={{ padding: "12px 16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "32px" }}
                  >
                    No invoices found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredAndSortedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    style={{
                      borderBottom: "1px solid #edf2f7",
                      backgroundColor: selectedInvoices.includes(invoice.id)
                        ? "#f0f9ff"
                        : "white",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => toggleInvoiceSelection(invoice.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td style={{ padding: "16px", fontWeight: "500" }}>
                      {invoice.id}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {invoice.customer?.name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        fontWeight: "500",
                      }}
                    >
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                      {invoice.daysOverdue > 0 && (
                        <div style={{ fontSize: "12px", color: "#e53e3e" }}>
                          {invoice.daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          handleStatusUpdate(invoice.id, e.target.value)
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #e2e8f0",
                          backgroundColor: getInvoiceStatusStyle(invoice.status)
                            .backgroundColor,
                          color: getInvoiceStatusStyle(invoice.status).color,
                          cursor: "pointer",
                          minWidth: "100px",
                          "&:hover": {
                            opacity: 0.9,
                          },
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view action
                            console.log("View invoice:", invoice.id);
                          }}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#ebf8ff",
                            color: "#3182ce",
                            border: "1px solid #bee3f8",
                            borderRadius: "4px",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#bee3f8",
                            },
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit action
                            console.log("Edit invoice:", invoice.id);
                          }}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#fefcbf",
                            color: "#975a16",
                            border: "1px solid #faf089",
                            borderRadius: "4px",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#faf089",
                            },
                          }}
                        >
                          Edit
                        </button>
                      </div>
                      {collaborators[invoice.id] && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#718096",
                            marginTop: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#48bb78",
                            }}
                          ></span>
                          {collaborators[invoice.id].name} is{" "}
                          {collaborators[invoice.id].action} this invoice
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderTop: "1px solid #edf2f7",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ fontSize: "14px", color: "#4a5568" }}>
            {selectedInvoices.length > 0
              ? `${selectedInvoices.length} selected`
              : `Showing ${filteredAndSortedInvoices.length} invoices`}
            {lastUpdated && (
              <span
                style={{
                  marginLeft: "16px",
                  fontSize: "12px",
                  color: "#a0aec0",
                }}
              >
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", color: "#4a5568" }}>
                Rows per page:
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "6px 12px",
                  backgroundColor: page === 1 ? "#edf2f7" : "white",
                  color: page === 1 ? "#a0aec0" : "#4a5568",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Previous
              </button>

              <div
                style={{
                  minWidth: "24px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#4a5568",
                }}
              >
                {page}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={filteredAndSortedInvoices.length < pageSize}
                style={{
                  padding: "6px 12px",
                  backgroundColor:
                    filteredAndSortedInvoices.length < pageSize
                      ? "#edf2f7"
                      : "white",
                  color:
                    filteredAndSortedInvoices.length < pageSize
                      ? "#a0aec0"
                      : "#4a5568",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  cursor:
                    filteredAndSortedInvoices.length < pageSize
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                }}
              >
                Next
              </button>
            </div>

            {selectedInvoices.length > 0 && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleBulkAction("export")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#ebf8ff",
                    color: "#2b6cb0",
                    border: "1px solid #bee3f8",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "14px",
                  }}
                >
                  <span>📤</span> Export
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#fff5f5",
                    color: "#e53e3e",
                    border: "1px solid #fed7d7",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "14px",
                  }}
                >
                  <span>🗑️</span> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar for selected invoices */}
      {selectedInvoices.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 1000,
          }}
        >
          <div style={{ fontWeight: "500" }}>
            {selectedInvoices.length} invoice
            {selectedInvoices.length > 1 ? "s" : ""} selected
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkAction(`status:${e.target.value}`);
                  e.target.value = "";
                }
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <option value="">Update Status</option>
              <option value="paid">Mark as Paid</option>
              <option value="pending">Mark as Pending</option>
              <option value="overdue">Mark as Overdue</option>
              <option value="draft">Mark as Draft</option>
            </select>
            <button
              onClick={() => handleBulkAction("export")}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ebf8ff",
                color: "#2b6cb0",
                border: "1px solid #bee3f8",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "14px",
              }}
            >
              <span>📤</span> Export
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              style={{
                padding: "6px 12px",
                backgroundColor: "#fff5f5",
                color: "#e53e3e",
                border: "1px solid #fed7d7",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "14px",
              }}
            >
              <span>🗑️</span> Delete
            </button>
            <button
              onClick={() => setSelectedInvoices([])}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f7fafc",
                color: "#4a5568",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "8px",
                fontSize: "14px",
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableContainer;
