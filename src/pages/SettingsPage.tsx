import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Lock, Bell, Shield } from 'lucide-react';

type SettingsSection = 'profile' | 'security' | 'notifications';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isPublic, setIsPublic] = useState(user?.is_public || false);
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [jobRecommendations, setJobRecommendations] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsChangingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const navItems = [
    { id: 'profile' as SettingsSection, label: 'Profile', icon: Shield },
    { id: 'security' as SettingsSection, label: 'Account Security', icon: Lock },
    { id: 'notifications' as SettingsSection, label: 'Notifications', icon: Bell },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account preferences and profile visibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Nav (Settings specific) */}
          <div className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <>
                <Card bordered>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" defaultValue={user?.display_name?.split(' ')[0]} />
                      <Input label="Last Name" defaultValue={user?.display_name?.split(' ').slice(1).join(' ')} />
                    </div>
                    <Input label="Email Address" defaultValue={user?.email} disabled />
                    <Input label="Bio" placeholder="Tell recruiters about yourself..." />
                  </CardBody>
                </Card>

                {user?.role === 'student' && (
                  <Card bordered>
                    <CardHeader>
                      <h2 className="text-lg font-bold text-gray-900">Privacy & Visibility</h2>
                      <p className="text-sm text-gray-500 mt-1">Control who can see your verified trust score.</p>
                    </CardHeader>
                    <CardBody>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                          <h3 className="font-medium text-gray-900">Public Profile</h3>
                          <p className="text-sm text-gray-500 mt-1">Allow recruiters to find you in Discovery.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    </CardBody>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <>
                <Card bordered>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your account password</p>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <Input
                      type="password"
                      label="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Input
                      type="password"
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      helperText="Must be at least 8 characters"
                    />
                    <Input
                      type="password"
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <div className="flex justify-end pt-2">
                      <Button
                        variant="primary"
                        onClick={handleChangePassword}
                        isLoading={isChangingPassword}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                      >
                        Change Password
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card bordered>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Enable 2FA</h3>
                        <p className="text-sm text-gray-500 mt-1">Require authentication code when signing in</p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Enable
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card bordered>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">Active Sessions</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage devices where you're logged in</p>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Device</p>
                            <p className="text-xs text-gray-500">Windows • Chrome</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-medium">Active Now</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                      Sign Out All Other Devices
                    </Button>
                  </CardBody>
                </Card>
              </>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <>
                <Card bordered>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">Email Notifications</h2>
                    <p className="text-sm text-gray-500 mt-1">Control what emails you receive from us</p>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500 mt-1">Receive emails about your account activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Application Updates</h3>
                        <p className="text-sm text-gray-500 mt-1">Get notified when your application status changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={applicationUpdates}
                          onChange={(e) => setApplicationUpdates(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Job Recommendations</h3>
                        <p className="text-sm text-gray-500 mt-1">Receive personalized job recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={jobRecommendations}
                          onChange={(e) => setJobRecommendations(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                        <p className="text-sm text-gray-500 mt-1">Receive updates about new features and events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={marketingEmails}
                          onChange={(e) => setMarketingEmails(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </CardBody>
                </Card>

                <Card bordered>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">Push Notifications</h2>
                    <p className="text-sm text-gray-500 mt-1">Configure push notifications on your devices</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Browser Notifications</h3>
                        <p className="text-sm text-gray-500 mt-1">Allow notifications in your browser</p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Enable
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving}>
                    Save Preferences
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;