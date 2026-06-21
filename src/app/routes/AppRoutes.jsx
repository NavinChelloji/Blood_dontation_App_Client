import { Navigate, Route, Routes } from "react-router-dom"
import LandingPage from "../../Pages/LandingPage"
import { LoginPage } from "../../Pages/LoginPage"
import { RegisterPage } from "../../Pages/RegisterPage"
import { LayoutContainer } from "../layoutes/Layoute"
import { BloodRequestWizard } from "../../features/bloodRequest/BloodRequestPage"
import { BloodRequestsList } from "../../features/bloodRequest/BloodRequestList"
import { BloodRequestDetails } from "../../features/bloodRequest/BloodRequestDetails"
import { Dashboard } from "../../features/dashboard/Dashboard"
import { useEffect, useState } from "react"
import { DonorProfile } from "../../features/donor/DonorProfile"
import { DonorSearch } from "../../features/donor/DonorsList"
import { NotificationsView } from "../../features/Notifications"
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import SettingsView from "../../features/Settings"

export const AppRoutes = ({ banks, handleDonorSearch }) => {
    const [sideOpen, setSideOpen] = useState(true);
    const [w, setW] = useState(1200);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const upd = () => {
            const nw = window.innerWidth;
            setW(nw);
            setSideOpen(nw >= 768);
        };
        upd();
        window.addEventListener("resize", upd);
        return () => window.removeEventListener("resize", upd);
    }, []);
    const mob = w < 768;

    return (
        <Routes>
            <Route path="/" element={
                <div style={{ padding: '0 2rem', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
                    <LandingPage
                        stats={{
                            totalDonors: '25,680',
                            activeDonors: '30',
                            livesSaved: '15,230',
                            totalBanks: '2'
                        }}
                        nearbyBanks={banks}
                        onSearch={handleDonorSearch}
                    />
                </div>
            } />
            <Route path="/login" element={
                <div style={{ padding: '0 2rem', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
                    <LoginPage />
                </div>
            } />
            <Route path="/register" element={
                <div style={{ padding: '0 2rem', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
                    <RegisterPage />
                </div>
            } />
            <Route element={
                <LayoutContainer mob={mob} sideOpen={sideOpen} setSideOpen={setSideOpen} />
            } >
                <Route path='/dashboard' element={<Dashboard mob={mob} />} ></Route>
                <Route path="/requests" element={<BloodRequestsList />} />
                <Route path="/requests/new" element={<BloodRequestWizard />} />
                <Route path="/requests/:id" element={<BloodRequestDetails mob={mob} />} />
                <Route path="/donors" element={<DonorSearch />} />
                <Route path="/donors/:id" element={<DonorProfile mob={mob} />} />
                <Route path="/notifications" element={<NotificationsView />} />
                <Route path="/profile" element={<DonorProfile id={user?.id} mob={mob} />} />
                <Route path="/settings" element={<SettingsView />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}