import { Link } from '@inertiajs/react';

export default function PrimaryButton({ className = '', disabled, children, link, onClick, ...props }) {
    return (
        <button
            {...props}
            className={`
                inline-flex items-center px-4 py-2 bg-primaryColor border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-SecondaryColor focus:bg-SecondaryColor active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition ease-in-out duration-150
                ${disabled ? 'opacity-25 cursor-not-allowed' : ''}
                ` + className
            }
            onClick={(e) => {
                if (disabled) {
                    e.preventDefault();
                    return;
                }
                if (onClick) {
                    onClick(e);
                }
            }}
            disabled={disabled}
        >
            {link ? <Link href={link}>{children}</Link> : children}
        </button>
    );
}
