import { MapPin, Search } from "lucide-react";
import { Card } from "../card/Card"
import { useState } from "react";
import { Button } from "../button/Button";
const MAP_PINS = [
  [18, 25, 'var(--blue)'], [45, 12, 'var(--primary-color)'], [63, 44, 'var(--primary-color)'],
  [28, 58, 'var(--primary-color)'],  [76, 24, "#F77F00"],
];

export const BloodSearchCard = () => {
    const [bgrp,    setBgrp]    = useState("O+");
    const [within,  setWithin]  = useState("10 km");
    return (
    <Card>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: "0 0 10px" }}>Find Donors Near You</h3>

        {/* Map placeholder */}
        <div style={{ height: 96, borderRadius: 'var(--radius-md)', background: "#D8EDD4", marginBottom: 10, position: "relative", overflow: "hidden" }}>
            {/* Road lines */}
            <div style={{ position: "absolute", top: "38%", left: 0, right: 0, height: 1.5, background: "rgba(255,255,255,0.55)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "42%", width: 1.5, background: "rgba(255,255,255,0.55)" }} />
            {/* Map pins */}
            {MAP_PINS.map(([x, y, col], i) => (
                <MapPin key={i} size={14} color={col} style={{ position: "absolute", left: `${x}%`, top: `${y}%` }} />
            ))}
        </div>

        {/* Filters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[
                ["Blood Group", bgrp, setBgrp, ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]],
                ["Within", within, setWithin, ["5 km", "10 km", "20 km", "50 km"]],
            ].map(([label, val, set, opts]) => (
                <div key={label}>
                    <label style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', display: "block", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {label}
                    </label>
                    <select
                        value={val}
                        onChange={e => set(e.target.value)}
                        style={{ width: "100%", padding: "5px 8px", border: `1px solid var(--border)`, borderRadius: 'var(--radius-sm)', fontSize: 12, background: 'var(--surface)', fontFamily: "inherit", cursor: "pointer" }}
                    >
                        {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
            ))}
        </div>
        <Button variant="primary" size="sm" full icon={<Search size={12} />}>Search Donors</Button>
    </Card>
    )
}