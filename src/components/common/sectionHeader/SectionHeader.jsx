import { ChevronRight } from "lucide-react";

export const SectionHeader = ({ title, action , onActionClick}) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{title}</h2>
    {action && (
      <button style={{
        background: "none", border: "none", color: 'var(--primary-color)',
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 2, fontFamily: "inherit",
      }} onClick={onActionClick}>
        {action} <ChevronRight size={12} />
      </button>
    )}
  </div>
);