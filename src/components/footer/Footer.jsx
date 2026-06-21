import { Droplets } from "lucide-react"

export const Footer = ({ mob }) => {
    return (
        <div style={{ background: "#0F172A", borderRadius: 'var(--radius-xl)', padding: "24px 20px", color: "#94A3B8" }}>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "1.5fr 1fr 1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

                {/* Brand column */}
                <div style={{ gridColumn: mob ? "1 / -1" : "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Droplets size={16} color='var(--primary-color)' />
                        <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>BloodDonor</span>
                    </div>
                    <p style={{ fontSize: 11, lineHeight: 1.65, margin: "0 0 12px", maxWidth: 180 }}>
                        Connecting donors and saviors. Together we can save more lives.
                    </p>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["f", "t", "y", "in"].map(s => (
                            <div key={s} style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#cbd5e1", cursor: "pointer" }}>
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                {[
                    ["Quick Links", ["About Us", "How It Works", "FAQs", "Privacy Policy", "Terms & Conditions"]],
                    ["For Donors", ["Donate Blood", "My Donations", "Eligibility Criteria", "Donor Guidelines"]],
                    ["For Institutions", ["Blood Banks", "Hospitals", "Partner With Us"]],
                    ["Need Help?", ["+91 98765 43210", "support@blooddonor.in", "Hyderabad, Telangana"]],
                ].map(([t, l]) => (
                    <div key={t}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", margin: "0 0 10px" }}>{t}</p>
                        {l.map(link => (
                            <p key={link} style={{ fontSize: 10, color: "#64748B", margin: "0 0 6px", cursor: "pointer", lineHeight: 1.4 }}>{link}</p>
                        ))}
                    </div>
                ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1rem", textAlign: "center", fontSize: 10, color: "#475569" }}>
                © 2024 BloodDonor Emergency Network. All rights reserved.
            </div>
        </div>
    )
}