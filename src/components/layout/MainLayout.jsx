import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Toaster } from 'react-hot-toast';

export const MainLayout = () => {
    return (
        <div className="bg-off-white min-h-screen w-full pb-24">
            <Toaster position="top-center" />
            <main className="p-4">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};