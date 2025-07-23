import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../../components/ThemeToggle';

type UserSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  appearance: {
    theme: 'light' | 'dark' | 'system';
  };
  preferences: Record<string, any>;
};

const SettingsPage = () => {
  const { tab = 'profile' } = useParams();
  const navigate = useNavigate();
  const { theme, setTheme, isDark } = useTheme();
  
  // Complex state that should be normalized
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Side effect with missing dependencies
  useEffect(() => {
    // Mock API call with proper error handling
    const fetchSettings = async () => {
      try {
        // Mock data instead of real API call
        const mockData = {
          notifications: {
            email: true,
            push: false,
            sms: false,
          },
          theme: 'light' as const,
          preferences: {}
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setSettings(mockData);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    
    fetchSettings();
    
    // Analytics side effect - should be in a separate effect
    trackPageView('settings');
    
    // Missing cleanup
  }, []);
  
  // Inefficient handler that recreates function on every render
  const handleInputChange = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [key]: value
      }
    }));
  };
  
  // Complex save handler with race condition potential
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Mock save operation instead of real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate successful save
      showToast('Settings saved successfully');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setSaveError(errorMessage);
      
      // Side effect in catch block
      logError('SettingsSaveError', err);
    } finally {
      setIsSaving(false);
    }
  };
  

  
  // Complex render logic that should be a separate component
  const renderTabContent = () => {
    switch (tab) {
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <label className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Email Notifications
                  </label>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive notifications via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications?.email ?? false}
                  onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <label className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Push Notifications
                  </label>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive push notifications in browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications?.push ?? false}
                  onChange={(e) => handleInputChange('notifications', 'push', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className={`flex items-center justify-between p-4 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <label className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    SMS Notifications
                  </label>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive notifications via SMS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications?.sms ?? false}
                  onChange={(e) => handleInputChange('notifications', 'sms', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Theme Settings
              </h3>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Current Theme
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {theme === 'system' ? 'System Default' : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
                <ThemeToggle size="lg" />
              </div>
            </div>

            <div>
              <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Theme Preference
              </h4>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className={`
                  w-full px-3 py-2 border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose your preferred theme. System Default will follow your operating system's theme setting.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <h4 className={`font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                Preview
              </h4>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                You're currently viewing the {isDark ? 'dark' : 'light'} theme. 
                Changes are applied immediately.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Settings
            </h3>
            
            <div className={`p-6 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Profile settings are coming soon. You'll be able to update your personal information, 
                profile picture, and account preferences here.
              </p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className={`max-w-4xl mx-auto p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
        </div>
        
        {/* Tabs */}
        <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {['profile', 'notifications'].map((tabName) => (
            <button
              key={tabName}
              onClick={() => navigate(`/settings/${tabName}`)}
              className={`
                px-6 py-3 font-medium transition-colors duration-200
                ${tab === tabName
                  ? `${isDark ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'}`
                  : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                }
              `}
            >
              {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {renderTabContent()}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`
                px-6 py-2 rounded-md font-medium transition-colors duration-200
                ${isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }
                ${isDark ? 'text-white focus:ring-offset-gray-800' : 'text-white'}
              `}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            
            {saveError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-700 dark:text-red-400">
                  Error: {saveError}
                </p>
              </div>
            )}
          </div>
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
