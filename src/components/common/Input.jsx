import { useRef } from 'react';

export default function Input({
  label,
  error,
  type = 'text',
  options = [], 
  className = '',
  ...props
}) {
  const containerStyle = {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  };

  const labelStyle = {
    fontSize: '0.8125rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    marginBottom: '0.375rem',
    textAlign: 'left'
  };

  const inputBaseStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '0.875rem',
    borderRadius: '8px',
    border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: 'var(--text-primary)',
    transition: 'all 0.2s ease',
  };

  const errorStyle = {
    color: 'var(--danger)',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    textAlign: 'left'
  };

  const inputRef = useRef(null);

const handleFocus = () => {
  if (!inputRef.current) return;
  inputRef.current.style.borderColor = error ? 'var(--danger)' : 'var(--primary)';
  inputRef.current.style.boxShadow = error
    ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
    : '0 0 0 3px rgba(229, 30, 42, 0.1)';
};

const handleBlur = () => {
  if (!inputRef.current) return;
  inputRef.current.style.borderColor = error ? 'var(--danger)' : 'var(--border-color)';
  inputRef.current.style.boxShadow = 'none';
};

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      
      {type === 'select' ? (
        <select 
          style={inputBaseStyle} 
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value !== undefined ? opt.value : opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea 
          style={{ ...inputBaseStyle, minHeight: '80px', resize: 'vertical' }} 
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          {...props}
        />
      ) : (
        <input 
          type={type} 
          style={inputBaseStyle} 
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          {...props}
        />
      )}
      
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
