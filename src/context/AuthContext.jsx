import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('portal_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('portal_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const found = mockUsers.find(
            (u) => u.email === email && u.password === password
        );
        if (!found) return { success: false, error: 'Invalid credentials' };
        const userData = { ...found };
        delete userData.password;
        setUser(userData);
        localStorage.setItem('portal_user', JSON.stringify(userData));
        return { success: true, user: userData };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('portal_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
