import { formatValue } from '../../utils/formatting'
import { getVariantColor } from './utils/helpers'
import { useRecentActivities } from './hooks/useRecentActivities'
import Loader from './components/Loader'

const RecentActivity = () => {
  const { activities, loading } = useRecentActivities();

  const formatAmount = (amount: { value: number; unit: string }) => {
    return formatValue({
      type: 'currency',
      value: amount.value,
      unit: amount.unit
    });
  };

  if (loading) {
    return <Loader variant="card" title="Recent Activity" />;
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden p-6'>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No recent activities</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex justify-between items-start bg-gray-50 p-2 rounded-md">
              <div className="flex-1">
                <p className={`font-medium ${getVariantColor(activity.variant)} mb-1`}>
                  {activity.title}
                </p>
                <p className="text-gray-600 text-sm">
                  {activity.customer} • {formatAmount(activity.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentActivity