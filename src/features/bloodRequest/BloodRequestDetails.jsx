import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/common/button/Button";
import { Badge } from "../../components/common/badge/Badge";
import { ArrowLeft, Phone, User } from "lucide-react";
import ExtraCard from "../../components/common/card/Card";
import Table from "../../components/common/table/Table";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import useAbortController from "../../hooks/useAbortController";
import { acceptBloodRequest } from "../../services/bloodRequest.service";
import { getBloodRequestById } from "../../services/bloodRequest.service";

let hasAccepted = false;
let isDonorAvailable = false;

export function BloodRequestDetails({ mob }) {
    const { user } = useContext(AuthContext);
    const [request, setRequest] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const { getSignal } = useAbortController();
    const [routeInfo, setRouteInfo] = useState(null);

    useEffect(() => {
        let timer = null;
        (async function fetchRequest() {
            try {
                const data = await getBloodRequestById(id, { signal: getSignal() });
                setRequest(data);
                let request = data;
                hasAccepted = data ? data.donorResponses.some(res => res.donorId === user.id) : false;
                isDonorAvailable = user.role === 'donor' && data?.status === 'Open';
                timer = setTimeout(async () => {
                    const L = window.L;
                    if (!L) return;

                    const mapContainer = document.getElementById('details-map');
                    if (!mapContainer) return;

                    const hospLat = parseFloat(request.lat || request.latitude || 17.4156);
                    const hospLng = parseFloat(request.lng || request.longitude || 78.4347);

                    let donorLat = null;
                    let donorLng = null;
                    let donorName = '';

                    if (user.role === 'donor') {
                        donorLat = parseFloat(user.lat || user.latitude);
                        donorLng = parseFloat(user.lng || user.longitude);
                        donorName = user.name;
                    }
                    //   else {
                    //     const acceptedRes = request.donorResponses?.find(r => r.response === 'Accepted' || r.response_status === 'Accepted');
                    //     if (acceptedRes) {
                    //       const matchingDonor = donors?.find(d => d.id === acceptedRes.donorId);
                    //       if (matchingDonor) {
                    //         donorLat = parseFloat(matchingDonor.lat || matchingDonor.latitude);
                    //         donorLng = parseFloat(matchingDonor.lng || matchingDonor.longitude);
                    //         donorName = matchingDonor.name;
                    //       }
                    //     }
                    //   }

                    const map = L.map('details-map').setView([hospLat, hospLng], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);

                    // Hospital Custom Marker
                    L.marker([hospLat, hospLng], {
                        icon: L.divIcon({
                            html: `<div style="background-color: var(--primary); color: white; padding: 4px; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3)">🏥</div>`,
                            className: 'custom-hosp-icon',
                            iconSize: [28, 28],
                            iconAnchor: [14, 14]
                        })
                    }).addTo(map).bindPopup(`<b>${request.hospitalName}</b><br/>Hospital Destination`);

                    if (donorLat && donorLng) {
                        // Donor Custom Marker
                        L.marker([donorLat, donorLng], {
                            icon: L.divIcon({
                                html: `<div style="background-color: var(--info); color: white; padding: 4px; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3)">🩸</div>`,
                                className: 'custom-donor-icon',
                                iconSize: [28, 28],
                                iconAnchor: [14, 14]
                            })
                        }).addTo(map).bindPopup(`<b>${donorName}</b><br/>Blood Donor Location`);

                        try {
                            const response = await fetch(
                                `https://router.project-osrm.org/route/v1/driving/${donorLng},${donorLat};${hospLng},${hospLat}?overview=full&geometries=geojson`
                            );
                            if (response.ok) {
                                const data = await response.json();
                                if (data.routes && data.routes.length > 0) {
                                    const route = data.routes[0];
                                    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
                                    const distanceKm = (route.distance / 1000).toFixed(1);
                                    const durationMins = Math.round(route.duration / 60);

                                    setRouteInfo({
                                        distance: distanceKm,
                                        duration: durationMins,
                                        donorName
                                    });

                                    const polyline = L.polyline(coords, { color: 'var(--primary)', weight: 5, opacity: 0.85 }).addTo(map);
                                    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
                                }
                            }
                        } catch (err) {
                            console.error('Error fetching OSRM route:', err);
                            const polyline = L.polyline([[donorLat, donorLng], [hospLat, hospLng]], { color: 'gray', weight: 4, dashArray: '5, 10' }).addTo(map);
                            map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
                        }
                    } else {
                        map.setView([hospLat, hospLng], 14);
                    }

                    return () => {
                        map.remove();
                    };
                }, 200);
            } catch (err) {
                console.error('Failed to fetch blood request:', err);
                setRequest(null);
            }
        })();
        return () => clearTimeout(timer);
    }, []);


    if (!request) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h3>Request Not Found</h3>
                <Button onClick={() => navigate('/requests')} style={{ marginTop: '1rem' }}>Back to Requests</Button>
            </div>
        );
    }

    const responseColumns = [
        { key: 'name', title: 'Donor Name', render: (val) => <span style={{ fontWeight: '600' }}>{val}</span> },
        { key: 'bloodGroup', title: 'Blood Group', render: (val) => <Badge>{val}</Badge> },
        { key: 'distance', title: 'Distance' },
        { key: 'response', title: 'Response', render: (val) => <Badge>{val}</Badge> },
        { key: 'time', title: 'Time' }
    ];

    const handleAcceptRequest = async (requestId) => {
        if (!user) return;
        try {
            const response = await acceptBloodRequest(requestId, { donorId: user.id, name: user.name }, { signal: getSignal() });
            console.log(response);
        } catch (err) {
            console.error('Failed to accept request:', err);
        }
    };

    return (
        <div className="animate-slide-in" style={{ margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Button variant="text" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mob ? 1 : 2}, 1fr)`, gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Main Details */}
                <ExtraCard title={`Request Details: ${request.id}`} extra={<Badge>{request.priority} Priority</Badge>}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                            <span style={{ fontWeight: 'bold' }}><Badge>{request.status}</Badge></span>

                            <span style={{ color: 'var(--text-secondary)' }}>Blood Group:</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{request.bloodGroup}</span>

                            <span style={{ color: 'var(--text-secondary)' }}>Units Required:</span>
                            <span style={{ fontWeight: '600' }}>{request.unitsRequired} Units</span>

                            <span style={{ color: 'var(--text-secondary)' }}>Required By:</span>
                            <span style={{ fontWeight: '500' }}>{new Date(request.requiredBy).toLocaleDateString()}</span>
                        </div>

                        <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />

                        <div>
                            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={16} /> Patient Information</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.5rem', paddingLeft: '1.25rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                                <span>{request.patientName}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>Age / Gender:</span>
                                <span>{request.patientAge || '25'} Yrs / {request.patientGender || 'Male'}</span>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />

                        <div>
                            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={16} /> Contact Person</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.5rem', paddingLeft: '1.25rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                                <span>{request.requestedBy}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>Contact Phone:</span>
                                <span>{request.contactPhone}</span>
                            </div>
                        </div>
                    </div>
                </ExtraCard>

                {/* Location Map Card */}
                <ExtraCard title="Hospital Location">
                    <div id="details-map" style={{ height: '240px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)', zIndex: 1, marginBottom: '1rem', position: 'relative' }}></div>

                    <div style={{ fontSize: '0.8125rem' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{request.hospitalName}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>{request.hospitalAddress}</div>

                        {routeInfo && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    🚘 driving route found
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)' }}>Distance:</span>{' '}
                                        <span style={{ fontWeight: 'bold' }}>{routeInfo.distance} km</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)' }}>Est. Time:</span>{' '}
                                        <span style={{ fontWeight: 'bold' }}>{routeInfo.duration} mins</span>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>From:</span>{' '}
                                        <span style={{ fontWeight: '600' }}>{routeInfo.donorName}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ExtraCard>
            </div>

            {/* Donor Action Panel */}
            {isDonorAvailable && (
                <ExtraCard style={{ marginBottom: '1.5rem', backgroundColor: 'var(--primary-light)', borderColor: 'rgba(229,30,42,0.3)' }} padding="1.5rem">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>Can you donate to this request?</h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                Your location matches and you have compatible blood type ({user.bloodGroup}).
                            </p>
                        </div>
                        {hasAccepted ? (
                            <Badge variant="success">You Accepted This</Badge>
                        ) : (
                            <Button onClick={() => handleAcceptRequest(request.id)}>Accept Donation Request</Button>
                        )}
                    </div>
                </ExtraCard>
            )}

            {/* Donor Responses List */}
            <ExtraCard title="Donor Responses" subtitle="Real-time volunteer feedbacks">
                <Table
                    columns={responseColumns}
                    data={request.donorResponses}
                    emptyMessage="Waiting for responses from nearby donors."
                />
            </ExtraCard>
        </div>
    );
}