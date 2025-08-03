import { useApiData } from "./useApiData";
import { type MetricData } from "../utils/helpers";

interface InvoiceMetricsResponse {
    metrics: MetricData[];
    lastUpdated: string;
}

export const useInvoiceMetrics = () => {
    const { data, loading, error, refetch } = useApiData<InvoiceMetricsResponse>(
        '/invoiceMetricsData',
        {
            errorMessage: 'Failed to load invoice metrics. Please try again.'
        }
    );

    return {
        metrics: data?.metrics || [],
        loading,
        error,
        refetch,
        lastUpdated: data?.lastUpdated
    };
};