
import { useContext, useEffect, useState } from 'react';
import './App.css'
import { AppRoutes } from './app/routes/AppRoutes'
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Button } from './components/common/button/Button';
import { AlertTriangle, Info } from 'lucide-react';

let socket;



function App() {
  const { user } = useContext(AuthContext);
  const [alertToast, setAlertToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // fetchData();

      // Setup WebSocket
      socket = io(import.meta.env.VITE_BACKEND_URL);

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      // Handle real-time alert broadcasts
      socket.on('emergency_alert', (data) => {
        setAlertToast({
          type: 'danger',
          message: data.message,
          action: () => {
            navigate(`/requests/${data.request.id}`);
            setAlertToast(null);
          }
        });
        // Add notification locally instantly
      });

      // socket.on('notification_broadcast', (notif) => {
      //   setNotifications(prev => [notif, ...prev]);
      // });

      // socket.on('requests_updated', (updatedRequests) => {
      //   setRequests(updatedRequests);
      // });

      // socket.on('banks_updated', (updatedBanks) => {
      //   setBanks(updatedBanks);
      // });

      socket.on('donation_accepted', (data) => {
        setAlertToast({
          type: 'success',
          message: data.message,
          action: () => {
            navigate(`/requests/${data.request.id}`);
            setAlertToast(null);
          }
        });
      });
    }

    return () => {
      if (socket) 
      socket.disconnect();
    };
  }, [user]);

  // Sync user identification on websocket when logged in
  useEffect(() => {
    if (user && socket) {
      socket.emit('register_user', user.id);
    }
  }, [user]);
  return (<>
    {alertToast && (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: alertToast.type === 'danger' ? '#FEF2F2' : '#ECFDF5',
          border: alertToast.type === 'danger' ? '1px solid #FCA5A5' : '1px solid #A7F3D0',
          color: alertToast.type === 'danger' ? 'var(--danger)' : 'var(--success)',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '320px',
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          {alertToast.type === 'danger' ? <AlertTriangle size={20} /> : <Info size={20} />}
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', lineHeight: 1.4 }}>{alertToast.message}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
          <Button size="sm" variant="secondary" onClick={() => setAlertToast(null)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Dismiss</Button>
          {alertToast.action && (
            <Button size="sm" variant="primary" onClick={alertToast.action} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>View</Button>
          )}
        </div>
      </div>
    )}
    <AppRoutes>
    </AppRoutes>
  </>)
}

export default App
