// Bad: Complex state management, side effects, and type issues
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Complex type that's not properly utilized
type UserSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    // Missing type for sms
  };
  theme: 'light' | 'dark' | 'system';
  // No type safety for preferences
  preferences: Record<string, any>;
};

const SettingsPage = () => {
  const { tab = 'profile' } = useParams();
  const navigate = useNavigate();
  
  // Complex state that should be normalized
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  useEffect(() => {
    // Mock settings data instead of API call
    const mockSettings = {
      notifications: {
        email: true,
        push: false
      },
      theme: 'light' as const,
      preferences: {}
    };
    
    setSettings(mockSettings);
    trackPageView('settings');
  }, []);
  
  // Inefficient handler that recreates function on every render
  const handleInputChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof UserSettings],
        [key]: value
      }
    }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Mock save success
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Settings saved successfully');
    } catch (err) {
      setSaveError((err as Error).message);
      logError('SettingsSaveError', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Inline styles that recreate objects on every render
  const tabStyle = (isActive: boolean) => ({
    padding: '10px 20px',
    border: 'none',
    background: isActive ? '#007bff' : 'transparent',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    borderRadius: '4px 4px 0 0',
    marginRight: '5px'
  });
  
  // Complex render logic that should be a separate component
  const renderTabContent = () => {
    switch (tab) {
      case 'notifications':
        return (
          <div>
            <h3>Notification Settings</h3>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications?.email ?? false}
                  onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                />
                Email Notifications
              </label>
              {/* Missing error handling for undefined settings */}
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications?.push ?? false}
                  onChange={(e) => handleInputChange('notifications', 'push', e.target.checked)}
                />
                Push Notifications
              </label>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div>
            <h3>Appearance</h3>
            <select
              value={settings.theme}
              onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        );
      default:
        return <div>Profile settings coming soon</div>;
    }
  };
  
  return (
    <div style={{ padding: '10px', width: '100vw', minHeight: 'calc(100vh - 60px)', boxSizing: 'border-box', margin: 0 }}>
      <h1>Settings</h1>
      
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        {['profile', 'notifications', 'appearance'].map((tabName) => (
          <button
            key={tabName}
            style={tabStyle(tab === tabName)}
            onClick={() => navigate(`/settings/${tabName}`)}
          >
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
          </button>
        ))}
      </div>
      
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '0 4px 4px 4px'
      }}>
        {renderTabContent()}
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          
          {saveError && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Error: {saveError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock functions that should be in a separate service
function trackPageView(page: string) {
  console.log(`Page viewed: ${page}`);
  // Analytics.track('page_view', { page });
}

function showToast(message: string) {
  console.log(`Toast: ${message}`);
  // Toast.show(message);
}

function logError(context: string, error: any) {
  console.error(`[${context}]`, error);
  // ErrorTracking.captureException(error, { context });
}

export default SettingsPage;