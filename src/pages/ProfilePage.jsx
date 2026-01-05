import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { requestForToken } from '../services/notificationService';
import {
    User, Mail, Shield, Bell, Trash2, Info, HelpCircle, LogOut, ChevronRight, X, Globe
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

const ProfilePage = () => {
    const { t, i18n } = useTranslation();
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [fcmToken, setFcmToken] = useState(null);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success(t('profile.logout_success'));
            navigate('/auth');
        } catch (error) {
            toast.error(t('profile.logout_error'));
        }
    };

    const handleEnableNotifications = async () => {
        const token = await requestForToken();
        if (token) {
            setFcmToken(token);
            toast.success("Notifications enabled!");
        } else {
            toast.error("Failed to enable notifications. Please check permissions.");
        }
    };

    const handleClearCache = () => {
        if (window.confirm(t('profile.clear_cache_confirm'))) {
            localStorage.clear();
            sessionStorage.clear();
            if ('caches' in window) {
                caches.keys().then((names) => {
                    names.forEach((name) => {
                        caches.delete(name);
                    });
                });
            }
            toast.success(t('profile.cache_cleared'));
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    if (!user) {
        return <div className="p-4">{t('common.loading')}</div>;
    }

    const MenuItem = ({ icon: Icon, label, value, onClick, isAction = false, isDestructive = false }) => (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 bg-white mb-2 rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className={`font-medium ${isDestructive ? 'text-red-600' : 'text-gray-800'}`}>{label}</p>
                    {value && <p className="text-xs text-gray-500">{value}</p>}
                </div>
            </div>
            {onClick && !isAction && <ChevronRight size={18} className="text-gray-400" />}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-24">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 px-1">{t('profile.title')}</h1>

            {/* Account Section */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-3 ml-1 uppercase tracking-wider">{t('profile.account_section')}</h2>
                <MenuItem icon={Mail} label={t('profile.email')} value={user.email} />
                <MenuItem icon={User} label={t('profile.user_id')} value={user.uid?.substring(0, 12) + '...'} />
                {isAdmin && (
                    <MenuItem icon={Shield} label={t('profile.admin_status')} value={t('profile.is_admin')} />
                )}
            </div>

            {/* Settings Section */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-3 ml-1 uppercase tracking-wider">{t('profile.settings_section')}</h2>
                <div onClick={!fcmToken ? handleEnableNotifications : undefined} className="flex items-center justify-between p-4 bg-white mb-2 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                            <Bell size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{t('profile.notifications')}</p>
                            <p className="text-xs text-gray-500">
                                {fcmToken ? t('profile.notif_enabled') : t('profile.notif_disabled')}
                            </p>
                        </div>
                    </div>
                </div>

                <MenuItem
                    icon={Globe}
                    label={t('profile.language') || "Bahasa / Language"}
                    value={i18n.language === 'id' ? 'Indonesia 🇮🇩' : 'English 🇺🇸'}
                    onClick={() => i18n.changeLanguage(i18n.language === 'id' ? 'en' : 'id')}
                    isAction
                />

                <MenuItem icon={Trash2} label={t('profile.clear_cache')} onClick={handleClearCache} isAction />
            </div>

            {/* Information Section */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-3 ml-1 uppercase tracking-wider">{t('profile.info_section')}</h2>
                <MenuItem icon={Info} label={t('profile.about_app')} onClick={() => setIsAboutOpen(true)} isAction />
                <MenuItem icon={HelpCircle} label={t('profile.help')} onClick={() => setIsHelpOpen(true)} isAction />
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 mt-4 bg-red-50 text-red-600 font-bold py-3 px-4 rounded-xl hover:bg-red-100 transition-all"
            >
                <LogOut size={20} />
                {t('profile.logout')}
            </button>

            {/* About Modal */}
            <Dialog open={isAboutOpen} onClose={() => setIsAboutOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-medium">About PaddyPadi</Dialog.Title>
                            <button onClick={() => setIsAboutOpen(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="prose prose-sm text-gray-600">
                            <p className="mb-2">Version 1.0.3 (PWA)</p>
                            <p>
                                PaddyPadi uses advanced Artificial Intelligence to help farmers detect rice plant diseases early.
                                Built with React, TensorFlow.js, and Firebase.
                            </p>
                            <p className="mt-4 text-xs text-center text-gray-400">© 2025 PaddyPadi Team</p>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Help Modal */}
            <Dialog open={isHelpOpen} onClose={() => setIsHelpOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-medium">Help Guide</Dialog.Title>
                            <button onClick={() => setIsHelpOpen(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div>
                                <h4 className="font-bold text-gray-800">1. Scan Disease</h4>
                                <p>Go to the **Scan** tab, take a photo or upload an image of a rice leaf. The AI will analyze it instantly.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">2. View Map</h4>
                                <p>Check the **Map** tab to see disease spread in your area and stay safe.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">3. History</h4>
                                <p>All your reports are saved in the **History** tab for future reference.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsHelpOpen(false)}
                            className="w-full mt-6 bg-green-600 text-white rounded-lg py-2 font-medium"
                        >
                            Got it
                        </button>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default ProfilePage;