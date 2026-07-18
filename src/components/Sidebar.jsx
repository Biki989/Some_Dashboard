import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Clock, Package, FileText, MessageSquare,
    Activity, Settings, FolderPlus, TrendingUp, FileBarChart,
    ChevronLeft, ChevronRight, LogOut, Shield, X
} from 'lucide-react';

const clientLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/timeline', icon: Clock, label: 'Timeline' },
    { to: '/deliverables', icon: Package, label: 'Deliverables' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/activity', icon: Activity, label: 'Activity' },
];

const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/create-project', icon: FolderPlus, label: 'Create Project' },
    { to: '/admin/update-progress', icon: TrendingUp, label: 'Update Progress' },
    { to: '/admin/generate-report', icon: FileBarChart, label: 'Generate Report' },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isAdmin = user?.role === 'admin';

    const links = isAdmin ? adminLinks : clientLinks;

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-border dark:border-border-dark">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="overflow-hidden"
                    >
                        <h1 className="text-base font-bold text-text-primary dark:text-white whitespace-nowrap">Client Portal</h1>
                        <p className="text-[11px] text-text-muted whitespace-nowrap">Project Dashboard</p>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {isAdmin && !collapsed && (
                    <p className="px-3 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Admin Panel</p>
                )}
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/admin'}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
              ${isActive
                                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                                : 'text-text-secondary dark:text-gray-400 hover:bg-surface-alt dark:hover:bg-white/5 hover:text-text-primary dark:hover:text-white'
                            }
              ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <link.icon className="w-[18px] h-[18px] flex-shrink-0" />
                        {!collapsed && <span className="whitespace-nowrap">{link.label}</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-surface-dark text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {link.label}
                            </div>
                        )}
                    </NavLink>
                ))}

                {isAdmin && (
                    <>
                        <div className="my-3 border-t border-border dark:border-border-dark" />
                        {!collapsed && (
                            <p className="px-3 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Client View</p>
                        )}
                        {clientLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                  ${isActive
                                        ? 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-light'
                                        : 'text-text-secondary dark:text-gray-400 hover:bg-surface-alt dark:hover:bg-white/5 hover:text-text-primary dark:hover:text-white'
                                    }
                  ${collapsed ? 'justify-center' : ''}`
                                }
                            >
                                <link.icon className="w-[18px] h-[18px] flex-shrink-0" />
                                {!collapsed && <span className="whitespace-nowrap">{link.label}</span>}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-surface-dark text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {link.label}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </>
                )}
            </nav>

            {/* User info */}
            <div className="border-t border-border dark:border-border-dark p-3">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">{user?.name?.charAt(0)}</span>
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary dark:text-white truncate">{user?.name}</p>
                            <p className="text-[11px] text-text-muted truncate">{user?.role === 'admin' ? 'Developer' : 'Client'}</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={logout}
                            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Collapse toggle (desktop) */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-dark border border-border dark:border-border-dark items-center justify-center text-text-muted hover:text-text-primary dark:hover:text-white transition-colors card-shadow z-10"
            >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-surface-dark border-r border-border dark:border-border-dark z-40 relative"
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/40 z-40"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="lg:hidden fixed left-0 top-0 h-screen w-[260px] bg-white dark:bg-surface-dark border-r border-border dark:border-border-dark z-50"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
