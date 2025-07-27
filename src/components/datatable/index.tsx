import { useState, useEffect, useCallback, useMemo } from "react";
import Button from "../../widgets/button";
import { STORAGE_KEYS } from "../../config";
import type { Invoice, InvoicesApiResponse } from "../../types";

export const DataTableContainer = ({
  endpoint,
  initialPageSize = 10,
}: {
  endpoint: string;
  initialPageSize?: number;
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<
    Record<string, { name: string; action: string }>
  >({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate days overdue
  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime: number = today.getTime() - due.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Get status style
  const getInvoiceStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      overdue: "bg-error/10 text-error",
      draft: "bg-info/10 text-info",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${endpoint}?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.token)}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      const now = new Date();

      const processedInvoices: Invoice[] = (
        result as InvoicesApiResponse
      ).data.map((invoice: Invoice) => ({
        ...invoice,
        lastUpdated: new Date(
          now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 2)
        ),
        daysOverdue: getDaysOverdue(invoice.dueDate),
      }));

      setInvoices(processedInvoices);
      setLastUpdated(new Date());

      // Simulate collaborators
      const simulatedCollaborators: Record<
        string,
        { name: string; action: string }
      > = {};
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
  }, [endpoint, page, pageSize]);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle status update
  const handleStatusUpdate = async (invoiceId: string, newStatus: string) => {
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
      const response = await fetch(`${endpoint}/${invoiceId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.token)}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
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
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [invoices, searchTerm, filters, sortConfig]);

  // Handle row selection
  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (
    action: "delete" | "export" | `status:${string}`
  ) => {
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

        await Promise.all(
          selectedInvoices.map((id) =>
            fetch(`${endpoint}/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.token)}`,
              },
            })
          )
        );

        setSelectedInvoices([]);
        fetchInvoices();
      } else if (action === "export") {
        // Implement export functionality
        console.log("Exporting:", selectedInvoices);
      } else if (action.startsWith("status:")) {
        const newStatus = action.split(":")[1];
        await Promise.all(
          selectedInvoices.map((id) =>
            fetch(`${endpoint}/${id}/status`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.token)}`,
              },
              body: JSON.stringify({ status: newStatus }),
            })
          )
        );
        fetchInvoices();
        setSelectedInvoices([]);
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
      <div className="flex justify-center items-center h-72">
        <div>Loading invoices...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-5 bg-error/10 text-error rounded-lg my-5">
        {error}
        <Button
          onClick={fetchInvoices}
          className="ml-2.5"
          color="danger"
          size="sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Render the main component
  return (
    <div className="p-5">
      {/* Search and Filter Bar */}
      <div className="mb-5 flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search invoices by customer, invoice #, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-md text-sm"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={filters.status || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="px-3 py-2 border border-border rounded-md bg-card text-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>

          <Button
            onClick={fetchInvoices}
            color="light"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <span>⟳</span> Refresh
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-background border-b border-border text-left">
                <th className="p-3 w-10">
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
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Invoice #
                </th>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("customer.name")}
                >
                  Customer
                </th>
                <th
                  className="p-3 text-right cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </th>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                </th>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    No invoices found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredAndSortedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className={`border-b border-border ${
                      selectedInvoices.includes(invoice.id)
                        ? "bg-blue-50"
                        : "bg-background"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => toggleInvoiceSelection(invoice.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-4 font-medium">{invoice.id}</td>
                    <td className="p-4">{invoice.customer?.name || "N/A"}</td>
                    <td className="p-4 text-right font-medium">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="p-4">
                      <div>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                      {(invoice.daysOverdue || 0) > 0 && (
                        <div className="text-sm text-error">
                          {invoice.daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          handleStatusUpdate(invoice.id, e.target.value)
                        }
                        className={`p-1 rounded border border-border min-w-[100px] cursor-pointer hover:opacity-90 ${getInvoiceStatusStyle(
                          invoice.status
                        )}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view action
                            console.log("View invoice:", invoice.id);
                          }}
                          color="info"
                          size="sm"
                        >
                          View
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit action
                            console.log("Edit invoice:", invoice.id);
                          }}
                          color="warning"
                          size="sm"
                        >
                          Edit
                        </Button>
                      </div>
                      {collaborators[invoice.id] && (
                        <div className="text-xs text-secondary mt-1 flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                          {collaborators[invoice.id].name} is {""}
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
        <div className="flex justify-between items-center p-4 border-t border-border bg-background">
          <div className="text-sm text-secondary">
            {selectedInvoices.length > 0
              ? `${selectedInvoices.length} selected`
              : `Showing ${filteredAndSortedInvoices.length} invoices`}
            {lastUpdated && (
              <span className="ml-4 text-xs text-secondary">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="p-1.5 rounded border border-border bg-card cursor-pointer text-sm"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                color="light"
                size="sm"
              >
                Previous
              </Button>

              <div className="min-w-[24px] text-center text-sm text-secondary">
                {page}
              </div>

              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={filteredAndSortedInvoices.length < pageSize}
                color="light"
                size="sm"
              >
                Next
              </Button>
            </div>

            {selectedInvoices.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkAction("export")}
                  color="info"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <span>📤</span> Export
                </Button>
                <Button
                  onClick={() => handleBulkAction("delete")}
                  color="danger"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <span>🗑️</span> Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar for selected invoices */}
      {selectedInvoices.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-card px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <div className="font-medium text-foreground">
            {selectedInvoices.length} invoice
            {selectedInvoices.length > 1 ? "s" : ""} selected
          </div>
          <div className="flex gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkAction(`status:${e.target.value}`);
                  e.target.value = "";
                }
              }}
              className="p-1.5 rounded border border-border bg-card cursor-pointer text-sm"
            >
              <option value="">Update Status</option>
              <option value="paid">Mark as Paid</option>
              <option value="pending">Mark as Pending</option>
              <option value="overdue">Mark as Overdue</option>
              <option value="draft">Mark as Draft</option>
            </select>
            <Button
              onClick={() => handleBulkAction("export")}
              color="info"
              size="sm"
              className="flex items-center gap-1"
            >
              <span>📤</span> Export
            </Button>
            <Button
              onClick={() => handleBulkAction("delete")}
              color="danger"
              size="sm"
              className="flex items-center gap-1"
            >
              <span>🗑️</span> Delete
            </Button>
            <Button
              onClick={() => setSelectedInvoices([])}
              color="light"
              size="sm"
              className="ml-2 text-sm"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableContainer;