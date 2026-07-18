import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BarChart3, Clock, Package, FileText, MessageSquare,
    Shield, ArrowRight, Zap, Eye, Lock, ChevronRight
} from 'lucide-react';

const features = [
    { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track project progress with interactive charts and metrics' },
    { icon: Clock, title: 'Visual Timeline', desc: 'See every phase of your project on a beautiful roadmap' },
    { icon: Package, title: 'Deliverables Hub', desc: 'Access all files, source code, and documentation in one place' },
    { icon: FileText, title: 'Auto Reports', desc: 'Get weekly reports with summaries, tasks, and milestones' },
    { icon: MessageSquare, title: 'Direct Chat', desc: 'Communicate directly with your developer in real-time' },
    { icon: Eye, title: 'Full Transparency', desc: 'Complete visibility into progress, budget, and timeline' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-surface-darker overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-darker/80 backdrop-blur-xl border-b border-border dark:border-border-dark">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-text-primary dark:text-white">Client Portal</span>
                    </div>
                    <Link
                        to="/login"
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
                    >
                        Login <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 gradient-mesh" />
                <div className="max-w-4xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Zap className="w-3.5 h-3.5" />
                            Secure ・ Transparent ・ Real-time
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-text-primary dark:text-white tracking-tight leading-[1.1] mb-6">
                            Your Project,
                            <br />
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Crystal Clear
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Track progress, access deliverables, review reports, and communicate with your
                            developer — all in one beautiful dashboard.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-primary text-white font-semibold text-base hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Access Portal <ChevronRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="#features"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-border dark:border-border-dark text-text-primary dark:text-white font-medium hover:bg-surface-alt dark:hover:bg-white/5 transition-all"
                            >
                                Learn More
                            </a>
                        </div>
                    </motion.div>

                    {/* Dashboard preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-surface-darker z-10 pointer-events-none" />
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark card-shadow p-6 text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-danger" />
                                <div className="w-3 h-3 rounded-full bg-warning" />
                                <div className="w-3 h-3 rounded-full bg-success" />
                            </div>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                {['68% Complete', 'Development', 'Apr 15, 2026', '87 Health Score'].map((t, i) => (
                                    <div key={i} className="bg-surface-alt dark:bg-white/5 rounded-xl p-4">
                                        <div className="h-2 w-16 bg-primary/20 rounded mb-2" />
                                        <p className="text-sm font-semibold text-text-primary dark:text-white">{t}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-surface-alt dark:bg-white/5 rounded-xl p-4 h-32">
                                        <div className="h-2 w-20 bg-primary/20 rounded mb-3" />
                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-primary/10 rounded" />
                                            <div className="h-2 w-3/4 bg-primary/10 rounded" />
                                            <div className="h-2 w-1/2 bg-primary/10 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-6 bg-surface-alt dark:bg-surface-dark/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-white mb-4">
                            Everything you need to stay informed
                        </h2>
                        <p className="text-text-secondary dark:text-gray-400 max-w-xl mx-auto">
                            A suite of tools designed to give you complete visibility into your project&apos;s lifecycle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-border dark:border-border-dark card-shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <f.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-base font-semibold text-text-primary dark:text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-7 h-7 text-success" />
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-4">Secure by Design</h2>
                    <p className="text-text-secondary dark:text-gray-400 max-w-xl mx-auto mb-8">
                        Role-based access control, encrypted authentication, and secure file delivery ensure your data stays protected.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                        Get Started <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border dark:border-border-dark py-8 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-text-secondary dark:text-gray-400">Client Portal</span>
                    </div>
                    <p className="text-xs text-text-muted">© 2026. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
