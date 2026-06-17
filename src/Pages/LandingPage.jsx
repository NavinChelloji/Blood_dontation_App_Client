import { useState } from 'react';
import {Button} from '../components/common/button/Button';
import ExtraCard from '../components/common/card/Card';
import {Badge} from '../components/common/badge/Badge';
import { Search, MapPin, Shield, Users, Activity, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ setScreen, stats = {}, nearbyBanks = [], onSearch }) {
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [location, setLocation] = useState('Hyderabad');
  const navigate = useNavigate();

  const handleSearch = () => {
    onSearch(bloodGroup, location);
    setScreen('donorSearch');
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header / Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/login')}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🩸 Blood<span style={{ color: 'var(--text-primary)' }}>Donor</span>
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Donate Blood<br />
            <span style={{ color: 'var(--primary)' }}>Save Life</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '480px' }}>
            Your donation can save up to 3 lives. Be a hero. Join our real-time emergency blood network today.
          </p>

          {/* Quick Search Card */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flex: 1, gap: '0.75rem', alignItems: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
              <Activity size={18} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Blood Group</div>
                <select 
                  value={bloodGroup} 
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', flex: 1.5, gap: '0.75rem', alignItems: 'center', paddingRight: '1rem' }}>
              <MapPin size={18} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Select Location</div>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or Hospital"
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: '600' }}
                />
              </div>
            </div>

            <Button onClick={handleSearch} style={{ borderRadius: '8px', padding: '12px 20px' }}>
              <Search size={18} style={{ marginRight: '6px' }} /> Search
            </Button>
          </div>

          {/* Call to Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="primary" onClick={() => navigate('/login')}>Need Blood</Button>
            <Button variant="outline" onClick={() => navigate('/login')}>Donate Blood</Button>
          </div>
        </div>

        {/* Hero Image Side */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,30,42,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
          <div style={{ zIndex: 1, backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🩸</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Active Network</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Connecting critical seekers with registered donors nearby in real-time.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.25rem' }}>{stats.activeDonors || '8,945'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Donors Online</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--success)', fontSize: '1.25rem' }}>{stats.livesSaved || '15,230'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lives Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        {[
          { label: 'Total Donors', value: stats.totalDonors || '25,680', icon: <Users size={24} color="var(--primary)" /> },
          { label: 'Active Donors', value: stats.activeDonors || '8,945', icon: <Activity size={24} color="var(--primary)" /> },
          { label: 'Lives Saved', value: stats.livesSaved || '15,230', icon: <Shield size={24} color="var(--success)" /> },
          { label: 'Blood Banks', value: stats.totalBanks || '320', icon: <PlusCircle size={24} color="var(--info)" /> }
        ].map((item, idx) => (
          <ExtraCard key={idx} padding="1.5rem">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{item.label}</div>
              </div>
            </div>
          </ExtraCard>
        ))}
      </div>

      {/* Near-by Blood Banks Section */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Nearby Blood Banks</h2>
          <Button variant="text" onClick={() => setScreen('bloodBanks')}>View All</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          {nearbyBanks.slice(0, 3).map((bank) => (
            <ExtraCard 
              key={bank.id}
              title={bank.name}
              subtitle={bank.address}
              extra={<Badge variant="success">{bank.distance}</Badge>}
              onClick={() => setScreen('bloodBanks')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {Object.keys(bank.stock).slice(0, 4).map(bg => (
                  <Badge key={bg} variant="blood">{bg}: {bank.stock[bg]} units</Badge>
                ))}
              </div>
            </ExtraCard>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '3rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {[
            { step: '1', title: 'Create Request', desc: 'Fill patient & blood details instantly.' },
            { step: '2', title: 'Notify Donors', desc: 'Nearby matching donors are alerted.' },
            { step: '3', title: 'Donor Accepts', desc: 'Donor accepts request & navigates.' },
            { step: '4', title: 'Donation Completed', desc: 'Donation finished & lives saved.' }
          ].map((item, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                {item.step}
              </div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
