const Button = ({ children, variant = 'primary', type = 'button', onClick, disabled, className = '', ...props }) => {
    const baseClasses = 'px-8 py-4 font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1',
        secondary: 'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20',
        outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 shadow-lg shadow-primary-500/10',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20',
        ghost: 'text-zinc-400 hover:bg-white/5'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
