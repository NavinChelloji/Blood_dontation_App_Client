export const BloodGroup = ({ g, sz = 36 }) => (
  <div style={{
    width: sz, height: sz, borderRadius: "50%",
    background: 'var(--primary-bg-color)', color: 'var(--primary-color)', flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: sz * 0.27, fontWeight: 900,
  }}>
    {g}
  </div>
);