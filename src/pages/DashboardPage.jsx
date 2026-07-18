import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockProjects, mockProgressData, mockTaskDistribution, mockMLMetrics, mockActivities, mockTasks } from '../data/mockData';
import { motion } from 'framer-motion';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import {
    TrendingUp, Calendar, Target, Heart, Clock, CheckCircle,
    AlertCircle, ChevronRight, ArrowUpRight, ArrowDownRight, Zap,
    Brain, Activity
} from 'lucide-react';
import { format } from 'date-fns';

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const statusColors = {
    'In Progress': 'bg-primary/10 text-primary',
    'Completed': 'bg-success/10 text-success',
    'On Hold': 'bg-warning/10 text-warning',
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [selectedProject, setSelectedProject] = useState(0);

    const projects = user?.role === 'admin'
        ? mockProjects
        : mockProjects.filter((p) => p.clientId === user?.id);

    const project = projects[selectedProject] || projects[0];
    const projectTasks = mockTasks.filter((t) => t.projectId === project?.id);
    const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
    const totalTasks = projectTasks.length;

    const projectActivities = mockActivities
        .filter((a) => a.projectId === project?.id)
        .slice(0, 5);

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload) return null;
        return (
            <div className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl px-3 py-2 shadow-lg">
                <p className="text-xs font-medium text-text-primary dark:text-white mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-xs text-text-secondary dark:text-gray-400">
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-white">
                        {user?.role === 'admin' ? 'Dashboard' : `Welcome back, ${user?.name?.split(' ')[0]}`}
                    </h1>
                    <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">
                        Here&apos;s what&apos;s happening with your projects
                    </p>
                </div>
                {projects.length > 1 && (
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(Number(e.target.value))}
                        className="px-4 py-2 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white outline-none focus:border-primary"
                    >
                        {projects.map((p, i) => (
                            <option key={p.id} value={i}>{p.name}</option>
                        ))}
                    </select>
                )}
            </motion.div>

            {/* Overview Cards */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Project Status',
                        value: project?.status,
                        icon: AlertCircle,
                        color: 'primary',
                        badge: statusColors[project?.status],
                    },
                    {
                        label: 'Completion',
                        value: `${project?.completion}%`,
                        icon: Target,
                        color: 'secondary',
                        sub: `${completedTasks}/${totalTasks} tasks done`,
                    },
                    {
                        label: 'Current Phase',
                        value: project?.currentPhase,
                        icon: TrendingUp,
                        color: 'accent',
                    },
                    {
                        label: 'Deadline',
                        value: project?.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : '—',
                        icon: Calendar,
                        color: 'warning',
                    },
                ].map((card, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{card.label}</span>
                            <div className={`w-8 h-8 rounded-lg bg-${card.color}/10 flex items-center justify-center`}>
                                <card.icon className={`w-4 h-4 text-${card.color}`} />
                            </div>
                        </div>
                        {card.badge ? (
                            <span className={`status-badge ${card.badge}`}>{card.value}</span>
                        ) : (
                            <p className="text-xl font-bold text-text-primary dark:text-white">{card.value}</p>
                        )}
                        {card.sub && (
                            <p className="text-xs text-text-muted mt-1.5">{card.sub}</p>
                        )}
                    </div>
                ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary dark:text-white">Overall Progress</h3>
                        <p className="text-xs text-text-muted mt-0.5">
                            {project?.name} — {project?.type}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-success" />
                        <span className="text-sm font-bold text-success">{project?.healthScore}</span>
                        <span className="text-xs text-text-muted">Health</span>
                    </div>
                </div>
                <div className="w-full h-3 bg-surface-alt dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project?.completion}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full rounded-full gradient-primary"
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-xs text-text-muted">Started {project?.startDate ? format(new Date(project.startDate), 'MMM d') : ''}</span>
                    <span className="text-xs font-medium text-primary">{project?.completion}% Complete</span>
                </div>
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-4">
                {/* Progress over time */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                    <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-4">Progress Over Time</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={mockProgressData}>
                            <defs>
                                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                            <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="tasksCompleted" name="Tasks" stroke="#2563EB" fill="url(#colorTasks)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly hours */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                    <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-4">Weekly Work Hours</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={mockProgressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                            <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="hoursWorked" name="Hours" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Task Distribution + ML Metrics */}
            <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-4">
                {/* Pie chart */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                    <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-4">Task Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={mockTaskDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {mockTaskDistribution.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(val) => <span className="text-xs text-text-secondary dark:text-gray-400">{val}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* ML Metrics (only show for ML projects) */}
                {project?.type === 'Machine Learning' ? (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-4 h-4 text-accent" />
                            <h3 className="text-sm font-semibold text-text-primary dark:text-white">Model Training Metrics</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={mockMLMetrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="epoch" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" domain={[0, 1]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="accuracy" name="Train Acc" stroke="#2563EB" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="valAccuracy" name="Val Acc" stroke="#06B6D4" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="loss" name="Train Loss" stroke="#EF4444" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="valLoss" name="Val Loss" stroke="#F59E0B" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                <Legend formatter={(val) => <span className="text-xs text-text-secondary dark:text-gray-400">{val}</span>} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                        <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-4">Milestones Progress</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={mockProgressData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="milestones" name="Milestones" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-text-primary dark:text-white">Recent Activity</h3>
                    <a href="/activity" className="text-xs text-primary font-medium flex items-center gap-1 hover:text-primary-dark transition-colors">
                        View all <ChevronRight className="w-3 h-3" />
                    </a>
                </div>
                <div className="space-y-3">
                    {projectActivities.map((act, i) => (
                        <div key={act.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-surface-alt dark:hover:bg-white/5 transition-colors">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${act.type === 'milestone' ? 'bg-success/10 text-success' :
                                    act.type === 'deliverable' ? 'bg-primary/10 text-primary' :
                                        act.type === 'report' ? 'bg-accent/10 text-accent' :
                                            act.type === 'message' ? 'bg-secondary/10 text-secondary' :
                                                'bg-surface-alt dark:bg-white/10 text-text-muted'}`}
                            >
                                <Activity className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary dark:text-white">{act.message}</p>
                                <p className="text-xs text-text-muted mt-0.5">
                                    {format(new Date(act.timestamp), 'MMM d, yyyy ・ h:mm a')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
