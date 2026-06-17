import { Header } from "../../components/Header/Header";
import { useState, useEffect } from "react";
import { SidebarContent } from "../../components/sidebar/SideBar";
import { Dashboard } from "../../features/dashboard/Dashboard";
import { Footer } from "../../components/footer/Footer";

export function LayoutContainer() {
    const [sideOpen, setSideOpen] = useState(true);
    const [w, setW] = useState(1200);
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
    const SBW = 214;
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
            <main style={{ padding: mob ? 14 : 20, margin: "0 auto" }}>
            <Dashboard mob={mob}></Dashboard>
            <Footer></Footer>
            </main>
        </div>
    </div>
}