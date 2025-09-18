import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logout berhasil.');
            navigate('/auth');
        } catch (error) {
            toast.error('Gagal logout.');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-charcoal mb-6">Profil Saya</h1>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg relative mb-6">
                <p className="font-bold">Status Debug:</p>
                <p>Email: {user ? user.email : 'Tidak ada user'}</p>
                <p>
                    Status Admin: <span className="font-extrabold text-lg">{isAdmin ? 'YA (Admin)' : 'BUKAN (User Biasa)'}</span>
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-charcoal">{user.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-xs text-charcoal">{user.uid}</p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="w-full mt-8 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-all"
            >
                Logout
            </button>
        </div>
    );
};

export default ProfilePage;