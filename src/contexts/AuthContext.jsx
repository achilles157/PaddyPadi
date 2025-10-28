import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "firebase/auth";
import { createUserProfileDocument } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const register = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfileDocument(userCredential.user);
        return userCredential;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const idTokenResult = await currentUser.getIdTokenResult();
                setIsAdmin(!!idTokenResult.claims.admin);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });
            setIsAuthenticated(!!user); 
            setLoading(false);
        return () => unsubscribe();
    }, []);

    const value = { user, isAuthenticated: !!user, isAdmin, loading, login, logout, register };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};