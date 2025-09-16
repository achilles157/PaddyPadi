import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Awalnya null (belum login)

    // Ganti dengan logika login dari service Anda nanti
    const login = () => setUser({ name: "Petani Cerdas" });
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => useContext(AuthContext);