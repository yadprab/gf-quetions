import { formatValue } from "../../utils/formatting"
import { getIcon, getChangeIndicator, getRandomGradient } from "./utils/helpers"
import { useInvoiceMetrics } from "./hooks/useInvoiceMetrics"
import Loader from "./components/Loader"

const InvoiceMetrics = () => {
    const { metrics, loading } = useInvoiceMetrics();

    if (loading) {
        return <Loader variant="metrics" />;
    }

    return (
        <div className="flex gap-4 mt-5">
            {metrics.map((metric) => (
                <div key={metric.id} className="flex flex-col w-1/4 gap-2 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${getRandomGradient()} p-2 rounded-lg w-10 h-10`}>
                            {getIcon(metric.icon)}
                        </div>
                        <div className="flex items-center gap-2">{getChangeIndicator(metric)}</div>
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                        <p className="text-sm text-gray-500">{metric.title}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold">{formatValue(metric)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default InvoiceMetrics