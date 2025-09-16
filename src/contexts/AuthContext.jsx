import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/firebase';
import { createUserProfileDocument } from '../services/userService';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

     const register = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Setelah user dibuat di Auth, buat dokumennya di Firestore
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
                // Cek custom claim admin
                const idTokenResult = await currentUser.getIdTokenResult();
                setIsAdmin(!!idTokenResult.claims.admin);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = { user, isAuthenticated: !!user, isAdmin, login, logout, register };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);