import { useState } from "react";

export const Card = ({ children, p = "20px", hover, style: ext }) => {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        border: `1px solid var(--surface)`, padding: p,
        boxShadow: h ? "0 6px 20px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.18s", ...ext,
      }}
    >
      {children}
    </div>
  );
};


export default function ExtraCard({ 
  children, 
  title, 
  subtitle, 
  extra, 
  className = '', 
  padding = '1.25rem', 
  ...props 
}) {
  const cardStyle = {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const bodyStyle = {
    padding: padding,
    flex: 1
  };

  return (
    <div style={cardStyle} className={`hover-lift ${className}`} {...props}>
      {(title || subtitle || extra) && (
        <div style={headerStyle}>
          <div>
            {title && <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>{subtitle}</p>}
          </div>
          {extra && <div style={{ display: 'flex', alignItems: 'center' }}>{extra}</div>}
        </div>
      )}
      <div style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}
