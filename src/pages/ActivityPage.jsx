import { useAuth } from '../context/AuthContext';
import { mockActivities, mockProjects } from '../data/mockData';
import { motion } from 'framer-motion';
import {
    Code, Upload, CheckCircle, FileText, Brain, MessageSquare,
    Bug, Rocket, Zap, Settings, Activity
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

const iconMap = {
    code: Code,
    upload: Upload,
    'check-circle': CheckCircle,
    'file-text': FileText,
    brain: Brain,
    'message-square': MessageSquare,
    bug: Bug,
    rocket: Rocket,
    zap: Zap,
    settings: Settings,
};

const typeColors = {
    update: 'bg-primary/10 text-primary',
    deliverable: 'bg-secondary/10 text-secondary',
    milestone: 'bg-success/10 text-success',
    report: 'bg-accent/10 text-accent',
    message: 'bg-warning/10 text-warning',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ActivityPage() {
    const { user } = useAuth();

    const projects = user?.role === 'admin'
        ? mockProjects
        : mockProjects.filter((p) => p.clientId === user?.id);

    const activities = mockActivities
        .filter((a) => projects.some((p) => p.id === a.projectId))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Group by date
    const grouped = activities.reduce((acc, act) => {
        const date = new Date(act.timestamp);
        let label;
        if (isToday(date)) label = 'Today';
        else if (isYesterday(date)) label = 'Yesterday';
        else label = format(date, 'MMMM d, yyyy');

        if (!acc[label]) acc[label] = [];
        acc[label].push(act);
        return acc;
    }, {});

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Activity Log</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">A chronological feed of all project updates</p>
            </motion.div>

            {Object.entries(grouped).map(([date, acts]) => (
                <motion.div key={date} variants={fadeUp}>
                    <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-sm font-semibold text-text-primary dark:text-white">{date}</h2>
                        <div className="flex-1 h-px bg-border dark:bg-border-dark" />
                    </div>
                    <div className="space-y-0">
                        {acts.map((act, i) => {
                            const Icon = iconMap[act.icon] || Activity;
                            const project = mockProjects.find((p) => p.id === act.projectId);
                            const colorClass = typeColors[act.type] || 'bg-surface-alt text-text-muted';
                            const isLast = i === acts.length - 1;

                            return (
                                <div key={act.id} className="flex gap-3 relative">
                                    {/* Timeline */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center z-10`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        {!isLast && (
                                            <div className="w-px flex-1 bg-border dark:bg-border-dark min-h-[20px]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-4">
                                        <div className="bg-white dark:bg-surface-dark rounded-xl px-4 py-3 border border-border dark:border-border-dark card-shadow">
                                            <p className="text-sm text-text-primary dark:text-white">{act.message}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[11px] text-text-muted">
                                                    {format(new Date(act.timestamp), 'h:mm a')}
                                                </span>
                                                <span className="text-[11px] text-primary font-medium">
                                                    {project?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
