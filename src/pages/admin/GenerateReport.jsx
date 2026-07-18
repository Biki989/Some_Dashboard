import { useState } from 'react';
import { mockProjects, mockReports } from '../../data/mockData';
import { exportPDF, exportCSV, formatReportCSV } from '../../utils/exportUtils';
import { motion } from 'framer-motion';
import { FileBarChart, Download, Mail, CheckCircle, FileSpreadsheet, Sparkles } from 'lucide-react';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function GenerateReport() {
    const [selectedProject, setSelectedProject] = useState(mockProjects[0]?.id || '');
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const project = mockProjects.find((p) => p.id === Number(selectedProject));
    const projectReports = mockReports.filter((r) => r.projectId === Number(selectedProject));
    const latestReport = projectReports[0];

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setGenerated(true);
        }, 2000);
    };

    const handleEmail = () => {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
    };

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-2xl">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Generate Report</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Create and export client reports</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-border dark:border-border-dark card-shadow space-y-5">
                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">Select Project</label>
                    <select
                        value={selectedProject}
                        onChange={(e) => { setSelectedProject(e.target.value); setGenerated(false); }}
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                        {mockProjects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} — {p.clientName}</option>
                        ))}
                    </select>
                </div>

                {project && (
                    <div className="bg-surface-alt dark:bg-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">Status</span>
                            <span className="text-xs font-medium text-text-primary dark:text-white">{project.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">Completion</span>
                            <span className="text-xs font-medium text-primary">{project.completion}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">Phase</span>
                            <span className="text-xs font-medium text-text-primary dark:text-white">{project.currentPhase}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-60"
                >
                    {generating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating Report...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" /> Generate Client Report
                        </>
                    )}
                </button>
            </motion.div>

            {/* Generated report preview */}
            {generated && latestReport && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-border dark:border-border-dark card-shadow space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary dark:text-white">Report Generated</h3>
                            <p className="text-xs text-text-muted">{latestReport.title}</p>
                        </div>
                    </div>

                    <div className="bg-surface-alt dark:bg-white/5 rounded-xl p-4">
                        <p className="text-sm text-text-secondary dark:text-gray-400">{latestReport.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => exportPDF(latestReport, project?.name)}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export PDF
                        </button>
                        <button
                            onClick={() => exportCSV(formatReportCSV(latestReport), `${project?.name}-report.csv`)}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-success/10 text-success hover:bg-success/20 text-sm font-medium transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4" /> Export CSV
                        </button>
                        <button
                            onClick={handleEmail}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 text-sm font-medium transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            {emailSent ? 'Sent to Client! ✓' : 'Email to Client'}
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
