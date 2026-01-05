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

            <div className="p-0"></div> {/* Removed Language Switcher */}

            <main className="p-4 pt-14">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};