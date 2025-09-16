import React, { createContext, useState, useContext } from 'react';
import { loginUser as apiLogin } from '../services/authService'; // Impor service dummy

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Coba ambil user dari localStorage jika ada sesi sebelumnya
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('paddyUser')));

    const login = async (credentials) => {
        const response = await apiLogin(credentials.email, credentials.password);
        if (response.success) {
            localStorage.setItem('paddyUser', JSON.stringify(response.user));
            setUser(response.user);
        }
        // Tambahkan penanganan error nanti
    };

    const logout = () => {
        localStorage.removeItem('paddyUser');
        setUser(null);
    };

    const value = { user, isAuthenticated: !!user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};