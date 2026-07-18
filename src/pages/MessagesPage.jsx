import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockMessages, mockProjects } from '../data/mockData';
import { motion } from 'framer-motion';
import { Send, Paperclip, Image, Smile, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function MessagesPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const [selectedProject, setSelectedProject] = useState(1);
    const messagesEndRef = useRef(null);

    const projects = user?.role === 'admin'
        ? mockProjects
        : mockProjects.filter((p) => p.clientId === user?.id);

    const projectMessages = messages
        .filter((m) => m.projectId === selectedProject)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [projectMessages.length]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            projectId: selectedProject,
            senderId: user.id,
            senderName: user.name,
            senderRole: user.role,
            message: newMessage.trim(),
            timestamp: new Date().toISOString(),
            read: false,
        };
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    const selectedProjectData = mockProjects.find((p) => p.id === selectedProject);

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">Messages</h1>
                <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Communicate with your {user?.role === 'admin' ? 'clients' : 'developer'}</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark card-shadow overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
                {/* Project selector */}
                <div className="flex items-center gap-3 p-4 border-b border-border dark:border-border-dark">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {projects.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedProject(p.id)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                  ${selectedProject === p.id
                                        ? 'bg-primary text-white'
                                        : 'bg-surface-alt dark:bg-white/5 text-text-secondary dark:text-gray-400 hover:bg-surface-alt/80'
                                    }`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {projectMessages.length === 0 && (
                        <div className="flex items-center justify-center h-full text-text-muted text-sm">
                            No messages yet. Start the conversation!
                        </div>
                    )}
                    {projectMessages.map((msg) => {
                        const isMe = msg.senderId === user.id;
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] ${isMe ? 'order-2' : ''}`}>
                                    {!isMe && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                                <span className="text-white text-[10px] font-semibold">{msg.senderName.charAt(0)}</span>
                                            </div>
                                            <span className="text-xs font-medium text-text-primary dark:text-white">{msg.senderName}</span>
                                            <span className="text-[10px] text-text-muted">
                                                {format(new Date(msg.timestamp), 'h:mm a')}
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                      ${isMe
                                                ? 'bg-primary text-white rounded-br-md'
                                                : 'bg-surface-alt dark:bg-white/5 text-text-primary dark:text-white rounded-bl-md border border-border dark:border-border-dark'
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                    {isMe && (
                                        <p className="text-[10px] text-text-muted mt-1 text-right">
                                            {format(new Date(msg.timestamp), 'h:mm a')}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-border dark:border-border-dark">
                    <div className="flex items-center gap-2">
                        <button type="button" className="p-2 rounded-xl text-text-muted hover:text-text-primary dark:hover:text-white hover:bg-surface-alt dark:hover:bg-white/5 transition-colors">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-alt dark:bg-white/5 border border-transparent focus:border-primary/30 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-2.5 rounded-xl gradient-primary text-white disabled:opacity-40 transition-opacity hover:shadow-md"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
