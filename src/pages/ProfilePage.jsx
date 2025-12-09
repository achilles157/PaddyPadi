import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { requestForToken } from '../services/notificationService';

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [fcmToken, setFcmToken] = useState(null);

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
            toast.success("Notifications enabled! Token generated.");
            console.log("FCM Token:", token);
            // Here you would typically send this token to your backend to associate with the user
        } else {
            toast.error("Failed to enable notifications. Please check permissions.");
        }
    };

    if (!user) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-charcoal mb-6">{t('profile.title')}</h1>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg relative mb-6">
                <p className="font-bold">{t('profile.debug_status')}:</p>
                <p>{t('profile.email')}: {user ? user.email : 'Tidak ada user'}</p>
                <p>
                    {t('profile.admin_status')}: <span className="font-extrabold text-lg">{isAdmin ? t('profile.is_admin') : t('profile.is_user')}</span>
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                <div>
                    <p className="text-sm text-gray-500">{t('profile.email')}</p>
                    <p className="font-semibold text-charcoal">{user.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{t('profile.user_id')}</p>
                    <p className="font-mono text-xs text-charcoal">{user.uid}</p>
                </div>
                {/* Notification Section */}
                <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Notifications</p>
                    {!fcmToken ? (
                        <button
                            onClick={handleEnableNotifications}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Enable Notifications
                        </button>
                    ) : (
                        <div>
                            <p className="text-green-600 text-sm font-medium mb-1">✓ Notifications Enabled</p>
                            <p className="text-xs text-gray-400 break-all">Token: {fcmToken.substring(0, 20)}...</p>
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="w-full mt-8 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-all"
            >
                {t('profile.logout')}
            </button>
        </div>
    );
};

export default ProfilePage;