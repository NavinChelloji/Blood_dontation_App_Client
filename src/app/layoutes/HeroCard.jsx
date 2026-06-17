import { Droplets } from "lucide-react"
import { Card } from "../../components/common/card/Card"
import { Button } from "../../components/common/button/Button"

export const HeroCard = ({ mob }) => {
    return <>
        {/* Hero card */}
        <Card style={{ position: "relative", overflow: "hidden", minHeight: 170, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: 12, color: 'var(--sub)', margin: "0 0 3px", fontWeight: 500 }}>Be a Hero,</p>
            <h1 style={{ fontSize: mob ? 22 : 30, fontWeight: 900, color: 'var(--primary-color)', margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                Donate Blood
            </h1>
            <p style={{ fontSize: 12, color: 'var(--sub)', margin: "0 0 18px" }}>Your donation can save up to 3 lives.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button variant="primary">Donate Now</Button>
                    <Button variant="outline">Learn More</Button>
            </div>
            {/* Decorative background icon */}
            <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.05 }}>
                <Droplets size={mob ? 60 : 120} color='var(--primary-color)' />
            </div>
        </Card>

    </>
}