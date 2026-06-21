import { useNavigate } from "react-router-dom";
import ExtraCard from "../components/common/card/Card"
import { useState } from "react";
import { ArrowLeft, Check, MapPin } from "lucide-react";
import Input from "../components/common/Input";
import { Button } from "../components/common/button/Button";
import useAbortController from "../hooks/useAbortController";
import { register } from "../services/login.service";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { getSignal } = useAbortController();
    const [detectingLocation, setDetectingLocation] = useState(false);

    const [errors, setErrors] = useState({});
    const [regData, setRegData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        bloodGroup: 'O+',
        age: '',
        gender: 'Male',
        weight: '',
        address: 'Banjara Hills, Hyderabad',
        lat: 17.4156,
        lng: 78.4347
    });
    const { setUser } = useContext(AuthContext)

    const handleRegisterNext = () => {
        const newErrors = {};
        if (step === 1) {
            if (!regData.name) newErrors.name = 'Full Name is required';
            if (!regData.phone) newErrors.phone = 'Mobile Number is required';
            if (!regData.email) newErrors.email = 'Email is required';
            if (!regData.password) newErrors.password = 'Password is required';
            if (regData.password !== regData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        } else if (step === 2) {
            if (!regData.age || regData.age < 18) newErrors.age = 'Age must be 18 or older';
            if (!regData.weight) newErrors.weight = 'Weight is required';
        } else if (step === 3) {
            if (!regData.address) newErrors.address = 'Address is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            setStep(step + 1);
        }
    };


    const handleRegisterSubmit = async () => {
        try {
            const response = await register(regData, { signal: getSignal() }
            );
            setUser(response.user)
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            setErrors({ global: 'Registration failed. Try again.' });
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setRegData(prev => ({ ...prev, lat: latitude, lng: longitude }));

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`);
                    if (response.ok) {
                        const data = await response.json();
                        const addressText = data.display_name || `${latitude}, ${longitude}`;
                        setRegData(prev => ({ ...prev, address: addressText }));
                    }
                } catch (err) {
                    console.error('Error reverse geocoding:', err);
                } finally {
                    setDetectingLocation(false);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                alert(`Failed to detect location: ${error.message}`);
                setDetectingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };


    return (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', cursor: 'pointer' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🩸 Blood<span style={{ color: 'var(--text-primary)' }}>Donor</span>
                </span>
            </div>
            <ExtraCard style={{ width: '100%', maxWidth: '440px' }} padding="2rem">
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h2>

                    {/* Step Indicators */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }} />
                        <div style={{ position: 'absolute', top: '15px', left: '10%', width: `${(step - 1) * 30}%`, height: '2px', backgroundColor: 'var(--primary)', zIndex: 0, transition: 'width 0.3s ease' }} />

                        {[1, 2, 3, 4].map(num => (
                            <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: step > num ? 'var(--primary)' : (step === num ? '#FFFFFF' : 'var(--bg-tertiary)'),
                                    color: step > num ? '#FFFFFF' : (step === num ? 'var(--primary)' : 'var(--text-muted)'),
                                    border: step === num ? '2px solid var(--primary)' : '2px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.8125rem',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {step > num ? <Check size={14} /> : num}
                                </div>
                                <span style={{ fontSize: '0.6875rem', marginTop: '4px', fontWeight: step === num ? '600' : '400', color: step === num ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                    {num === 1 ? 'Personal' : num === 2 ? 'Blood Info' : num === 3 ? 'Address' : 'Review'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* STEP 1: Personal Info */}
                    {step === 1 && (
                        <div className="animate-slide-in">
                            <Input
                                label="Full Name"
                                placeholder="Rahul Verma"
                                value={regData.name}
                                onChange={e => setRegData({ ...regData, name: e.target.value })}
                                error={errors.name}
                            />
                            <Input
                                label="Mobile Number"
                                placeholder="+91 98765 43210"
                                value={regData.phone}
                                onChange={e => setRegData({ ...regData, phone: e.target.value })}
                                error={errors.phone}
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="rahulverma@example.com"
                                value={regData.email}
                                onChange={e => setRegData({ ...regData, email: e.target.value })}
                                error={errors.email}
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create password"
                                value={regData.password}
                                onChange={e => setRegData({ ...regData, password: e.target.value })}
                                error={errors.password}
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Re-enter password"
                                value={regData.confirmPassword}
                                onChange={e => setRegData({ ...regData, confirmPassword: e.target.value })}
                                error={errors.confirmPassword}
                            />
                        </div>
                    )}

                    {/* STEP 2: Blood Info */}
                    {step === 2 && (
                        <div className="animate-slide-in">
                            <Input
                                label="Blood Group"
                                type="select"
                                options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                                value={regData.bloodGroup}
                                onChange={e => setRegData({ ...regData, bloodGroup: e.target.value })}
                            />
                            <Input
                                label="Age"
                                type="number"
                                placeholder="Must be 18+"
                                value={regData.age}
                                onChange={e => setRegData({ ...regData, age: e.target.value })}
                                error={errors.age}
                            />
                            <Input
                                label="Gender"
                                type="select"
                                options={['Male', 'Female', 'Other']}
                                value={regData.gender}
                                onChange={e => setRegData({ ...regData, gender: e.target.value })}
                            />
                            <Input
                                label="Weight (kg)"
                                type="number"
                                placeholder="e.g. 70"
                                value={regData.weight}
                                onChange={e => setRegData({ ...regData, weight: e.target.value })}
                                error={errors.weight}
                            />
                        </div>
                    )}

                    {/* STEP 3: Address */}
                    {step === 3 && (
                        <div className="animate-slide-in">
                            <Input
                                label="Street Address / City"
                                type="textarea"
                                placeholder="Enter full location address"
                                value={regData.address}
                                onChange={e => setRegData({ ...regData, address: e.target.value })}
                                error={errors.address}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDetectLocation}
                                    style={{ flex: 1, height: '40px', fontSize: '0.8125rem' }}
                                    disabled={detectingLocation}
                                >
                                    {detectingLocation ? 'Detecting Location...' : '📍 Detect Current Location'}
                                </Button>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                <MapPin size={18} color="var(--primary)" />
                                <div>
                                    <div style={{ fontWeight: '600' }}>Mock GPS Coordinates Locked</div>
                                    <div>Lat: {regData.lat}, Lng: {regData.lng}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Review */}
                    {step === 4 && (
                        <div className="animate-slide-in" style={{ fontSize: '0.875rem' }}>
                            <h3 style={{ fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Review Registration Details</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.5rem 1rem', marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                                <span style={{ fontWeight: '500' }}>{regData.name}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
                                <span style={{ fontWeight: '500' }}>{regData.phone}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                                <span style={{ fontWeight: '500' }}>{regData.email}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Blood Group:</span>
                                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{regData.bloodGroup}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Age / Gender:</span>
                                <span style={{ fontWeight: '500' }}>{regData.age} Yrs / {regData.gender}</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Weight:</span>
                                <span style={{ fontWeight: '500' }}>{regData.weight} kg</span>

                                <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
                                <span style={{ fontWeight: '500' }}>{regData.address}</span>
                            </div>
                        </div>
                    )}

                    {/* Button controls */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        {step > 1 && (
                            <Button
                                variant="secondary"
                                onClick={() => setStep(step - 1)}
                            >
                                <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
                            </Button>
                        )}

                        {step < 4 ? (
                            <Button
                                variant="primary"
                                onClick={handleRegisterNext}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleRegisterSubmit}
                            >
                                Confirm & Submit
                            </Button>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
                        Already have an account?{' '}
                        <span style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
                    </div>
                </div>
            </ExtraCard>
        </div>
    )

}