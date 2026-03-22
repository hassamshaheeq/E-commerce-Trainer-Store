const Returns = () => {
    return (
        <div className="min-h-screen bg-black pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4">
                        Returns Policy
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        We want you to love your kicks. If not, we've got you covered.
                    </p>
                    <div className="mt-8 h-1.5 w-32 bg-primary-600 rounded-full mx-auto shadow-lg shadow-primary-500/50"></div>
                </div>

                <div className="space-y-12">
                    {/* Key Info Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-zinc-900 shadow-2xl p-8 rounded-3xl border border-white/5 relative group hover:border-primary-500/50 transition-all duration-300">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">30-Day Returns</h2>
                            <p className="text-zinc-400 leading-relaxed mb-6">
                                You have 30 days from the date of delivery to return any item in its original condition (unworn, with tags, in original packaging).
                            </p>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-zinc-900 shadow-2xl p-8 rounded-3xl border border-white/5 relative group hover:border-primary-500/50 transition-all duration-300">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Fast Refunds</h2>
                            <p className="text-zinc-400 leading-relaxed mb-6">
                                Once we receive and inspect your return, your refund will be processed back to your original payment method within 5-7 business days.
                            </p>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* How to Return Section */}
                    <div className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-white/5">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 text-center underline decoration-primary-600 underline-offset-8">How to Start a Return</h2>
                        <div className="space-y-8">
                            {[
                                { step: '01', title: 'Pack It Up', desc: 'Securely pack your unworn shoes in their original box and packaging.' },
                                { step: '02', title: 'Print Label', desc: 'Download and print our pre-paid return label from our online portal.' },
                                { step: '03', title: 'Drop Off', desc: 'Drop off the package at any authorized courier location.' }
                            ].map((s) => (
                                <div key={s.step} className="flex items-start gap-6 border-b border-white/5 pb-8 last:border-none last:pb-0">
                                    <span className="text-primary-600 font-black text-4xl opacity-50">{s.step}</span>
                                    <div>
                                        <h3 className="text-white font-black uppercase text-xl mb-2">{s.title}</h3>
                                        <p className="text-zinc-400">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Special Notes - Styled Box */}
                    <div className="p-8 bg-black border-2 border-primary-600/30 rounded-3xl shadow-xl shadow-primary-500/5">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Important Notes</h2>
                        <ul className="text-zinc-500 space-y-3 list-disc list-inside">
                            <li>All shoes must be returned in the original, undamaged shoe box.</li>
                            <li>Visible wear, debris on soles, or odor may cause the return to be rejected.</li>
                            <li>Sale items marked as "Final Sale" cannot be returned.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Returns;
