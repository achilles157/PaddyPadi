import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
    return (
        <div className="bg-off-white min-h-screen w-full pb-24"> {/* Padding bawah untuk ruang nav */}
            <main className="p-4">
                {/* Outlet akan merender halaman yang aktif sesuai URL */}
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};