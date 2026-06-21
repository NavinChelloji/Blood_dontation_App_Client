export default function Table({
  columns = [],
  data = [],
  className = '',
  emptyMessage = 'No records found.',
  onRowClick,
  ...props
}) {
  const wrapperStyle = {
    width: '100%',
    overflowX: 'auto',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    boxShadow: 'var(--shadow-sm)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
    textAlign: 'left'
  };

  const thStyle = {
    padding: '12px 16px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  };

  const tdStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    verticalAlign: 'middle'
  };

  return (
    <div style={wrapperStyle} className={className}>
      <table style={tableStyle} {...props}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={col.key || index} style={thStyle}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                  borderBottom: `1px solid var(--border-color)`,
                  backgroundColor: rowIndex % 2 === 0 ? 'var(--bg)' : 'transparent'
                }}
                onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                onMouseLeave={(e) => { if (onRowClick) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {columns.map((col, colIndex) => (
                  <td key={col.key || colIndex} style={tdStyle}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
