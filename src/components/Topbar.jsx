import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockNotifications } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Sun, Moon, Menu, Search,
    TrendingUp, Package, MessageSquare, FileText,
    Check, X
} from 'lucide-react';

const iconMap = {
    update: TrendingUp,
    deliverable: Package,
    message: MessageSquare,
    report: FileText,
    milestone: Check,
};

export default function Topbar({ darkMode, setDarkMode, setMobileOpen }) {
    const { user } = useAuth();
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [search, setSearch] = useState('');
    const notifRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-border dark:border-border-dark">
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden p-2 rounded-xl text-text-secondary hover:bg-surface-alt dark:hover:bg-white/5 transition-colors"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden sm:flex items-center relative">
                        <Search className="w-4 h-4 absolute left-3 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search projects, deliverables..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64 lg:w-80 pl-10 pr-4 py-2 rounded-xl bg-surface-alt dark:bg-white/5 border border-transparent focus:border-primary/30 dark:focus:border-primary/40 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {/* Dark mode toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 rounded-xl text-text-secondary dark:text-gray-400 hover:bg-surface-alt dark:hover:bg-white/5 transition-colors"
                    >
                        {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            className="p-2.5 rounded-xl text-text-secondary dark:text-gray-400 hover:bg-surface-alt dark:hover:bg-white/5 transition-colors relative"
                        >
                            <Bell className="w-[18px] h-[18px]" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifs && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark card-shadow overflow-hidden"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark">
                                        <h3 className="text-sm font-semibold text-text-primary dark:text-white">Notifications</h3>
                                        <button
                                            onClick={markAllRead}
                                            className="text-xs text-primary hover:text-primary-dark font-medium"
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((notif) => {
                                            const Icon = iconMap[notif.type] || Bell;
                                            return (
                                                <div
                                                    key={notif.id}
                                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-alt dark:hover:bg-white/5 transition-colors
                            ${!notif.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                            ${!notif.read ? 'bg-primary/10 text-primary' : 'bg-surface-alt dark:bg-white/10 text-text-muted'}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${!notif.read ? 'text-text-primary dark:text-white font-medium' : 'text-text-secondary dark:text-gray-400'}`}>
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-[11px] text-text-muted mt-0.5">{notif.time}</p>
                                                    </div>
                                                    {!notif.read && (
                                                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2.5 ml-2 pl-3 border-l border-border dark:border-border-dark">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">{user?.name?.charAt(0)}</span>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-text-primary dark:text-white">{user?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
