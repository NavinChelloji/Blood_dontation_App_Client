
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LayoutContainer } from './app/layoutes/Layoute'

import { useState } from 'react'
import LandingPage from './Pages/LandingPage'
import { LoginPage } from './Pages/LoginPage'

function App() {
  const [user, ] = useState(null);
  // const navigate = useNavigate();

  // App data states
  const [requests, ] = useState([]);
  const [banks, ] = useState([]);
  const [notifications, ] = useState([]);
  const [, setSearchedDonors] = useState([]);
  const [activeDonorsCount, ] = useState(0);

  // Alert toast message
  // const [alertToast, setAlertToast] = useState(null);

   const handleDonorSearch = async (bloodGroup, radius) => {
    try {
      const response = await fetch(`/api/donors/search?bloodGroup=${bloodGroup}&radius=${radius}&lat=17.4156&lng=78.4347`);
      const data = await response.json();
      setSearchedDonors(data);
    } catch (err) {
      console.error('Failed to search donors:', err);
    }
  };

  return (
    <Routes>
      <Route path="/" element={
          <div style={{ padding: '0 2rem', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
            <LandingPage 
              stats={{
                totalDonors: '25,680',
                activeDonors: activeDonorsCount,
                livesSaved: '15,230',
                totalBanks: banks.length
              }} 
              nearbyBanks={banks} 
              onSearch={handleDonorSearch}
            />
          </div>
        } />
        <Route path="/login" element={
          <div style={{ padding: '0 2rem', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
            <LoginPage/>
          </div>
        } />
        <Route path="/dashboard" element={
            <LayoutContainer 
              user={user} 
              requests={requests} 
              notifications={notifications} 
              // onToggleStatus={handleToggleStatus}
              activeDonorsCount={activeDonorsCount}
            />
          } />
          {/* <Route path="/requests" element={<BloodRequestsList requests={requests} />} />
          <Route path="/requests/new" element={<BloodRequestWizard onSubmit={handleCreateRequest} />} />
          <Route path="/requests/:id" element={<BloodRequestDetails requests={requests} user={user} onAcceptRequest={handleAcceptRequest} />} />
          
          <Route path="/donors" element={<DonorSearch onSearch={handleDonorSearch} donors={searchedDonors} />} />
          <Route path="/donors/:id" element={<DonorProfile donors={searchedDonors} currentUser={user} />} />
          <Route path="/profile" element={<DonorProfile donors={searchedDonors} currentUser={user} />} />
          
          <Route path="/banks" element={<BloodBanks banks={banks} onUpdateStock={handleUpdateStock} user={user} />} />
          <Route path="/banks/:id" element={<BloodBanks banks={banks} onUpdateStock={handleUpdateStock} user={user} />} />
          
          <Route path="/notifications" element={<NotificationsView notifications={notifications} />} />
          <Route path="/settings" element={<SettingsView />} />
    <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  )
}

export default App
