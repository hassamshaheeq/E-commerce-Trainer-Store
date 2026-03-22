import { useState } from 'react';
import Button from '../components/Button';
import api from '../utils/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/contact', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-black pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        Got a question about your order or our latest drops? We're here to help.
                    </p>
                    <div className="mt-8 h-1.5 w-32 bg-primary-600 rounded-full mx-auto shadow-lg shadow-primary-500/50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-xl mb-4">Primekicks HQ</h3>
                            <p className="text-zinc-400">
                                123 Streetwear Ave<br />
                                Urban District<br />
                                London, UK
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-xl mb-4">Email Us</h3>
                            <p className="text-primary-400 font-bold">support@primekicks.com</p>
                            <p className="text-zinc-500 text-sm mt-1">Response time: Within 24 hours</p>
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-xl mb-4">Business Hours</h3>
                            <p className="text-zinc-400">Mon - Fri: 9:00 AM - 6:00 PM</p>
                            <p className="text-zinc-400">Sat - Sun: 10:00 AM - 4:00 PM</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold animate-shake">
                                {error}
                            </div>
                        )}
                        
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Message Sent!</h2>
                                <p className="text-zinc-500">We'll get back to you sooner than you think.</p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-primary-400 hover:text-white font-bold uppercase tracking-widest transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2 px-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all font-semibold"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2 px-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all font-semibold"
                                        placeholder="Your Email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2 px-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all font-semibold"
                                        placeholder="Order # or Inquiry"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2 px-1">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all font-semibold resize-none"
                                        placeholder="What's on your mind?"
                                    ></textarea>
                                </div>
                                <Button type="submit" variant="primary" className="w-full py-5 text-xl" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
