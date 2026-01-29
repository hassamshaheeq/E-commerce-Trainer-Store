import { useState } from 'react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! How can I help you today?", sender: "bot" }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                sender: "user"
            };
            setMessages([...messages, newMessage]);
            setInputMessage('');

            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    text: "Thank you for your message! Our team will get back to you shortly.",
                    sender: "bot"
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-80 h-96 flex flex-col mb-4 border border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Chat Support</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <div className="relative">
                {/* Animated Pulse Rings */}
                {!isOpen && (
                    <>
                        <div className="absolute inset-0 w-18 h-18 bg-primary rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 w-18 h-18 bg-primary rounded-full animate-pulse opacity-30"></div>
                    </>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white w-18 h-18 rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group animate-float"
                    aria-label="Toggle chat"
                    style={{
                        animation: !isOpen ? 'float 3s ease-in-out infinite' : 'none'
                    }}
                >
                    {/* Rotating gradient border effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-600 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>

                    {isOpen ? (
                        <span className="text-3xl relative z-10 transform group-hover:rotate-90 transition-transform duration-300">✕</span>
                    ) : (
                        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {/* Notification Badge */}
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                        </div>
                    )}
                </button>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;
