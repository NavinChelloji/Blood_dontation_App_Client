import { useState } from "react";
import { NAV_MENU } from "../../constants/navmenu";
import { LogOut } from "lucide-react";
import { Button } from "../common/button/Button";
import { useNavigate } from "react-router-dom";


export const SidebarContent = ({ mob, setSideOpen }) => {
  const [active, setActive] = useState("Dashboard");
  const navigate = useNavigate();
  const onLogout = ()=>{
    navigate('/');
  }
  return (
    <>
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {NAV_MENU.map(([Icon, label, badge]) => {
          const act = active === label;
          return (
            <button
              key={label}
              onClick={() => { setActive(label); if (mob) setSideOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "8px 14px 8px 13px", border: "none", fontFamily: "inherit",
                background: act ? 'var(--primary-bg-color)' : "transparent",
                color: act ? 'var(--primary-color)' : 'var(--sub)',
                fontWeight: act ? 700 : 500, fontSize: 12,
                cursor: "pointer", textAlign: "left",
                borderLeft: `3px solid ${act ? 'var(--primary-color)' : "transparent"}`,
                transition: "background 0.12s, color 0.12s",
              }}
            >
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  background: 'var(--primary-color)', color: "#fff", borderRadius: "50%",
                  width: 16, height: 16, fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* CTA card inside sidebar */}
     
        <Button
          onClick={onLogout}
         variant="outline"
        >
          <LogOut size={18} />
          Logout
        </Button>
    </>
  )
};