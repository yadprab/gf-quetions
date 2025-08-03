import { useApiData } from "./useApiData";
import { type MetricData } from "../utils/helpers";

interface InvoiceMetricsResponse {
    metrics: MetricData[];
    lastUpdated: string;
}

export const useInvoiceMetrics = () => {
    const { data, loading, error, refetch } = useApiData<InvoiceMetricsResponse>(
        'http://localhost:3001/invoiceMetricsData',
        {
            errorMessage: 'Failed to load metrics. Please try again.'
        }
    );

    return {
        metrics: data?.metrics || [],
        loading,
        error,
        refetch
    };
};