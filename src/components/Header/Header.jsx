import {
  Droplets,MapPin,ChevronDown,Menu,X,Bell
} from "lucide-react";
import { Avatar } from "../common/avatar/Avatar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export function Header({sideOpen, setSideOpen, mob}){
   const {user} = useContext(AuthContext);
    const [areaName, setAreaName] =useState('Loading location...');

  useEffect(() => {
    const fetchAreaName = async () => {
      try {
        const lat = user?.lat || user?.latitude;
        const lng = user?.lng || user?.longitude;
        if (!lat || !lng) {
          setAreaName('Location Locked');
          return;
        }
        
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`);
        if (response.ok) {
          const data = await response.json();
          const addr = data.address || {};
          const area = addr.suburb || addr.neighbourhood || addr.suburb || addr.residential || addr.town || addr.city_district || addr.city || 'Location Locked';
          setAreaName(`${area}`);
        } else {
          setAreaName('Location Locked');
        }
      } catch (err) {
        console.error('Error fetching area name:', err);
        setAreaName('Location Locked');
      }
    };
    fetchAreaName();
  }, [user]);
    return <header className="layout-header">
        {/* Hamburger */}
        <button
          onClick={() => setSideOpen(s => !s)}
          className="side-menu-icon"
        >
          {sideOpen && mob ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div className="dropplet-icon-container">
            <Droplets size={16} color="#fff" />
          </div>
          <div>
            <div className="logo-title">BloodDonor</div>
            <div className="logo-subtitle">EMERGENCY NETWORK</div>
          </div>
        </div>

        {/* Search bar — hidden on mobile */}
        {/* {!mob && (
          <div style={{ flex:1, maxWidth:380, position:"relative" }}>
            <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.muted }} />
            <input
              placeholder="Search donors, blood group, hospitals..."
              style={{
                width:"100%", padding:"7px 12px 7px 30px",
                borderRadius:T.r.pill, border:`1px solid ${T.border}`,
                background:T.bg, fontSize:12, outline:"none",
                fontFamily:"inherit", color:T.text,
              }}
            />
          </div>
        )} */}

        {/* Right controls */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:14 }}>
          {!mob && (
            <div className="user-location-info">
              <MapPin size={13} color='var(--primary-color)' />
              <span>{areaName}</span>
              <ChevronDown size={12} />
            </div>
          )}

          {/* Bell */}
          <div style={{ position:"relative", cursor:"pointer" }}>
            <Bell size={19} color='var(--sub)'/>
            <div className="notification">4</div>
          </div>

          {/* Profile */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Avatar name={user?.name} sz={33} />
            {!mob && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text)', lineHeight:1.2 }}>{user?.name}</div>
                <div style={{ fontSize:9, color:'var(--muted)' }}>{user?.role}</div>
              </div>
            )}
          </div>
        </div>
      </header>
}