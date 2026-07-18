import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';

export default function Layout() {
    const { user, loading } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('portal_dark');
        return stored ? stored === 'true' : false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('portal_dark', String(darkMode));
    }, [darkMode]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-surface-darker">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className={`flex h-screen bg-[#F8FAFC] dark:bg-surface-darker overflow-hidden`}>
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <motion.div
                animate={{ marginLeft: collapsed ? 72 : 260 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex-1 flex flex-col min-h-screen max-lg:!ml-0"
            >
                <Topbar darkMode={darkMode} setDarkMode={setDarkMode} setMobileOpen={setMobileOpen} />

                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </motion.div>
        </div>
    );
}
