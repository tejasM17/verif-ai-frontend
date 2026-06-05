import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { profileApi } from '../api/profile';
import toast from 'react-hot-toast';
import { Lock, Bell, Shield, Globe, User as UserIcon } from 'lucide-react';

type SettingsSection = 'profile' | 'security' | 'notifications';

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isPublic, setIsPublic] = useState(user?.is_public || false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [domain, setDomain] = useState(user?.domain || '');

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await profileApi.update({
        display_name: displayName,
        bio,
        location,
        domain,
        is_public: isPublic
      } as any); // Type cast if needed, but our updated API handles most of these

      if (response.success) {
        // Update local store user
        if (user) {
          setUser({
            ...user,
            display_name: displayName,
            bio,
            location,
            domain,
            is_public: isPublic
          });
        }
        toast.success('Settings saved successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your account preferences and profile visibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Nav */}
          <div className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 transition-all ${
                  activeSection === item.id
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:bg-slate-100 font-medium'
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
                <Card bordered className="rounded-3xl shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-6 border-b border-slate-50">
                    <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                  </CardHeader>
                  <CardBody className="p-6 space-y-6">
                    <div className="space-y-4">
                      <Input 
                        label="Display Name" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                      />
                      <Input label="Email Address" value={user?.email} disabled />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Location" 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Bangalore, Remote"
                        />
                        <Input 
                          label="Domain" 
                          value={domain} 
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="e.g. Engineering, Design"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Professional Bio</label>
                        <textarea
                          rows={4}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all resize-none"
                          placeholder="Tell recruiters about your verified expertise..."
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {user?.role === 'student' && (
                  <Card bordered className="rounded-3xl shadow-sm bg-white overflow-hidden border-indigo-100">
                    <CardHeader className="p-6 bg-indigo-50/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Globe className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">Privacy & Visibility</h2>
                          <p className="text-xs text-slate-500 font-medium">Control who can see your verified trust score.</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <h3 className="font-bold text-slate-900">Public Profile</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Allow recruiters to find you in Discovery.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                          />
                          <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </CardBody>
                  </Card>
                )}

                <div className="flex justify-end pt-2">
                  <Button 
                    variant="primary" 
                    onClick={handleSaveSettings} 
                    isLoading={isSaving}
                    className="rounded-xl px-10 h-12 shadow-lg shadow-indigo-500/20"
                  >
                    Save Profile Changes
                  </Button>
                </div>
              </>
            )}

            {/* Other sections can remain mostly as placeholders or be expanded if needed */}
            {activeSection !== 'profile' && (
              <Card bordered className="rounded-3xl bg-slate-50 border-dashed border-slate-200">
                <CardBody className="py-20 text-center">
                  <Lock className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Section Coming Soon</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
