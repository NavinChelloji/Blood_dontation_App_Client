import { ArrowLeft, Award, Calendar, Heart, Mail, Phone } from "lucide-react";
import Table from "../../components/common/table/Table";
import ExtraCard from "../../components/common/card/Card";
import { Badge } from "../../components/common/badge/Badge";
import { Button } from "../../components/common/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAbortController from "../../hooks/useAbortController";
import { getDonorById } from "../../services/donor.service";

export function DonorProfile({ id: donorId ,mob }) {
    const [donor, setDonor] = useState(null);
    const { getSignal } = useAbortController();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getDonorById(donorId || id, { signal: getSignal() })
            .then((data) => {
                setDonor(data);
            })
            .catch((err) => {
                console.error('Failed to fetch donor profile:', err);
                setDonor(null);
            });
    }, []);

    if (!donor) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h3>Donor Profile Not Found</h3>
                <Button onClick={() => navigate('/donors')} style={{ marginTop: '1rem' }}>Back to Search</Button>
            </div>
        );
    }

    const columns = [
        { key: 'date', title: 'Date' },
        { key: 'hospital', title: 'Hospital' },
        { key: 'bloodGroup', title: 'Blood Group', render: (val) => <Badge>{val}</Badge> },
        { key: 'units', title: 'Units' }
    ];

    return (
        <div className="animate-slide-in" style={{ margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Button variant="text" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mob ? 1 : 2}, 1fr)`, gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Left Side: Summary Card */}
                <ExtraCard>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            {donor.bloodGroup}
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{donor.name}</h3>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Donor ID: {donor.id || 'N/A'}</span>
                        {donor.status && <Badge style={{ marginTop: '0.75rem' }}>{donor.status}</Badge>}

                        <hr style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', gap: '0.75rem', fontSize: '0.875rem', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={16} color="var(--text-secondary)" /> <span>{donor.phone || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={16} color="var(--text-secondary)" /> <span style={{ wordBreak: 'break-all' }}>{donor.email || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={16} color="var(--text-secondary)" /> <span>Last Donation: {donor.lastDonation || 'Never'}</span>
                            </div>
                        </div>
                    </div>
                </ExtraCard>

                {/* Right Side: Details & History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <ExtraCard title="About Donor">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Age</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '0.25rem' }}>{donor.age || 'N/A'}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gender</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '0.25rem' }}>{donor.gender || 'N/A'}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Weight</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '0.25rem' }}>{donor.weight ? `${donor.weight}` : 'N/A'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Award size={20} color="var(--primary)" />
                                <div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Total Donations</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{donor.totalDonations || 0} Times</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Heart size={20} color="var(--success)" />
                                <div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Lives Saved</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{donor.livesSaved || 0} Lives</div>
                                </div>
                            </div>
                        </div>
                    </ExtraCard>

                    <ExtraCard title="Donation History">
                        <Table columns={columns} data={donor.donationHistory || []} />
                    </ExtraCard>
                </div>
            </div>
        </div>
    );
}