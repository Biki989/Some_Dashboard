import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, Calendar, User, FileText, Tag, CheckCircle } from 'lucide-react';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function CreateProject() {
    const [form, setForm] = useState({
        clientName: '',
        projectName: '',
        projectType: 'Web Application',
        deadline: '',
        description: '',
        budget: '',
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setForm({ clientName: '', projectName: '', projectType: 'Web Application', deadline: '', description: '', budget: '' });
        }, 3000);
    };

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-2xl">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Create Project</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Set up a new project for a client</p>
            </motion.div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-2xl"
                >
                    <CheckCircle className="w-5 h-5 text-success" />
                    <p className="text-sm text-success font-medium">Project created successfully!</p>
                </motion.div>
            )}

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-border dark:border-border-dark card-shadow space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                            <User className="w-3.5 h-3.5 inline mr-1.5" /> Client Name
                        </label>
                        <input
                            name="clientName"
                            value={form.clientName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Sarah Chen"
                            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                            <FolderPlus className="w-3.5 h-3.5 inline mr-1.5" /> Project Name
                        </label>
                        <input
                            name="projectName"
                            value={form.projectName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. E-Commerce Platform"
                            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                            <Tag className="w-3.5 h-3.5 inline mr-1.5" /> Project Type
                        </label>
                        <select
                            name="projectType"
                            value={form.projectType}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                            <option>Web Application</option>
                            <option>Mobile App</option>
                            <option>Machine Learning</option>
                            <option>Software</option>
                            <option>API Development</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                            <Calendar className="w-3.5 h-3.5 inline mr-1.5" /> Deadline
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                        Budget (USD)
                    </label>
                    <input
                        type="number"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        placeholder="e.g. 15000"
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">
                        <FileText className="w-3.5 h-3.5 inline mr-1.5" /> Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe the project scope, goals, and key requirements..."
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                    Create Project
                </button>
            </motion.form>
        </motion.div>
    );
}
