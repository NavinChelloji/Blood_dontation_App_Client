import React from 'react';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
    icon,
    ...props
}) {
    const baseStyles = {
        display: 'inline-flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontFamily: 'inherit',
        borderRadius: '8px',
        border: '1px solid transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        outline: 'none',
        textDecoration: 'none'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            borderColor: 'var(--primary)',
            hover: {
                backgroundColor: 'var(--primary-hover)',
                borderColor: 'var(--primary-hover)'
            }
        },
        secondary: {
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            hover: {
                backgroundColor: '#E5E7EB'
            }
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            borderColor: 'var(--primary)',
            hover: {
                backgroundColor: 'var(--primary-light)'
            }
        },
        danger: {
            backgroundColor: 'var(--danger)',
            color: '#FFFFFF',
            borderColor: 'var(--danger)',
            hover: {
                backgroundColor: '#DC2626'
            }
        },
        text: {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            borderColor: 'transparent',
            hover: {
                color: 'var(--text-primary)',
                textDecoration: 'underline'
            }
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--sub)',
            borderColor: 'var(--border)',
            hover: {
                backgroundColor: 'var(--primary-bg-color)'
            }

        }
    };

    const sizes = {
        sm: { padding: '6px 12px', fontSize: '0.8125rem' },
        md: { padding: '10px 18px', fontSize: '0.875rem' },
        lg: { padding: '12px 24px', fontSize: '1rem' }
    };

    const [isHovered, setIsHovered] = React.useState(false);

    const style = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        ...(isHovered && !disabled ? (variants[variant].hover || {}) : {}),
    };

    return (
        <button
            type={type}
            style={style}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={className}
            disabled={disabled}
            {...props}
        >
            {icon && icon}
            {children}
        </button>
    );
}
