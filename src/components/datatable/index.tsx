import { useState, useEffect, useCallback, useMemo } from "react";
import { RiSearchLine } from "react-icons/ri";
import { GoComment } from "react-icons/go";

import Button from "../../widgets/button";
import type { Invoice } from "../../types";
import { formatCurrency, getDaysOverdue } from "../../utils/formatting";
import { fetchInvoiceData } from "../../services/apiService";
import type { INVOICE_MANAGEMENT_MOCK_DATA } from "../../mock";
import { StatusChip } from "../../widgets/status_chip";
import { STATUS_CHIP_TYPES } from "../../widgets/status_chip/constants";

const STATUS_TYPE = {
  Paid: STATUS_CHIP_TYPES.SUCCESS,
  Overdue: STATUS_CHIP_TYPES.ERROR,
  Pending: STATUS_CHIP_TYPES.WARNING,
  Disputed: STATUS_CHIP_TYPES.INFO,
};

export const DataTableContainer = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchInvoiceData();

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      const now = new Date();

      const processedInvoices: Invoice[] = (
        result as typeof INVOICE_MANAGEMENT_MOCK_DATA
      ).data.map((invoice) => ({
        ...invoice,
        id: invoice.id,
        lastUpdated: new Date(
          now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 2)
        ),
        daysOverdue: getDaysOverdue(invoice.dueDate),
      }));

      setInvoices(processedInvoices);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

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

    if (statusFilter) {
      result = result.filter((invoice) => invoice.status === statusFilter);
    }

    return result;
  }, [invoices, searchTerm, statusFilter]);

  if (loading && invoices.length === 0) {
    return (
      <div className="flex justify-center items-center h-72">
        <div>Loading invoices...</div>
      </div>
    );
  }

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

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <div className="mb-5 md:flex grid items-center gap-4 justify-between">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Invoice Management
        </h2>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 fill-gray-500" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 border border-gray-300 rounded-md text-sm pl-10"
            />
          </div>
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-card text-sm cursor-pointer text-gray-500"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Disputed">Disputed</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-card border-b border-gray-300 text-left text-gray-500">
                <th className="py-6 px-4 md:px-0 cursor-pointer font-medium">
                  Invoice ID
                </th>
                <th className="py-6 px-4 md:px-0 cursor-pointer font-medium">
                  Customer
                </th>
                <th className="py-6 px-4 md:px-0 cursor-pointer font-medium">
                  Amount
                </th>
                <th className="py-6 px-4 md:px-0 cursor-pointer font-medium">
                  Due Date
                </th>
                <th className="py-6 px-4 md:px-0 cursor-pointer font-medium">
                  Days Overdue
                </th>
                <th className="py-6 px-4 md:px-0 font-medium">Status</th>
                <th className="py-6 px-4 md:px-0 font-medium">Comments</th>
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
                    className={`border-b border-gray-300 bg-card hover:bg-gray-200`}
                  >
                    <td className="py-6 px-4 md:px-0 font-medium w-38">
                      {invoice.id}
                    </td>
                    <td className="py-6 px-4 md:px-0 text-gray-500  w-42">
                      {invoice.customer?.name || "N/A"}
                    </td>
                    <td className="py-6 px-4 md:px-0 font-medium w-38">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="py-6 px-4 md:px-0 text-gray-500 w-38">
                      <div>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-6 px-4 md:px-0 w-60">
                      {(invoice.daysOverdue || 0) > 0 ? (
                        <div className="text-sm text-red-500">
                          {invoice.daysOverdue} days overdue
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-6 px-4 md:px-0 w-38">
                      <StatusChip
                        type={STATUS_TYPE[invoice.status]}
                        content={invoice.status}
                      />
                    </td>
                    <td className="py-6 px-4 md:px-0 flex items-center gap-1 text-gray-500 w-38">
                      <GoComment />
                      {invoice.comments}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTableContainer;
