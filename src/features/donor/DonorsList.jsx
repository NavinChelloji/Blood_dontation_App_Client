import { Button } from "../../components/common/button/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/table/Table";
import { Badge } from "../../components/common/badge/Badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchDonors } from "../../services/donor.service";
import useAbortController from "../../hooks/useAbortController";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export function DonorSearch() {
    const navigate = useNavigate();
    const [donors, setDonors] = useState([]);
    const [bloodGroup, setBloodGroup] = useState('all');
    const [radius, setRadius] = useState('10');
    const [location, setLocation] = useState('Hyderabad');
    const { getSignal } = useAbortController();
    const {user} = useContext(AuthContext);

    const handleSearch = () => {
        searchDonors(`bloodGroup=${bloodGroup}&radius=${radius}&lat=${user?.latitude || ''}&lng=${user?.longitude || ''}`, { signal: getSignal() })
            .then(data => {
                setDonors(data);
            })
            .catch(err => {
                console.error('Failed to fetch donors:', err);
                setDonors([]);
            });
    };

    //   useEffect(() => {
    //     // Optionally, you can trigger an initial search here with default parameters
    //     // handleSearch();
    //   }, []);

    const columns = [
        { key: 'name', title: 'Donor Name', render: (val) => <span style={{ fontWeight: '600' }}>{val}</span> },
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

    return (
        <div className="animate-slide-in">
            <div>
                <h1 className="header-title">Donor Search</h1>
                <p className="header-subtitle">Locate active donors in your local perimeter</p>
            </div>

            {/* Filter toolbar */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <Input
                    label="Blood Group"
                    type="select"
                    options={[{ value: 'all', label: 'All Groups' }, 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    style={{ marginBottom: 0 }}
                />
                <Input
                    label="Location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{ marginBottom: 0 }}
                />
                <Input
                    label="Within (Radius)"
                    type="select"
                    options={[
                        { value: '5', label: '5 km' },
                        { value: '10', label: '10 km' },
                        { value: '20', label: '20 km' },
                        { value: '50', label: '50 km' }
                    ]}
                    value={radius}
                    onChange={e => setRadius(e.target.value)}
                    style={{ marginBottom: 0 }}
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>

            <Table
                columns={columns}
                data={donors}
                emptyMessage="No donors found matching these parameters. Try broadening your radius."
            />
        </div>
    );
}