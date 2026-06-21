import { MapPin } from "lucide-react";
import { Card } from "../../components/common/card/Card";
import { Button } from "../../components/common/button/Button";
import { BloodGroup } from "../../components/common/bloodGroup/BloodGroup";
import { Badge } from "../../components/common/badge/Badge";
import { SectionHeader } from "../../components/common/sectionHeader/SectionHeader";
import { useEffect, useState } from "react";
import { getBloodRequests } from "../../services/bloodRequest.service";
import useAbortController from "../../hooks/useAbortController";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formateDate";
// const REQS = [
//     { g: "O+", title: "O+ Blood Needed", hosp: "Apollo Hospital, Banjara Hills", dist: "2.3 km", units: "2 Units", date: "24 May 2024", time: "10:00 AM", prio: "High Priority", pc: "danger" },
//     { g: "B+", title: "B+ Blood Needed", hosp: "Yashoda Hospital, Somajiguda", dist: "3.1 km", units: "1 Unit", date: "24 May 2024", time: "11:30 AM", prio: "Medium Priority", pc: "gray" },
//     { g: "A-", title: "A- Blood Needed", hosp: "Care Hospital, Hi-tech City", dist: "4.6 km", units: "2 Units", date: "24 May 2024", time: "01:00 PM", prio: "Low Priority", pc: "success" },
// ];

export const NearBloodRequest = ({ mob }) => {
    const [requests, setRequests] = useState([]);
    const { getSignal } = useAbortController();
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            try {
                const response = await getBloodRequests({ signal: getSignal() });
                setRequests(response);
            } catch (err) {
                setRequests([]);
                console.error('Failed to fetch blood requests:', err);
            }
        })();
    }, []);
    return (
        <Card style={{ marginBottom: 16 }}>
            <SectionHeader title="Recent Blood Requests Near You" action="View All" onActionClick={() => navigate('/requests')} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {requests.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            display: "flex", alignItems: mob ? "flex-start" : "center",
                            gap: 12, padding: "12px 14px",
                            borderRadius: 'var(--radius-md)', border: `1px solid var(--border)`,
                            background: 'var(--bg)', flexWrap: mob ? "wrap" : "nowrap",
                        }}
                    >
                        <BloodGroup g={r.bloodGroup} sz={38} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', margin: "0 0 2px" }}>{r.bloodGroup} Blood Needed</p>
                            <p style={{ fontSize: 11, color: 'var(--sub)', margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.hospitalAddress}</p>
                            <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, display: "flex", alignItems: "center", gap: 3 }}>
                                <MapPin size={9} />{r?.dist}
                            </p>
                        </div>
                        <div style={{ textAlign: "center", flexShrink: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', margin: "0 0 2px" }}>{r.unitsRequired}</p>
                            <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>Needed</p>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', margin: "0 0 2px" }}>{formatDate(r.createdAt).date}</p>
                            <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>{formatDate(r.createdAt).time}</p>
                        </div>
                        <Badge variant={r.priority === 'High' ? 'danger' : r.priority === 'Medium' ? 'gray' : 'success'}>
                            {r.priority}
                        </Badge>
                        <Button variant="primary" sz="sm" onClick={() => navigate(`/requests/${r.id}`)}>
                            View Details
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
    )
}