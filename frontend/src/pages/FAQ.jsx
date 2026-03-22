import { useState } from 'react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const questions = [
        { q: "How do I track my order?", a: "Once your order has shipped, you will receive an email with a tracking number and a link to trace your package through our official courier's website." },
        { q: "What is your shipping policy?", a: "We offer local and international shipping. Standard shipping takes 3-5 business days, while Express takes 1-2 business days. Free shipping is available for orders over £150." },
        { q: "How can I return an item?", a: "Returns must be made within 30 days of receipt. All items must be in their original, unworn condition with tags still attached. Please visit our Returns portal to initiate the process." },
        { q: "Are your sneakers authentic?", a: "Yes, 100%. Every pair of sneakers at Primekicks is guaranteed authentic. We include digital certificates of authenticity with every purchase, which you can verify on our site." },
        { q: "Do you restock sold-out items?", a: "We often restock popular releases, although limited-edition drops may not return. We recommend following us on social media for the latest restock alerts." },
        { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Cash on Delivery for select regions." }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-black pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 underline decoration-primary-600 underline-offset-[20px] decoration-4">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 transition-transform transform hover:scale-105 duration-500">
                        Frequently Asked
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto border-none">
                        Our knowledge base for the Primekicks community.
                    </p>
                </div>

                <div className="space-y-6">
                    {questions.map((item, index) => (
                        <div 
                            key={index} 
                            className="bg-zinc-900 shadow-2xl rounded-3xl border border-white/5 overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-8 text-left focus:outline-none group active:bg-zinc-800"
                            >
                                <span className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-primary-400 transition-colors">
                                    {item.q}
                                </span>
                                <div className={`w-8 h-8 rounded-full border-2 border-zinc-700 flex items-center justify-center transition-all duration-300 ${activeIndex === index ? 'rotate-180 border-primary-600 bg-primary-600 shadow-lg shadow-primary-500/50' : ''}`}>
                                    <svg className={`w-5 h-5 text-white transform transition-transform ${activeIndex === index ? 'scale-125' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            
                            <div 
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-8 pt-0 text-zinc-400 leading-relaxed text-lg border-t border-white/5 bg-zinc-950/20">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 p-12 rounded-[40px] text-center shadow-2xl shadow-primary-500/20 group hover:-translate-y-2 transition-transform duration-500">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Still got questions?</h2>
                    <p className="text-white/80 mb-8 max-w-lg mx-auto font-semibold">
                        Reach out to our support team and we'll get you back on track in no time.
                    </p>
                    <a href="/contact" className="inline-block bg-white text-primary-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl hover:bg-zinc-100 transform active:scale-95 transition-all">
                        Hit Us Up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
