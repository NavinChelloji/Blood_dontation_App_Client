import { Phone } from "lucide-react";
import { Button } from "../../components/common/button/Button";
import { Card } from "../../components/common/card/Card"
import { Avatar } from "../../components/common/avatar/Avatar";
import { Badge } from "../../components/common/badge/Badge";
import { SectionHeader } from "../../components/common/sectionHeader/SectionHeader";
const DONORS = [
    { name: "Suresh Reddy", g: "O+", dist: "1.2 km", date: "15 Apr 2024" },
    { name: "Anjali Deshmukh", g: "O+", dist: "1.8 km", date: "10 Mar 2024" },
    { name: "Vikram Singh", g: "O+", dist: "2.4 km", date: "20 Apr 2024" },
    { name: "Neeraj Kumar", g: "O+", dist: "3.1 km", date: "05 Apr 2024" },
    { name: "Priya Sharma", g: "O+", dist: "3.7 km", date: "18 Mar 2024" },
];

export const DonarTable = () => {
    return (
        <>
            <Card style={{ marginBottom: 16 }}>
                <SectionHeader title="Top Donors Near You" action="View All" />
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 520 }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid var(--border)` }}>
                                {["Donor", "Blood Group", "Distance", "Last Donation", "Availability", "Action"].map(h => (
                                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 700, color: 'var(--muted)', fontSize: 10, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DONORS.map((d, i) => (
                                <tr key={d.name} style={{ borderBottom: `1px solid var(--bg)`, background: i % 2 ? `var(--bg)` : "transparent" }}>
                                    <td style={{ padding: "10px 10px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <Avatar name={d.name} sz={30} />
                                            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{d.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "10px 10px" }}><Badge variant="blood">{d.g}</Badge></td>
                                    <td style={{ padding: "10px 10px", color: 'var(--sub)' }}>{d.dist}</td>
                                    <td style={{ padding: "10px 10px", color: 'var(--sub)' }}>{d.date}</td>
                                    <td style={{ padding: "10px 10px" }}><Badge variant="success">Available</Badge></td>
                                    <td style={{ padding: "10px 10px" }}>
                                        <Button variant="ghost" sz="sm" icon={<Phone size={11} />}>Contact</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>)
}