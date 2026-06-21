import { Header } from "../../components/Header/Header";
import { useContext } from "react";
import { SidebarContent } from "../../components/sidebar/SideBar";
import { Footer } from "../../components/footer/Footer";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";

export function LayoutContainer({mob, sideOpen, setSideOpen}) {
       const {user} = useContext(AuthContext);
    const SBW = 214;
    if (!user) {
    return <Navigate to="/login" replace />;
  }
    return <div className="layout-container">
        <Header
            sideOpen={sideOpen}
            setSideOpen={setSideOpen}
            mob={mob}>
        </Header>
        {/* ═══ BODY (sidebar + main) ════════════════════════════════════════ */}
        <div style={{
            paddingTop: 60,
            paddingLeft: !mob && sideOpen ? SBW : 0,
            transition: "padding-left 0.25s cubic-bezier(0.4,0,0.2,1)",
            minHeight: "calc(100vh - 60px)",
        }}>
            {/* Mobile dim overlay */}
            {mob && sideOpen && (
                <div
                    onClick={() => setSideOpen(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 150 }}
                />
            )}

            <aside style={{
                position: "fixed", top: 60, left: 0, bottom: 0, width: SBW,
                background: 'var(--surface)', borderRight: `1px solid var(--border)`,
                zIndex: mob ? 160 : 100,
                transform: sideOpen ? "translateX(0)" : `translateX(-${SBW}px)`,
                transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                display: "flex", flexDirection: "column", overflowY: "auto",
            }}>
                <SidebarContent
                    mob={mob}
                    setSideOpen={setSideOpen} />
            </aside>
            <main style={{ padding: mob ? 14 : 20, margin: "0 auto" , display: "flex", flexDirection: "column", minHeight: "calc(100vh - 60px)" ,justifyContent: "space-between"}}>
            {/* <Dashboard mob={mob}></Dashboard> */}
            <ProtectedRoute>
            <Outlet />
            </ProtectedRoute>
            <Footer></Footer>
            </main>
        </div>
    </div>
}