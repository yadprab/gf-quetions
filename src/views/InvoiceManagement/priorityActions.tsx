import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { usePriorityActions } from './hooks/usePriorityActions';
import { getPriorityColor } from './utils/helpers';
import Loader from './components/Loader';

const PriorityActions: React.FC = () => {
  const { actions, loading } = usePriorityActions();

  if (loading) {
    return <Loader variant="card" title="Priority Actions" />;
  }


  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2">
        <RiErrorWarningLine className="text-orange-500 text-xl" />
        <h2 className="text-lg font-semibold text-gray-900">Priority Actions</h2>
      </div>
      
      <div className="space-y-4 mt-4">
        {actions.map((action, index) => (
          <div 
            key={action.id || index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900 mb-1">
                {action.title}
              </p>
              <p className="text-sm text-gray-500">
                {action.count}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(action.priority)}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityActions;