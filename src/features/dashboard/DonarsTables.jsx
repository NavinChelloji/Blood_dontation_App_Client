import { Button } from "../../components/common/button/Button";
import { Card } from "../../components/common/card/Card"
import { Avatar } from "../../components/common/avatar/Avatar";
import { Badge } from "../../components/common/badge/Badge";
import { SectionHeader } from "../../components/common/sectionHeader/SectionHeader";
import { useNavigate } from "react-router-dom";
import Table from "../../components/common/table/Table";


export const DonarTable = ({ data }) => {
    const columns = [
        {
            key: 'name', title: 'Donor Name', render: (val) => <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={val} sz={30} />
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{val}</span>
            </div>
        },
        { key: 'bloodGroup', title: 'Blood Group', render: (val) => <Badge>{val}</Badge> },
        { key: 'distance', title: 'Distance', render: (val) => val ? `${val} km` : '0.0 km' },
        { key: 'lastDonation', title: 'Last Donation' },
        { key: 'status', title: 'Availability', render: (val) => <Badge>{val}</Badge> },
        {
            key: 'action',
            title: 'Action',
            render: (_, row) => (
                <Button size="sm" variant="outline" onClick={() => navigate(`/donors/${row.id}`)}>
                    View Profile
                </Button>
            )
        }
    ];
    const navigate = useNavigate();
    return (
        <>
            <Card style={{ marginBottom: 16 }}>
                <SectionHeader title="Top Donors Near You" action="View All" onActionClick={() => navigate('/donors')} />
                <div style={{ overflowX: "auto" }}>
                    <Table columns={columns} data={data} />
                </div>
            </Card>
        </>)
}