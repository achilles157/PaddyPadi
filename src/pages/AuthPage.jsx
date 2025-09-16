import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Anda bisa memisahkan ini menjadi komponen sendiri nanti
const AuthForm = ({ isLogin, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:border-sage focus:bg-white focus:outline-none"
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:border-sage focus:bg-white focus:outline-none"
                required 
            />
            <button type="submit" className="w-full bg-sage text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 transition-all">
                {isLogin ? 'Login' : 'Register'}
            </button>
        </form>
    );
};


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth(); // Asumsikan ada fungsi register nanti
    const navigate = useNavigate();

    const handleAuth = async (credentials) => {
        try {
            if (isLogin) {
                await login(credentials.email, credentials.password);
                toast.success('Login berhasil!');
            } else {
                // await register(credentials.email, credentials.password);
                toast.success('Registrasi berhasil! Silakan login.');
                setIsLogin(true); // Arahkan ke form login setelah register
            }
            navigate('/scan');
        } catch (error) {
            toast.error(error.message || 'Gagal melakukan otentikasi.');
        }
    };

    return (
        <div className="min-h-screen bg-off-white flex flex-col justify-center items-center p-4">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-charcoal">PaddyPadi 🌱</h1>
                <p className="text-sage font-semibold mt-1">
                    {isLogin ? 'Selamat Datang Kembali!' : 'Buat Akun Baru'}
                </p>
            </header>
            
            <AuthForm isLogin={isLogin} onSubmit={handleAuth} />

            <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-sm text-charcoal hover:underline">
                {isLogin ? 'Belum punya akun? Register' : 'Sudah punya akun? Login'}
            </button>
        </div>
    );
};

export default AuthPage;