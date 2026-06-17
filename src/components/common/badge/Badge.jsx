
export function Badge({ children, variant = 'info', className = '', ...props }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '9999px',
    width: 'fit-content',
    textTransform: 'capitalize'
  };

  const variants = {
    success: {
      backgroundColor: 'var(--success-light)',
      color: 'var(--success)'
    },
    warning: {
      backgroundColor: 'var(--warning-light)',
      color: 'var(--warning)'
    },
    danger: {
      backgroundColor: 'var(--danger-light)',
      color: 'var(--danger)'
    },
    info: {
      backgroundColor: 'var(--info-light)',
      color: 'var(--info)'
    },
    gray: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)'
    },
    blood: {
      backgroundColor: 'var(--primary-light)',
      color: 'var(--primary)',
      border: '1px solid rgba(229, 30, 42, 0.2)'
    }
  };

  let selectedVariant = variant;
  const status = String(children).toLowerCase();
  
  if (status === 'open' || status === 'completed' || status === 'low' || status === 'available') {
    selectedVariant = 'success';
  } else if (status === 'accepted' || status === 'in progress') {
    selectedVariant = 'info';
  } else if (status === 'high' || status === 'critical' || status === 'urgent') {
    selectedVariant = 'danger';
  } else if (status === 'medium' || status === 'pending') {
    selectedVariant = 'warning';
  } else if (status === 'cancelled' || status === 'expired' || status === 'unavailable') {
    selectedVariant = 'gray';
  } else if (['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'].includes(status)) {
    selectedVariant = 'blood';
  }

  const style = {
    ...baseStyle,
    ...variants[selectedVariant]
  };

  return (
    <span style={style} className={className} {...props}>
      {children}
    </span>
  );
}

