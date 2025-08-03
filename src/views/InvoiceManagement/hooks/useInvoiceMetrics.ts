import { useState, useEffect } from "react";
import { type MetricData } from "../utils/helpers";

interface InvoiceMetricsResponse {
    metrics: MetricData[];
    lastUpdated: string;
}

export const useInvoiceMetrics = () => {
    const [metrics, setMetrics] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/invoiceMetricsData');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch metrics');
                }
                
                const data: InvoiceMetricsResponse = await response.json();
                setMetrics(data.metrics);
                setError(null);
            } catch (err) {
                console.error('Error fetching invoice metrics:', err);
                setError('Failed to load metrics. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return {
        metrics,
        loading,
        error
    };
};