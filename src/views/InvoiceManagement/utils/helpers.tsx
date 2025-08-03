import { PiClock, PiCurrencyDollar, PiUsers, PiTrendUp } from "react-icons/pi"

export interface MetricData {
    id: string;
    title: string;
    icon: string;
    type: 'currency' | 'percentage' | 'number' | 'duration';
    value: number;
    currency?: string;
    unit?: string;
    changePercent?: number;
    changeValue?: number;
    changeDirection: 'increase' | 'decrease';
}

export const getIcon = (iconName: string) => {
    const iconMap = {
        'currency-dollar': <PiCurrencyDollar className="text-2xl text-white" />,
        'trending-up': <PiTrendUp className="text-2xl text-white" />,
        'users': <PiUsers className="text-2xl text-white" />,
        'clock': <PiClock className="text-2xl text-white" />
    };
    return iconMap[iconName as keyof typeof iconMap] || <PiCurrencyDollar className="text-2xl text-white" />;
};

export const getChangeIndicator = (metric: MetricData) => {
    const changeValue = metric.changePercent || metric.changeValue;
    if (!changeValue) return null;

    const isPositive = metric.changeDirection === 'increase';
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    const symbol = isPositive ? '+' : '-';
    const suffix = metric.changePercent ? '%' : '';

    return (
        <span className={`text-xs ${color} font-medium`}>
            {symbol} {Math.abs(changeValue)}{suffix}
        </span>
    );
};

export const getRandomGradient = () => {
    const gradients = [
        'bg-gradient-to-r from-rose-500 to-rose-600',
        'bg-gradient-to-r from-blue-500 to-blue-600',
        'bg-gradient-to-r from-green-500 to-green-600',
        'bg-gradient-to-r from-purple-500 to-purple-600'
    ];
    
    return gradients[Math.floor(Math.random() * gradients.length)];
};