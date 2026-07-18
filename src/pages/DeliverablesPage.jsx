import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockDeliverables, mockProjects } from '../data/mockData';
import { motion } from 'framer-motion';
import {
    Package, Download, Eye, Clock, Code, FileText, Brain,
    Image, Archive, Search, Filter, ChevronRight, Layers
} from 'lucide-react';
import { format } from 'date-fns';

const typeConfig = {
    'source-code': { icon: Code, label: 'Source Code', color: 'text-primary bg-primary/10' },
    document: { icon: FileText, label: 'Document', color: 'text-secondary bg-secondary/10' },
    model: { icon: Brain, label: 'ML Model', color: 'text-accent bg-accent/10' },
    design: { icon: Image, label: 'Design', color: 'text-warning bg-warning/10' },
    build: { icon: Archive, label: 'Build', color: 'text-success bg-success/10' },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DeliverablesPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedProject, setSelectedProject] = useState('all');

    const projects = user?.role === 'admin'
        ? mockProjects
        : mockProjects.filter((p) => p.clientId === user?.id);

    const deliverables = mockDeliverables
        .filter((d) => selectedProject === 'all' || d.projectId === Number(selectedProject))
        .filter((d) => filterType === 'all' || d.type === filterType)
        .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-white">Deliverables</h1>
                    <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Access all project files and documentation</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-text-muted" />
                    <span className="text-text-muted">{deliverables.length} files</span>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search deliverables..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                    />
                </div>
                <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white outline-none focus:border-primary"
                >
                    <option value="all">All Projects</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-sm text-text-primary dark:text-white outline-none focus:border-primary"
                >
                    <option value="all">All Types</option>
                    <option value="source-code">Source Code</option>
                    <option value="document">Documents</option>
                    <option value="model">ML Models</option>
                    <option value="design">Design</option>
                    <option value="build">Builds</option>
                </select>
            </motion.div>

            {/* Files Grid */}
            <motion.div variants={fadeUp} className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {deliverables.map((item) => {
                    const config = typeConfig[item.type] || typeConfig.document;
                    const Icon = config.icon;
                    const project = mockProjects.find((p) => p.id === item.projectId);

                    return (
                        <motion.div
                            key={item.id}
                            variants={fadeUp}
                            className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark card-shadow hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl ${config.color} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs text-text-muted bg-surface-alt dark:bg-white/5 px-2.5 py-1 rounded-lg font-medium">
                                    {item.version}
                                </span>
                            </div>

                            <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-1">{item.name}</h3>
                            <p className="text-xs text-text-muted mb-3">{project?.name}</p>

                            <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                                <span className="flex items-center gap-1">
                                    <Layers className="w-3 h-3" /> {item.size}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {format(new Date(item.date), 'MMM d')}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-colors">
                                    <Download className="w-3.5 h-3.5" /> Download
                                </button>
                                <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border dark:border-border-dark text-text-secondary dark:text-gray-400 hover:bg-surface-alt dark:hover:bg-white/5 text-xs font-medium transition-colors">
                                    <Eye className="w-3.5 h-3.5" /> Preview
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {deliverables.length === 0 && (
                <div className="text-center py-16">
                    <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary dark:text-gray-400">No deliverables match your filters</p>
                </div>
            )}
        </motion.div>
    );
}
