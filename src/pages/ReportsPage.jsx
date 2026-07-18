import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockReports, mockProjects } from '../data/mockData';
import { exportPDF, exportCSV, formatReportCSV } from '../utils/exportUtils';
import { motion } from 'framer-motion';
import {
    FileText, Download, Mail, Calendar, CheckCircle,
    Clock, AlertTriangle, Target, ChevronDown, ChevronUp, FileSpreadsheet
} from 'lucide-react';
import { format } from 'date-fns';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ReportsPage() {
    const { user } = useAuth();
    const [expandedReport, setExpandedReport] = useState(null);
    const [emailSent, setEmailSent] = useState(null);

    const projects = user?.role === 'admin'
        ? mockProjects
        : mockProjects.filter((p) => p.clientId === user?.id);

    const reports = mockReports.filter((r) =>
        projects.some((p) => p.id === r.projectId)
    );

    const handleEmail = (reportId) => {
        setEmailSent(reportId);
        setTimeout(() => setEmailSent(null), 3000);
    };

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Reports</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Weekly progress reports and summaries</p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
                {reports.map((report) => {
                    const project = mockProjects.find((p) => p.id === report.projectId);
                    const isExpanded = expandedReport === report.id;

                    return (
                        <div
                            key={report.id}
                            className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark card-shadow overflow-hidden"
                        >
                            {/* Header */}
                            <button
                                onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                                className="w-full text-left p-5 flex items-start gap-4 hover:bg-surface-alt/50 dark:hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-text-primary dark:text-white">{report.title}</h3>
                                    <p className="text-xs text-text-muted mt-0.5">{project?.name}</p>
                                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-2 line-clamp-2">{report.summary}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="hidden sm:flex items-center gap-1 text-xs text-text-muted">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(report.date), 'MMM d')}
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
                                </div>
                            </button>

                            {/* Expanded content */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="border-t border-border dark:border-border-dark"
                                >
                                    <div className="p-5 grid md:grid-cols-2 gap-5">
                                        {/* Completed Tasks */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle className="w-4 h-4 text-success" />
                                                <h4 className="text-sm font-semibold text-text-primary dark:text-white">Completed Tasks</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {report.completedTasks.map((task, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary dark:text-gray-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Pending Tasks */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Clock className="w-4 h-4 text-warning" />
                                                <h4 className="text-sm font-semibold text-text-primary dark:text-white">Pending Tasks</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {report.pendingTasks.map((task, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary dark:text-gray-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Issues */}
                                        {report.issues.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertTriangle className="w-4 h-4 text-danger" />
                                                    <h4 className="text-sm font-semibold text-text-primary dark:text-white">Issues</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {report.issues.map((issue, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-danger">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                                                            {issue}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Next Milestones */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Target className="w-4 h-4 text-primary" />
                                                <h4 className="text-sm font-semibold text-text-primary dark:text-white">Next Milestones</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {report.nextMilestones.map((m, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary dark:text-gray-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                        {m}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="px-5 pb-5 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => exportPDF(report, project?.name)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Export PDF
                                        </button>
                                        <button
                                            onClick={() => exportCSV(formatReportCSV(report), `${project?.name}-report.csv`)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-success/10 text-success hover:bg-success/20 text-xs font-medium transition-colors"
                                        >
                                            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
                                        </button>
                                        <button
                                            onClick={() => handleEmail(report.id)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 text-xs font-medium transition-colors"
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                            {emailSent === report.id ? 'Sent! ✓' : 'Email Report'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
