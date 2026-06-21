
import { NAV_MENU } from "../../constants/navmenu";
import { LogOut } from "lucide-react";
import { Button } from "../common/button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";


export const SidebarContent = () => {
  // const [active, setActive] = useState("Dashboard");
   const { pathname } = useLocation();
  const navigate = useNavigate();
  const onLogout = ()=>{
    localStorage.removeItem("token");
    navigate('/');
  }
  return (
    <>
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {NAV_MENU.map((item) =>{
          const isActive = pathname === item.path || 
              (item.id === 'requestsList' && pathname.startsWith('/requests')) ||
              (item.id === 'donorSearch' && pathname.startsWith('/donors'));
            return (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
        }
        )}
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