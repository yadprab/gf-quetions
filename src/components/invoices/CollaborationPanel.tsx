import React from 'react';

interface CollaborationPanelProps {
  collaborators: Record<string, any>;
  selectedInvoices: string[];
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  collaborators,
  selectedInvoices
}) => {
  const activeCollaborators = Object.entries(collaborators).filter(([_, collaborator]) => {
    const timestamp = new Date(collaborator.timestamp);
    const now = new Date();
    const diffInSeconds = (now.getTime() - timestamp.getTime()) / 1000;
    return diffInSeconds < 30; // Only show recent activity
  });

  return (
    <div className="collaboration-panel bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Team Activity</h3>
      
      {activeCollaborators.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">👥</div>
          <p>No active collaboration</p>
          <p className="text-sm">Team members will appear here when they're working on invoices</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCollaborators.map(([invoiceId, collaborator]) => (
            <div
              key={invoiceId}
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {collaborator.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {collaborator.name}
                </p>
                <p className="text-xs text-gray-600">
                  {collaborator.action} invoice
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(collaborator.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      )}

      {selectedInvoices.length > 0 && (
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Invoices ({selectedInvoices.length})
          </h4>
          <div className="space-y-1">
            {selectedInvoices.slice(0, 3).map((invoiceId) => (
              <div key={invoiceId} className="text-xs text-gray-600">
                Invoice {invoiceId}
              </div>
            ))}
            {selectedInvoices.length > 3 && (
              <div className="text-xs text-gray-500">
                +{selectedInvoices.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">
          💡 Collaboration Tips
        </h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Click on invoices to view details</li>
          <li>• Use filters to find specific invoices</li>
          <li>• Update status to keep team informed</li>
          <li>• Add comments for better communication</li>
        </ul>
      </div>
    </div>
  );
}; 