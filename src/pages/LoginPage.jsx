import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        await new Promise((r) => setTimeout(r, 800));
        const result = login(email, password);

        if (result.success) {
            navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const fillDemo = (role) => {
        if (role === 'admin') {
            setEmail('admin@portal.dev');
            setPassword('admin123');
        } else {
            setEmail('client@portal.dev');
            setPassword('client123');
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-surface-darker">
            {/* Left panel */}
            <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/30 blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
                </div>
                <div className="relative text-white max-w-md">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-sm">
                        <Shield className="w-7 h-7" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome to<br />Client Portal</h2>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                        Your secure dashboard for tracking project progress, accessing deliverables, and staying connected.
                    </p>
                    <div className="space-y-4">
                        {['Real-time project tracking', 'Secure file delivery', 'Automated weekly reports'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <span className="text-white/90 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-text-primary dark:text-white">Client Portal</span>
                    </div>

                    <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-2">Sign in to your account</h1>
                    <p className="text-text-secondary dark:text-gray-400 mb-8">Enter your credentials to access the portal</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-white/5 text-text-primary dark:text-white placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary dark:hover:text-white transition-colors"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-danger text-sm bg-danger/10 px-4 py-2 rounded-xl"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-8 p-4 rounded-xl bg-surface-alt dark:bg-white/5 border border-border dark:border-border-dark">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Quick Demo Access</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => fillDemo('admin')}
                                className="px-3 py-2 rounded-lg border border-border dark:border-border-dark text-xs font-medium text-text-primary dark:text-white hover:bg-white dark:hover:bg-white/10 transition-colors"
                            >
                                👨‍💻 Developer Login
                            </button>
                            <button
                                onClick={() => fillDemo('client')}
                                className="px-3 py-2 rounded-lg border border-border dark:border-border-dark text-xs font-medium text-text-primary dark:text-white hover:bg-white dark:hover:bg-white/10 transition-colors"
                            >
                                👤 Client Login
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-text-muted">
                        <Link to="/" className="text-primary hover:text-primary-dark font-medium transition-colors">← Back to home</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
