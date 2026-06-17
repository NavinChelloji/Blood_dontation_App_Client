export const Avatar = ({ name = "?", sz = 32 }) => (
  <div style={{
    width: sz, height: sz, borderRadius: "50%",
    background: 'var(--primary-color)', color: "#fff", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: sz * 0.33, fontWeight: 800,
  }}>
    {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
  </div>
);