import { useState } from 'react';
import { mockProjects } from '../../data/mockData';
import { motion } from 'framer-motion';
import { TrendingUp, Upload, FileText, CheckCircle, Save } from 'lucide-react';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const phases = ['Planning', 'Design', 'Development', 'Testing', 'Deployment'];

export default function UpdateProgress() {
    const [selectedProject, setSelectedProject] = useState(mockProjects[0]?.id || '');
    const [phase, setPhase] = useState('Development');
    const [completion, setCompletion] = useState(68);
    const [notes, setNotes] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-2xl">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Update Progress</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Update project phase and completion status</p>
            </motion.div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-2xl"
                >
                    <CheckCircle className="w-5 h-5 text-success" />
                    <p className="text-sm text-success font-medium">Progress updated successfully!</p>
                </motion.div>
            )}

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-border dark:border-border-dark card-shadow space-y-5">
                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">Select Project</label>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                        {mockProjects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} — {p.clientName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">Current Phase</label>
                    <div className="grid grid-cols-5 gap-2">
                        {phases.map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPhase(p)}
                                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all
                  ${phase === p
                                        ? 'gradient-primary text-white shadow-md'
                                        : 'bg-surface-alt dark:bg-white/5 text-text-secondary dark:text-gray-400 hover:bg-primary/10 hover:text-primary'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                        Completion — {completion}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={completion}
                        onChange={(e) => setCompletion(Number(e.target.value))}
                        className="w-full h-2 bg-surface-alt dark:bg-white/10 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md"
                    />
                    <div className="w-full h-2 bg-surface-alt dark:bg-white/10 rounded-full overflow-hidden mt-2">
                        <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                        <FileText className="w-3.5 h-3.5 inline mr-1.5" /> Update Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="Describe what was accomplished, any blockers, and next steps..."
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                        <Upload className="w-3.5 h-3.5 inline mr-1.5" /> Upload Files
                    </label>
                    <div className="border-2 border-dashed border-border dark:border-border-dark rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                        <p className="text-sm text-text-secondary dark:text-gray-400">Drag & drop files or click to browse</p>
                        <p className="text-xs text-text-muted mt-1">Supports any file type up to 50MB</p>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                    <Save className="w-4 h-4" /> Save Progress Update
                </button>
            </motion.form>
        </motion.div>
    );
}
