import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../../widgets/button";
import { fetchSettings, saveSettings } from '../../services/apiService';
import type { UserSettings } from '../../types';

const SettingsPage = () => {
  const { tab = 'profile' } = useParams();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<UserSettings>({
    notifications: { email: false, push: false, sms: false },
    theme: 'light',
    preferences: {},
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleInputChange = useCallback((section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const updatedSettings = await saveSettings(settings);
      setSettings(updatedSettings);
      // showToast('Settings saved successfully'); // Re-enable if you have a toast notification system
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An unknown error occurred');
      // logError('SettingsSaveError', err); // Re-enable if you have an error logging system
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderTabContent = () => {
    switch (tab) {
      case 'notifications':
        return (
          <div>
            <h3 className="text-xl font-bold mb-2.5">Notification Settings</h3>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications?.email ?? false}
                  onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                />
                Email Notifications
              </label>
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
            <h3 className="text-xl font-bold mb-2.5">Appearance</h3>
            <select
              value={settings.theme}
              onChange={(e) => handleInputChange('theme', 'theme', e.target.value)} // Changed section to 'theme'
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
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">Settings</h1>
      
      <div className="flex mb-5">
        {['profile', 'notifications', 'appearance'].map((tabName) => (
          <Button
            key={tabName}
            className={`px-5 py-2.5 border-none rounded-t-md mr-1.25 ${tab === tabName ? 'bg-primary text-white' : 'bg-transparent text-foreground'}`}
            onClick={() => navigate(`/settings/${tabName}`)}
            color={tab === tabName ? "primary" : "light"}
            size="md"
          >
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
          </Button>
        ))}
      </div>
      
      <div className="border border-gray-300 p-5 rounded-b-md rounded-tr-md">
        {renderTabContent()}
        
        <div className="mt-5">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            color="primary"
            size="md"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          
          {saveError && (
            <div className="text-danger mt-2.5">
              Error: {saveError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;