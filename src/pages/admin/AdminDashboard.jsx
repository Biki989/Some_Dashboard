import { mockProjects, mockTasks, mockMessages, mockDeliverables } from '../../data/mockData';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FolderPlus, TrendingUp, FileBarChart, Users, Package,
    MessageSquare, CheckCircle, Clock, ArrowUpRight, AlertCircle
} from 'lucide-react';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const statusColor = {
    'In Progress': 'bg-primary/10 text-primary',
    Completed: 'bg-success/10 text-success',
    'On Hold': 'bg-warning/10 text-warning',
};

export default function AdminDashboard() {
    const activeProjects = mockProjects.filter((p) => p.status === 'In Progress').length;
    const completedProjects = mockProjects.filter((p) => p.status === 'Completed').length;
    const pendingTasks = mockTasks.filter((t) => t.status === 'pending').length;
    const unreadMessages = mockMessages.filter((m) => !m.read).length;

    const quickActions = [
        { icon: FolderPlus, label: 'Create Project', to: '/admin/create-project', color: 'bg-primary/10 text-primary' },
        { icon: TrendingUp, label: 'Update Progress', to: '/admin/update-progress', color: 'bg-secondary/10 text-secondary' },
        { icon: FileBarChart, label: 'Generate Report', to: '/admin/generate-report', color: 'bg-accent/10 text-accent' },
    ];

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Admin Dashboard</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Manage projects and communicate with clients</p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Projects', value: activeProjects, icon: Clock, color: 'primary', change: '+1 this month' },
                    { label: 'Completed', value: completedProjects, icon: CheckCircle, color: 'success', change: 'All time' },
                    { label: 'Pending Tasks', value: pendingTasks, icon: AlertCircle, color: 'warning', change: 'Across projects' },
                    { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, color: 'secondary', change: 'From clients' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-9 h-9 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                                <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-text-primary dark:text-white">{stat.value}</p>
                        <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeUp}>
                <h2 className="text-sm font-semibold text-text-primary dark:text-white mb-3">Quick Actions</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            to={action.to}
                            className="flex items-center gap-3 bg-white dark:bg-surface-dark rounded-2xl p-4 border border-border dark:border-border-dark card-shadow hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-text-primary dark:text-white">{action.label}</span>
                            <ArrowUpRight className="w-4 h-4 text-text-muted ml-auto" />
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Projects List */}
            <motion.div variants={fadeUp}>
                <h2 className="text-sm font-semibold text-text-primary dark:text-white mb-3">All Projects</h2>
                <div className="space-y-3">
                    {mockProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-text-primary dark:text-white">{project.name}</h3>
                                    <span className={`status-badge ${statusColor[project.status]}`}>{project.status}</span>
                                </div>
                                <p className="text-xs text-text-muted">{project.clientName} ・ {project.type}</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-text-primary dark:text-white">{project.completion}%</p>
                                    <p className="text-[10px] text-text-muted">Progress</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-success">{project.healthScore}</p>
                                    <p className="text-[10px] text-text-muted">Health</p>
                                </div>
                                <div className="w-32 hidden md:block">
                                    <div className="w-full h-2 bg-surface-alt dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full gradient-primary"
                                            style={{ width: `${project.completion}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
