import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { onMessageListener } from '../../services/notificationService';
import toast from 'react-hot-toast';

export const MainLayout = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'id' ? 'en' : 'id';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        onMessageListener()
            .then((payload) => {
                console.log('Foreground notification received:', payload);
                toast(
                    (t) => (
                        <div className="flex flex-col">
                            <span className="font-bold">{payload.notification.title}</span>
                            <span className="text-sm">{payload.notification.body}</span>
                        </div>
                    ),
                    { duration: 5000, icon: '🔔' }
                );
            })
            .catch((err) => console.log('failed: ', err));
    }, []);

    return (
        <div className="bg-off-white min-h-screen w-full pb-24 relative">
            <Toaster position="top-center" />

            {/* Language Switcher */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={toggleLanguage}
                    className="bg-white/90 backdrop-blur-sm shadow-sm px-3 py-1.5 rounded-full text-xs font-medium text-sage border border-sage/20 hover:bg-sage/10 transition-colors flex items-center gap-1"
                >
                    <span>{i18n.language === 'id' ? '🇮🇩' : '🇺🇸'}</span>
                    <span>{i18n.language === 'id' ? 'ID' : 'EN'}</span>
                </button>
            </div>

            <main className="p-4 pt-14">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};