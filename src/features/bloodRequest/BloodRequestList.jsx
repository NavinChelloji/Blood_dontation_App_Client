import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/common/badge/Badge";
import { Button } from "../../components/common/button/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/table/Table";
import useAbortController from "../../hooks/useAbortController";
import { getBloodRequests } from "../../services/bloodRequest.service";

export function BloodRequestsList() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchGroup, setSearchGroup] = useState('all');
    const [searchPriority, setSearchPriority] = useState('all');
    const { getSignal } = useAbortController();

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

    const filteredRequests = requests.filter(req => {
        const statusMatch = filterStatus === 'All' || req.status === filterStatus;
        const groupMatch = searchGroup === 'all' || req.bloodGroup === searchGroup;
        const priorityMatch = searchPriority === 'all' || req.priority === searchPriority;
        return statusMatch && groupMatch && priorityMatch;
    });

    const columns = [
        { key: 'id', title: 'Request ID', render: (val) => <span style={{ fontWeight: '600' }}>{val}</span> },
        { key: 'patientName', title: 'Patient Name' },
        { key: 'bloodGroup', title: 'Blood Group', render: (val) => <Badge>{val}</Badge> },
        { key: 'unitsRequired', title: 'Units Required', render: (val) => `${val} Units` },
        { key: 'hospitalName', title: 'Hospital' },
        { key: 'status', title: 'Status', render: (val) => <Badge>{val}</Badge> },
        { key: 'priority', title: 'Priority', render: (val) => <Badge>{val}</Badge> },
        {
            key: 'action',
            title: 'Action',
            render: (_, row) => (
                <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); navigate(`/requests/${row.id}`); }}>
                    View Details
                </Button>
            )
        }
    ];

    return (
        <div className="animate-slide-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="header-title">Blood Requests</h1>
                    <p className="header-subtitle">Active emergency blood demands matching your preferences</p>
                </div>
                <Button onClick={() => navigate('/requests/new')}>Create Blood Request</Button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {['All', 'Open', 'Accepted', 'Completed', 'Cancelled'].map((tab) => (
                    <Button
                        key={tab}
                        variant="text"
                        onClick={() => setFilterStatus(tab)}
                        style={{
                            padding: '6px 16px',
                            color: filterStatus === tab ? 'var(--primary)' : 'var(--text-secondary)',
                            borderBottom: filterStatus === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            borderRadius: 0,
                            fontWeight: filterStatus === tab ? '700' : '500'
                        }}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {/* Filter Toolbar inputs */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <Input
                        label="Blood Group"
                        type="select"
                        options={[{ value: 'all', label: 'All Blood Groups' }, 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                        value={searchGroup}
                        onChange={e => setSearchGroup(e.target.value)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <Input
                        label="Priority"
                        type="select"
                        options={[{ value: 'all', label: 'All Priorities' }, 'High', 'Medium', 'Low']}
                        value={searchPriority}
                        onChange={e => setSearchPriority(e.target.value)}
                    />
                </div>
            </div>

            {/* List Table */}
            <Table
                columns={columns}
                data={filteredRequests}
                emptyMessage="No requests match the current filters."
            />
        </div>
    );
}