import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, NotebookText, ShieldHalf, User, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BottomNav = () => {
    const { t } = useTranslation();

    const navItems = [
        { path: "/home", icon: Home, label: t('nav.home') || "Beranda" },
        // Middle button (Scan) will be styled differently in the return, or handled here
        { path: "/scan", icon: null, label: t('nav.scan') },
        { path: "/profile", icon: User, label: t('nav.profile') },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] h-20 px-2 grid grid-cols-3 items-center z-50">
            {/* Home Link */}
            <NavLink
                to="/home"
                className={({ isActive }) => `flex flex-col items-center justify-center gap-1 h-full ${isActive ? 'text-sage-600' : 'text-gray-400'}`}
            >
                <Home className="h-6 w-6" />
                <span className="text-xs font-semibold">{t('nav.home') || "Beranda"}</span>
            </NavLink>

            {/* Floating Scan Button (Center) */}
            <div className="flex justify-center items-end h-full pb-4">
                <NavLink
                    to="/scan"
                    className="relative -top-5 bg-[#6e7e46] text-white w-18 h-18 p-3 rounded-full shadow-lg border-4 border-white flex flex-col items-center justify-center transform transition-transform active:scale-95"
                >
                    <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-line mb-0.5"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" /></svg>
                        <span className="text-[9px] font-bold uppercase tracking-wide">{t('nav.scan') || "Scan"}</span>
                    </div>
                </NavLink>
            </div>

            {/* Profile Link */}
            <NavLink
                to="/profile"
                className={({ isActive }) => `flex flex-col items-center justify-center gap-1 h-full ${isActive ? 'text-sage-600' : 'text-gray-400'}`}
            >
                <User className="h-6 w-6" />
                <span className="text-xs font-semibold">{t('nav.profile')}</span>
            </NavLink>
        </nav>
    );
};