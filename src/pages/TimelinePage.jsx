import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockProjects } from '../data/mockData';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Loader, ChevronDown, ChevronUp, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const phaseIcons = {
    completed: CheckCircle,
    'in-progress': Loader,
    pending: Circle,
};

const phaseColors = {
    completed: { bg: 'bg-success/10', text: 'text-success', border: 'border-success', line: 'bg-success' },
    'in-progress': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary', line: 'bg-primary' },
    pending: { bg: 'bg-gray-100 dark:bg-white/5', text: 'text-text-muted', border: 'border-border dark:border-border-dark', line: 'bg-border dark:bg-border-dark' },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TimelinePage() {
    const { user } = useAuth();
    const [selectedProject, setSelectedProject] = useState(0);
    const [expandedPhase, setExpandedPhase] = useState(null);

    const projects = user?.role === 'admin'
        ? mockProjects
        : mockProjects.filter((p) => p.clientId === user?.id);

    const project = projects[selectedProject] || projects[0];
    const phases = project?.phases || [];

    const overallProgress = Math.round(
        phases.reduce((sum, p) => sum + p.completion, 0) / phases.length
    );

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-white">Project Timeline</h1>
                    <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Track every phase of your project</p>
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

            {/* Overview bar */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary dark:text-white">{project?.name}</h3>
                            <p className="text-xs text-text-muted">
                                {project?.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : ''} → {project?.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : ''}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{overallProgress}%</p>
                        <p className="text-xs text-text-muted">Overall</p>
                    </div>
                </div>

                {/* Phase progress mini-bar */}
                <div className="flex h-2 rounded-full overflow-hidden bg-surface-alt dark:bg-white/5 gap-0.5">
                    {phases.map((phase, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-full overflow-hidden"
                        >
                            <div
                                className={`h-full transition-all duration-700 ${phase.status === 'completed' ? 'bg-success' :
                                        phase.status === 'in-progress' ? 'bg-primary' : 'bg-transparent'
                                    }`}
                                style={{ width: `${phase.completion}%` }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex mt-2">
                    {phases.map((phase, i) => (
                        <div key={i} className="flex-1 text-center">
                            <span className="text-[10px] text-text-muted">{phase.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={fadeUp} className="space-y-0">
                {phases.map((phase, i) => {
                    const colors = phaseColors[phase.status];
                    const Icon = phaseIcons[phase.status];
                    const isExpanded = expandedPhase === i;
                    const isLast = i === phases.length - 1;

                    return (
                        <div key={i} className="relative flex gap-4 group">
                            {/* Timeline line */}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center z-10 border-2 ${colors.border}
                  ${phase.status === 'in-progress' ? 'pulse-glow' : ''}`}>
                                    <Icon className={`w-5 h-5 ${colors.text} ${phase.status === 'in-progress' ? 'animate-spin' : ''}`}
                                        style={phase.status === 'in-progress' ? { animationDuration: '3s' } : {}}
                                    />
                                </div>
                                {!isLast && (
                                    <div className={`w-0.5 flex-1 min-h-[40px] ${colors.line} transition-colors`} />
                                )}
                            </div>

                            {/* Content card */}
                            <div className="flex-1 pb-6">
                                <button
                                    onClick={() => setExpandedPhase(isExpanded ? null : i)}
                                    className="w-full text-left bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-base font-semibold text-text-primary dark:text-white">{phase.name}</h3>
                                                <span className={`status-badge ${phase.status === 'completed' ? 'bg-success/10 text-success' :
                                                        phase.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                                                            'bg-gray-100 dark:bg-white/10 text-text-muted'
                                                    }`}>
                                                    {phase.status === 'completed' ? 'Complete' :
                                                        phase.status === 'in-progress' ? 'In Progress' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-secondary dark:text-gray-400">{phase.notes}</p>
                                        </div>
                                        <div className="flex items-center gap-3 ml-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-lg font-bold text-text-primary dark:text-white">{phase.completion}%</p>
                                                <p className="text-xs text-text-muted">Complete</p>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-text-muted" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-text-muted" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-3 w-full h-1.5 bg-surface-alt dark:bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${phase.completion}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${phase.status === 'completed' ? 'bg-success' : 'bg-primary'
                                                }`}
                                        />
                                    </div>
                                </button>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2 bg-surface-alt dark:bg-white/5 rounded-xl p-4 border border-border dark:border-border-dark"
                                    >
                                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-text-muted text-xs mb-1">Start Date</p>
                                                <p className="text-text-primary dark:text-white font-medium">
                                                    {phase.startDate ? format(new Date(phase.startDate), 'MMM d, yyyy') : '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-text-muted text-xs mb-1">End Date</p>
                                                <p className="text-text-primary dark:text-white font-medium">
                                                    {phase.endDate ? format(new Date(phase.endDate), 'MMM d, yyyy') : '—'}
                                                </p>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <p className="text-text-muted text-xs mb-1">Notes</p>
                                                <p className="text-text-primary dark:text-white">{phase.notes}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
