import { Activity, ArrowRight, Bell, Droplets, Heart } from "lucide-react"
import { Card } from "../../components/common/card/Card"

const STATS = [
  [Droplets, "My Blood Group",  "O+", "View Profile",   'var(--primary-color)',  'var(--primary-bg-color)'],
  [Activity, "Total Donations", "12", "View History",   'var(--blue)','var(--primary-bg-color)' ],
  [Heart,    "Lives Impacted",   "4", "See Impact",     'var(--green)','var(--primary-bg-color)'],
  [Bell,     "Active Requests",  "3", "View Requests",  'var(--amber)','var(--primary-bg-color)'],
];

export const StatsRow = ({mob})=>{
    return (
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${mob ? 2 : 4}, 1fr)`, gap:12, marginBottom:16 }}>
            {STATS.map(([Icon, label, val, sub, col,bg_col]) => (
              <Card key={label} hover>
                <div style={{ width:36, height:36, borderRadius:'var(--radius-md)', background:`${bg_col}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8 }}>
                  <Icon size={16} color={col} />
                </div>
                <p style={{ fontSize:10, color:'var(--sub)', margin:"0 0 3px", fontWeight:600 }}>{label}</p>
                <p style={{ fontSize:26, fontWeight:900, color: 'var(--text)', margin:"0 0 6px", lineHeight:1 }}>{val}</p>
                <button style={{ background:"none", border:"none", color:'var(--primary-color)', fontSize:11, fontWeight:600, cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:3, fontFamily:"inherit" }}>
                  {sub} <ArrowRight size={11} />
                </button>
              </Card>
            ))}
          </div>
    )
}