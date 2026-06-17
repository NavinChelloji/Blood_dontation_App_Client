import { useState } from "react";
import { Button } from "../components/common/button/Button"
import ExtraCard from "../components/common/card/Card"
import Input from "../components/common/Input"
import { useNavigate } from "react-router-dom";
import useAbortController from "../hooks/useAbortController";
import { login } from "../services/login.service";

export const LoginPage = () => {
    const navigate = useNavigate();
    const { getSignal } = useAbortController()
    const [loginError, setLoginError] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [sendOtp, setSendOtp] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!phone) {
            setLoginError('Phone number is required');
            return;
        }

        try {
            const response = await login(
                { phone, password }
                , { signal: getSignal() });
            navigate('/dashboard');
            console.log(await response.json());
        } catch (e) {
            setLoginError('Invalid credentials. Please try again.');
            console.log(e)
        }
    };

    return (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🩸 Blood<span style={{ color: 'var(--text-primary)' }}>Donor</span>
                </span>
            </div>
            <ExtraCard style={{ width: '100%', maxWidth: '440px' }} padding="2rem">
                <form onSubmit={handleLogin}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>Login to continue</p>

                    {loginError && <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8125rem', marginBottom: '1rem', fontWeight: '500' }}>{loginError}</div>}
                    <Input
                        label="Mobile Number"
                        placeholder="+91-98765-43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                    {sendOtp && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                        <Input
                            label="Enter OTP"
                            placeholder="Enter 6-digit OTP"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>}
                    {!sendOtp && <Button variant="outline" type="button" onClick={() => setSendOtp(true)}>Send OTP</Button>}
                    {sendOtp && <Button variant="outline" type="submit">Login</Button>}

                </form>
            </ExtraCard>

        </div>
    )
}