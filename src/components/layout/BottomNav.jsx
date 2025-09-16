import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, NotebookText, ShieldHalf, User } from 'lucide-react';

const navItems = [
    { path: "/scan", icon: Home, label: "Pindai" },
    { path: "/reports", icon: NotebookText, label: "Laporan" },
    { path: "/diseases", icon: ShieldHalf, label: "Info" },
    { path: "/profile", icon: User, label: "Profil" },
];

export const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] h-20 flex justify-around items-center">
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