import ExtraCard from "../components/common/card/Card";

export default function SettingsView() {
  return (
    <div className="animate-slide-in" style={{ maxWidth: '600px', margin: '0 auto' ,marginBottom: '1.5rem'}}>
      <h1 className="header-title">Account Settings</h1>
      <p className="header-subtitle">Manage preferences and profile access options</p>
      <ExtraCard title="Security & Notifications">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Receive emergency SMS alerts</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Show exact coordinates on maps</span>
            <input type="checkbox" />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Visible to blood bank searches</span>
            <input type="checkbox" defaultChecked />
          </label>
        </div>
      </ExtraCard>
    </div>
  );
}