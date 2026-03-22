const ShippingInfo = () => {
    return (
        <div className="min-h-screen bg-black pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4">
                        Shipping Info
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        Fast delivery for your latest kicks.
                    </p>
                    <div className="mt-8 h-1.5 w-32 bg-primary-600 rounded-full mx-auto shadow-lg shadow-primary-500/50"></div>
                </div>

                <div className="space-y-12">
                    {/* Shipping Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Standard', time: '3-5 Business Days', price: '£5.00', icon: 'M5 13l4 4L19 7' },
                            { title: 'Express', time: '1-2 Business Days', price: '£10.00', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                            { title: 'VIP', time: 'Next Day Delivery', price: 'FREE for Orders > £200', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
                        ].map((opt) => (
                            <div key={opt.title} className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 service-card group hover:border-primary-500/30 transition-all duration-300">
                                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-white font-black uppercase tracking-tighter text-2xl mb-2">{opt.title}</h3>
                                <p className="text-primary-400 font-bold mb-1">{opt.price}</p>
                                <p className="text-zinc-500 text-sm">{opt.time}</p>
                            </div>
                        ))}
                    </div>

                    {/* International Shipping */}
                    <div className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">International Shipping</h2>
                                <p className="text-zinc-400 max-w-xl leading-relaxed">
                                    We deliver worldwide. Shipping rates and times vary depending on your location. Customs fees and import duties may apply to orders outside the UK.
                                </p>
                            </div>
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-14 h-14 bg-zinc-800 border-2 border-black rounded-full flex items-center justify-center text-zinc-400 font-bold">
                                        🌍
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tracking Info */}
                    <div className="bg-gradient-to-br from-primary-600/20 via-transparent to-transparent p-10 rounded-3xl border border-white/10">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">Track Your Order</h2>
                        <p className="text-zinc-400 leading-relaxed mb-8">
                            Once your order ships, you will receive an email with a tracking number and a link to follow your package's journey to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;
