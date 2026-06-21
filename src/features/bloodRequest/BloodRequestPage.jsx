import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ExtraCard from '../../components/common/card/Card';
import { Button } from '../../components/common/button/Button';
import Input from '../../components/common/Input';
import { createBloodRequest } from '../../services/bloodRequest.service';
import useAbortController from '../../hooks/useAbortController';

// 1. CREATE BLOOD REQUEST WIZARD (Screen 5)
export function BloodRequestWizard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [reqData, setReqData] = useState({
        bloodGroup: 'O+',
        unitsRequired: 1,
        priority: 'High',
        requiredBy: '',
        additionalInfo: '',
        patientName: '',
        patientAge: '',
        patientGender: 'Male',
        hospitalName: '',
        hospitalAddress: 'Apollo Hospital, Banjara Hills',
        lat: 17.4156,
        lng: 78.4347,
        requestedBy: '',
        contactPhone: '',
        relationship: 'Self'
    });
    const [errors, setErrors] = useState({});
    const [geocoding, setGeocoding] = useState(false);
    const [mapSearchQuery, setMapSearchQuery] = useState('');
    const [searchingMap, setSearchingMap] = useState(false);
    const { getSignal } = useAbortController();

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (step !== 3) return;

        const timer = setTimeout(() => {
            const L = window.L;
            if (!L) {
                console.warn('Leaflet is not loaded on window');
                return;
            }

            const defaultLat = reqData.lat || 17.4156;
            const defaultLng = reqData.lng || 78.4347;

            const mapContainer = document.getElementById('picker-map');
            if (!mapContainer) return;

            const map = L.map('picker-map').setView([defaultLat, defaultLng], 14);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            let marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
            markerRef.current = marker;

            const updateCoords = (latitude, longitude) => {
                setReqData(prev => ({
                    ...prev,
                    lat: parseFloat(latitude.toFixed(6)),
                    lng: parseFloat(longitude.toFixed(6))
                }));
            };

            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                updateCoords(lat, lng);
            });

            marker.on('dragend', () => {
                const { lat, lng } = marker.getLatLng();
                updateCoords(lat, lng);
            });

            return () => {
                map.remove();
                mapRef.current = null;
                markerRef.current = null;
            };
        }, 200);

        return () => clearTimeout(timer);
    }, [step]);

    const handleMapSearch = async () => {
        if (!mapSearchQuery) return;
        setSearchingMap(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}&limit=1`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const { lat, lon, display_name } = data[0];
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lon);

                    setReqData(prev => ({
                        ...prev,
                        lat: parseFloat(latitude.toFixed(6)),
                        lng: parseFloat(longitude.toFixed(6)),
                        hospitalAddress: display_name || prev.hospitalAddress
                    }));

                    if (mapRef.current && markerRef.current) {
                        mapRef.current.setView([latitude, longitude], 15);
                        markerRef.current.setLatLng([latitude, longitude]);
                    }
                } else {
                    alert('No locations found. Try being more specific (e.g. city or state).');
                }
            }
        } catch (err) {
            console.error('Error searching map:', err);
        } finally {
            setSearchingMap(false);
        }
    };

    const handleReverseGeocode = async () => {
        setGeocoding(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${reqData.lat}&lon=${reqData.lng}&zoom=18`);
            if (response.ok) {
                const data = await response.json();
                setReqData(prev => ({ ...prev, hospitalAddress: data.display_name || prev.hospitalAddress }));
            }
        } catch (err) {
            console.error('Error reverse geocoding:', err);
        } finally {
            setGeocoding(false);
        }
    };

    const handleNext = () => {
        const errs = {};
        if (step === 1) {
            if (!reqData.requiredBy) errs.requiredBy = 'Required date is required';
        } else if (step === 2) {
            if (!reqData.patientName) errs.patientName = 'Patient Name is required';
            if (!reqData.patientAge) errs.patientAge = 'Patient Age is required';
        } else if (step === 3) {
            if (!reqData.hospitalName) errs.hospitalName = 'Hospital Name is required';
            if (!reqData.hospitalAddress) errs.hospitalAddress = 'Hospital Address is required';
        } else if (step === 4) {
            if (!reqData.requestedBy) errs.requestedBy = 'Contact person name is required';
            if (!reqData.contactPhone) errs.contactPhone = 'Contact number is required';
        }

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
        } else {
            setErrors({});
            if (step < 4) {
                setStep(step + 1);
            } else {
                handleCreateRequest(reqData);
            }
        }
    };

    const handleCreateRequest = async (reqData) => {
        try {
            const response = await createBloodRequest({
                ...reqData,
                requestedBy: user?.name || reqData.requestedBy,
                contactPhone: user?.phone || reqData.contactPhone
            }, { signal: getSignal() });
            console.log(response);
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to create request:', err);
        }
    };

    return (
        <div className="animate-slide-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Button variant="text" onClick={() => navigate('/requests')} style={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Cancel
                </Button>
            </div>

            <ExtraCard title="Create Blood Request" subtitle={`Step ${step} of 4`}>
                {/* Step Indicators */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {['Request Details', 'Patient Details', 'Hospital Details', 'Contact Person'].map((title, idx) => (
                        <div key={idx} style={{ color: step === idx + 1 ? 'var(--primary)' : 'var(--text-muted)', borderBottom: step === idx + 1 ? '2px solid var(--primary)' : '2px solid transparent', paddingBottom: '4px', flex: 1, textAlign: 'center' }}>
                            {title}
                        </div>
                    ))}
                </div>

                {/* Form Body */}
                {step === 1 && (
                    <div>
                        <Input
                            label="Blood Group Required"
                            type="select"
                            options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                            value={reqData.bloodGroup}
                            onChange={e => setReqData({ ...reqData, bloodGroup: e.target.value })}
                        />
                        <Input
                            label="Units Required"
                            type="number"
                            value={reqData.unitsRequired}
                            onChange={e => setReqData({ ...reqData, unitsRequired: e.target.value })}
                        />
                        <Input
                            label="Priority Level"
                            type="select"
                            options={['High', 'Medium', 'Low']}
                            value={reqData.priority}
                            onChange={e => setReqData({ ...reqData, priority: e.target.value })}
                        />
                        <Input
                            label="Required Date"
                            type="date"
                            value={reqData.requiredBy}
                            onChange={e => setReqData({ ...reqData, requiredBy: e.target.value })}
                            error={errors.requiredBy}
                        />
                        <Input
                            label="Additional Instructions"
                            type="textarea"
                            placeholder="e.g. Please bring donor ID card"
                            value={reqData.additionalInfo}
                            onChange={e => setReqData({ ...reqData, additionalInfo: e.target.value })}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <Input
                            label="Patient Full Name"
                            placeholder="Enter patient name"
                            value={reqData.patientName}
                            onChange={e => setReqData({ ...reqData, patientName: e.target.value })}
                            error={errors.patientName}
                        />
                        <Input
                            label="Patient Age"
                            type="number"
                            placeholder="Age"
                            value={reqData.patientAge}
                            onChange={e => setReqData({ ...reqData, patientAge: e.target.value })}
                            error={errors.patientAge}
                        />
                        <Input
                            label="Patient Gender"
                            type="select"
                            options={['Male', 'Female', 'Other']}
                            value={reqData.patientGender}
                            onChange={e => setReqData({ ...reqData, patientGender: e.target.value })}
                        />
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <Input
                            label="Hospital Name"
                            placeholder="e.g. Apollo Hospital"
                            value={reqData.hospitalName}
                            onChange={e => setReqData({ ...reqData, hospitalName: e.target.value })}
                            error={errors.hospitalName}
                        />

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>Hospital Location Map Pin</label>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Input
                                    placeholder="Search location (e.g. Yashoda Hospital, Secunderabad)"
                                    value={mapSearchQuery}
                                    onChange={e => setMapSearchQuery(e.target.value)}
                                    style={{ marginBottom: 0, flex: 1 }}
                                />
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleMapSearch}
                                    disabled={searchingMap}
                                >
                                    {searchingMap ? 'Searching...' : 'Search'}
                                </Button>
                            </div>

                            <div id="picker-map" style={{ height: '220px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)', zIndex: 1 }}></div>
                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>🖱️ Click anywhere on the map or drag the marker to lock the hospital coordinates.</p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReverseGeocode}
                                disabled={geocoding}
                            >
                                {geocoding ? 'Detecting Address...' : '🔍 Auto-fill Address from Map Pin'}
                            </Button>
                        </div>

                        <Input
                            label="Hospital Location / Address"
                            type="textarea"
                            placeholder="Full address of hospital"
                            value={reqData.hospitalAddress}
                            onChange={e => setReqData({ ...reqData, hospitalAddress: e.target.value })}
                            error={errors.hospitalAddress}
                        />
                        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            <MapPin size={18} color="var(--primary)" />
                            <div>
                                <div style={{ fontWeight: '600' }}>Hospital GPS Coordinates Locked</div>
                                <div>Lat: {reqData.lat}, Lng: {reqData.lng}</div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <Input
                            label="Contact Person Name"
                            placeholder="Full Name"
                            value={reqData.requestedBy}
                            onChange={e => setReqData({ ...reqData, requestedBy: e.target.value })}
                            error={errors.requestedBy}
                        />
                        <Input
                            label="Contact Mobile Number"
                            placeholder="+91-xxxxx-xxxxx"
                            value={reqData.contactPhone}
                            onChange={e => setReqData({ ...reqData, contactPhone: e.target.value })}
                            error={errors.contactPhone}
                        />
                        <Input
                            label="Relationship to Patient"
                            type="select"
                            options={['Self', 'Parent', 'Spouse', 'Sibling', 'Friend', 'Other']}
                            value={reqData.relationship}
                            onChange={e => setReqData({ ...reqData, relationship: e.target.value })}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    {step > 1 && (
                        <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>
                    )}
                    <Button variant="primary" onClick={handleNext}>
                        {step === 4 ? 'Submit Request' : 'Next'}
                    </Button>
                </div>
            </ExtraCard>
        </div>
    );
}

// 2. BLOOD REQUESTS LIST (Screen 6)


// 3. REQUEST DETAILS PAGE (Screen 7)

