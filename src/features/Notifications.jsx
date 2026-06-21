import ExtraCard from '../components/common/card/Card';
import { useEffect, useState } from 'react';
import useAbortController from '../hooks/useAbortController';
import { getNotifications } from '../services/notification.service';

export function NotificationsView() {
    const [notifications, setNotifications] = useState([]);
    const {getSignal} = useAbortController();

    useEffect(() => {
        (async () => {
            try {
                const data = await getNotifications({ signal: getSignal() });   
                setNotifications(data);
            } catch (err) {
                setNotifications([]);
                console.error('Failed to fetch notifications:', err);
            }
        })();   
    }, []);
  return (
    <div className="animate-slide-in" style={{ maxWidth: '600px', margin: '0 auto' , marginBottom: '1.5rem'}}>
      <h1 className="header-title">Notifications</h1>
      <p className="header-subtitle">Historical alert records and activity tracking</p>
      <ExtraCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.isArray(notifications) && notifications.map(notif => (
            <div key={notif.id} style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '1.25rem' }}>
                {notif.type === 'success' ? '🎉' : notif.type === 'emergency' ? '🚨' : 'ℹ️'}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>{notif.message}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </ExtraCard>
    </div>
  );
}