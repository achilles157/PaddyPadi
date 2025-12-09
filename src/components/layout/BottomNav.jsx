import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, NotebookText, ShieldHalf, User, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BottomNav = () => {
    const { t } = useTranslation();

    const navItems = [
        { path: "/scan", icon: Home, label: t('nav.scan') },
        { path: "/map", icon: Map, label: t('map.nav_label') || "Peta" },
        { path: "/reports", icon: NotebookText, label: t('nav.history') },
        { path: "/diseases", icon: ShieldHalf, label: t('nav.diseases') },
        { path: "/profile", icon: User, label: t('nav.profile') },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] h-20 flex justify-around items-center z-50">
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-sage' : 'text-gray-400'}`
                    }
                >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-semibold">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};