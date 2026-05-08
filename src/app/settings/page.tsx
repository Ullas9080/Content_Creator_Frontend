"use client";
import { API_BASE_URL } from '@/config/api';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocialAccountStore } from '@/store/useSocialAccountStore';
import { 
  User, Bell, Shield, LogOut, 
  ChevronRight, ExternalLink, Moon, 
  Smartphone, Globe, Mail, Lock, CreditCard, Key, Blocks
} from 'lucide-react';

interface SettingSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingSection({ icon: Icon, title, description, children }: SettingSectionProps) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-dark-700 bg-white/3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 border border-purple-500/10">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, value, onClick, danger = false }: { 
  icon: React.ElementType, 
  label: string, 
  value?: string | React.ReactNode, 
  onClick?: () => void,
  danger?: boolean 
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl border border-dark-700/50 transition-all duration-200 group ${
        danger ? 'hover:bg-red-500/5 hover:border-red-500/20' : 'hover:bg-white/5 hover:border-dark-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={danger ? 'text-red-400' : 'text-gray-400 group-hover:text-white transition-colors'} />
        <span className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-gray-300 group-hover:text-white transition-colors'}`}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-sm text-gray-500">{value}</span>}
        <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
      </div>
    </button>
  );
}

type SettingsTab = 'general' | 'billing' | 'integrations' | 'api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, fetchMe, logout, token } = useAuthStore();
  const social = useSocialAccountStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const fetchProfile = async () => {
    try {
      await fetchMe();
      await social.refresh();
    } catch (e) { console.error('Failed to fetch profile', e); }
  };

  useEffect(() => { 
    document.documentElement.classList.add('dark'); 
    fetchProfile();
  }, []);

  const handleConnect = async (platform: 'instagram' | 'x') => {
    const handle = prompt(`Enter your ${platform === 'x' ? 'X (Twitter)' : 'Instagram'} handle/username:`);
    if (!handle) return;
    
    try {
      await api.post(`/auth/connect/${platform}`, { handle });
      fetchProfile();
    } catch (e) {
      console.error('Failed to connect', e);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout().finally(() => router.replace('/login'));
    }, 1200);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Blocks },
    { id: 'api', label: 'Developer & API', icon: Key },
  ] as const;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences, billing, and connected platforms.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Nav */}
          <div className="lg:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-white border-l-2 border-purple-500 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-purple-400' : 'text-gray-500'} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <SettingSection 
                  icon={User} 
                  title="Profile Settings" 
                  description="Manage your creator identity and public profile."
                >
                  <div className="flex items-center gap-5 p-5 rounded-xl bg-white/5 border border-dark-700 mb-4 shadow-inner">
                    <img src={user?.photo || "https://i.pravatar.cc/150?img=32"} alt="Profile" className="w-16 h-16 rounded-full border-2 border-purple-500 object-cover shadow-lg shadow-purple-500/20" />
                    <div>
                      <h3 className="text-white font-bold text-lg">{user?.displayName || 'Loading...'}</h3>
                      <p className="text-gray-400 text-sm mb-1">{user?.email || ''}</p>
                      <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">Change Profile Picture</button>
                    </div>
                  </div>
                  <SettingRow icon={Globe} label="Public Profile" value={user?.displayName ? `fanovix.io/${user.displayName.toLowerCase().replace(/\s+/g, '')}` : "Loading..."} />
                  <SettingRow icon={Mail} label="Email Address" value={user?.email || "Loading..."} />
                </SettingSection>

                <SettingSection 
                  icon={Bell} 
                  title="Notifications" 
                  description="Configure how and when you want to be notified."
                >
                  <SettingRow icon={Smartphone} label="Push Notifications" value={<span className="text-emerald-400 font-semibold bg-emerald-400/10 px-2.5 py-1 rounded-md">Enabled</span>} />
                  <SettingRow icon={Mail} label="Email Summaries" value="Daily" />
                </SettingSection>

                <SettingSection 
                  icon={Shield} 
                  title="Security" 
                  description="Protect your account and managed data."
                >
                  <SettingRow icon={Lock} label="Two-Factor Auth" value="Active" />
                  <SettingRow icon={Shield} label="Privacy Mode" value="Strict" />
                  <SettingRow 
                    icon={LogOut} 
                    label="Sign Out" 
                    danger 
                    onClick={() => setShowConfirmLogout(true)} 
                  />
                </SettingSection>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                 <SettingSection 
                  icon={CreditCard} 
                  title="Current Plan" 
                  description="You are currently on the Pro Creator plan."
                >
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Pro Edition</h3>
                      <p className="text-gray-400 text-sm">$49.00 / month</p>
                    </div>
                    <button className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                      Manage Subscription
                    </button>
                  </div>
                  <SettingRow icon={CreditCard} label="Payment Method" value="Visa ending in 4242" />
                  <SettingRow icon={Mail} label="Billing Email" value={user?.email || ""} />
                </SettingSection>
              </div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                 <SettingSection 
                  icon={Blocks} 
                  title="Connected Accounts" 
                  description="Manage platforms linked to your dashboard. We use OAuth so we never see your passwords."
                >
                  <div className="space-y-4">
                    {/* YouTube */}
                    <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${user?.youtubeChannelName || social.youtubeChannelName ? 'border border-red-500/20 bg-red-500/5' : 'border border-dark-600 bg-white/5 opacity-80 hover:opacity-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-600/20">
                          YT
                        </div>
                        <div>
                          <h3 className="text-white font-bold">YouTube</h3>
                          {user?.youtubeChannelName || social.youtubeChannelName ? (
                            <p className="text-sm text-gray-400">Connected as <span className="text-gray-300 font-semibold">{user?.youtubeChannelName || social.youtubeChannelName}</span></p>
                          ) : (
                            <p className="text-sm text-gray-500">Not connected</p>
                          )}
                        </div>
                      </div>
                      {user?.youtubeChannelName || social.youtubeChannelName ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                          </span>
                          <button className="text-sm font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors">
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <a href={`${API_BASE_URL}/auth/google${token ? `?token=${encodeURIComponent(token)}` : ''}`} className="text-sm font-bold text-black bg-white hover:bg-gray-200 px-5 py-2 rounded-lg transition-colors shadow-lg shadow-white/10 text-center flex items-center">
                          Connect YouTube
                        </a>
                      )}
                    </div>

                    {/* Instagram */}
                    <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${user?.instagramHandle || social.instagramHandle ? 'border border-pink-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5' : 'border border-dark-600 bg-white/5 opacity-80 hover:opacity-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20">
                          IG
                        </div>
                        <div>
                          <h3 className="text-white font-bold">Instagram</h3>
                          {user?.instagramHandle || social.instagramHandle ? (
                            <p className="text-sm text-gray-400">Connected as <span className="text-gray-300 font-semibold">@{user?.instagramHandle || social.instagramHandle}</span></p>
                          ) : (
                            <p className="text-sm text-gray-500">Not connected</p>
                          )}
                        </div>
                      </div>
                      {user?.instagramHandle || social.instagramHandle ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                          </span>
                          <button className="text-sm font-semibold text-pink-400 hover:text-pink-300 px-3 py-1.5 border border-pink-500/20 hover:bg-pink-500/10 rounded-lg transition-colors">
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleConnect('instagram')} className="text-sm font-bold text-black bg-white hover:bg-gray-200 px-5 py-2 rounded-lg transition-colors shadow-lg shadow-white/10">
                          Connect Account
                        </button>
                      )}
                    </div>

                    {/* X (Twitter) */}
                    <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${user?.xHandle || social.xHandle ? 'border border-blue-500/20 bg-blue-500/5' : 'border border-dark-600 bg-white/5 opacity-80 hover:opacity-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          𝕏
                        </div>
                        <div>
                          <h3 className="text-white font-bold">X (Twitter)</h3>
                          {user?.xHandle || social.xHandle ? (
                            <p className="text-sm text-gray-400">Connected as <span className="text-gray-300 font-semibold">@{user?.xHandle || social.xHandle}</span></p>
                          ) : (
                            <p className="text-sm text-gray-500">Not connected</p>
                          )}
                        </div>
                      </div>
                      {user?.xHandle || social.xHandle ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                          </span>
                          <button className="text-sm font-semibold text-gray-400 hover:text-white px-3 py-1.5 border border-dark-600 hover:bg-white/5 rounded-lg transition-colors">
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleConnect('x')} className="text-sm font-bold text-black bg-white hover:bg-gray-200 px-5 py-2 rounded-lg transition-colors shadow-lg shadow-white/10">
                          Connect Account
                        </button>
                      )}
                    </div>
                  </div>
                </SettingSection>
              </div>
            )}

            {/* API TAB */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                 <SettingSection 
                  icon={Key} 
                  title="Developer API" 
                  description="Access your API keys for custom integrations."
                >
                  <div className="p-5 rounded-xl bg-dark-900/60 border border-dark-700 font-mono text-sm flex items-center justify-between">
                    <span className="text-gray-400">sk_live_***************************</span>
                    <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Reveal</button>
                  </div>
                  <SettingRow icon={Blocks} label="Webhook Endpoints" value="0 Configured" />
                  <SettingRow icon={ExternalLink} label="API Documentation" value="View Docs" />
                </SettingSection>
              </div>
            )}

          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-8 border-t border-dark-700/50">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Fanovix OS v2.0 — Pro Edition</p>
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-sm p-8 rounded-3xl border border-dark-700 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mx-auto mb-6">
              <LogOut size={32} />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Sign Out?</h3>
            <p className="text-gray-400 text-center text-sm mb-8">
              Are you sure you want to sign out of your account? You'll need to login again to access your dashboard.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing out...
                  </>
                ) : (
                  'Yes, Sign Out'
                )}
              </button>
              <button 
                onClick={() => setShowConfirmLogout(false)}
                disabled={isLoggingOut}
                className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-all border border-dark-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
