const Button = ({ children, variant = 'primary', type = 'button', onClick, disabled, className = '', ...props }) => {
    const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'text-gray-700 hover:bg-gray-100'
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
